<template>
  <div
    class="popper-container"
    @mouseleave="toggleTooltipHover('close')"
    @blur="toggleTooltipHover('close')"
    :style="getContainerStyle"
  >
    <div
      aria-describedby="tooltip"
      ref="triggerElement"
      class="trigger-element"
      @click="toggleTooltip()"
      @mouseenter="toggleTooltipHover('open')"
      @focus="toggleTooltipHover('open')"
    >
      <slot />
    </div>
    <Transition :name="getTransitionNames.outer">
      <div class="popper-content-wrapper" role="tooltip" ref="tooltipElement" v-show="isOpened">
        <Transition :name="getTransitionNames.inner">
          <div class="popper-content" v-show="isOpened">
            <slot name="content" :close="closeWithDelay" :isOpened="isOpened" />
            <div data-popper-arrow="true" v-show="showArrow" />
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, computed, PropType, toRef } from 'vue';
import { onClickOutside, useDebounceFn } from '@vueuse/core';
import type { Instance, PositioningStrategy, Placement } from '@popperjs/core';
import { createPopper } from '@popperjs/core';

const props = defineProps({
  /**
   * Trigger element on hover
   */
  hover: {
    type: Boolean,
    default: false,
  },

  /**
   * Disable clicking outside to close
   */
  disableClickOutside: {
    type: Boolean,
    default: false,
  },

  /**
   * How many milliseconds to wait before opening the tooltip
   */
  openDelay: {
    type: [Number, String],
    default: 0,
    validator: (value: number | string) => {
      const isPositive = value >= 0;
      if (!isPositive) {
        console.warn('@kalimahapps/vue-popper: openDelay must be a positive number');
        return false;
      }
      return true;
    },
  },

  /**
   * How many milliseconds to wait before closing the tooltip
   */
  closeDelay: {
    type: [Number, String],
    default: 0,
    validator: (value: number | string) => {
      const isPositive = value >= 0;
      if (!isPositive) {
        console.warn('@kalimahapps/vue-popper: closeDelay must be a positive number');
        return false;
      }

      return true;
    },
  },

  /**
   * Display an arrow on the tooltip
   */
  showArrow: {
    type: Boolean,
    default: true,
  },

  /**
   * Whether to interact with tooltip when hover is true
   */
  interactive: {
    type: Boolean,
    default: false,
  },

  /**
   * Set the strategy used to position the popper
   *
   * @values absolute | fixed
   */
  strategy: {
    type: String as PropType<PositioningStrategy>,
    default: 'absolute',
  },

  /**
   * Set the placement of the popper
   */
  placement: {
    type: String as PropType<Placement>,
    default: 'right',
  },

  /**
   * Set the modifiers of the popper
   */
  modifiers: {
    type: Array,
    default: () => [],
  },

  /**
   * Set the type of animation
   *
   * @values none, fade, fade-slide
   */
  animation: {
    type: String,
    default: 'fade-slide',
  },

  /**
   * Animation duration in milliseconds
   */
  animationDuration: {
    type: Number,
    default: 300,
  },

  /**
   * Popper options to merge with default options
   *
   * @see https://popper.js.org/docs/v2/
   */
  popperOptions: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['opened', 'closed']);

// Deprecate popperOptions in favor of multiple props
if (Object.keys(props.popperOptions).length > 0) {
  console.warn('@kalimahapps/vue-popper: popperOptions is deprecated. Use the individual props instead.');
}

/**
 * Set default popper default options
 */
const popperDefaultOptions = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 12],
      },
    },
    {
      name: 'preventOverflow',
      options: {
        padding: 8,
      },
    },
    {
      name: 'flip',
      options: {
        fallbackPlacements: ['top', 'bottom', 'left', 'right'],
      },
    },
    {
      name: 'arrow',
      options: {
        element: ':scope > .popper-content > [data-popper-arrow]',
      },
    },
  ],
};

/**
 * Whether the tooltip is opened
 */
const isOpened = ref(false);

/**
 * Set up elements and instances
 */
const triggerElement = ref<Element>();
const tooltipElement = ref<HTMLElement>();
const popperInstance = ref<Instance>();

/**
 * Get current placement of the tooltip
 */
const placementState = ref(props.placement);

/**
 * List of transform directions for slide
 * animation
 */
const transformMap = {
  top: 'translateY(-7px)',
  bottom: 'translateY(7px)',
  left: 'translateX(-7px)',
  right: 'translateX(7px)',
};

/**
 * Get the transform value of the tooltip for slide animation
 */
const getSlideTransform = computed(() => {
  if (transformMap[placementState.value] !== undefined) {
    return transformMap[placementState.value];
  }
  return 'translate(0, 0)';
});

/**
 * Get the animation class
 */
const getTransitionNames = computed(() => {
  const { animation } = props;

  if (animation === 'fade') {
    return {
      outer: 'fade',
      inner: '',
    };
  }

  if (animation === 'fade-slide') {
    return {
      outer: 'fade',
      inner: 'slide',
    };
  }

  return {
    outer: '',
    inner: '',
  };
});

/**
 * Get the animation duration in seconds
 */
const getTransitionDuration = computed(() => {
  return props.animationDuration / 1000 + 's';
});

/**
 * Handle the opening of the tooltip with delay
 */
const openWithDelay = useDebounceFn(() => {
  placementState.value = popperInstance.value?.state.placement;

  isOpened.value = true;
}, props.openDelay);

/**
 * Handle the closing of the tooltip with delay
 */
const closeWithDelay = useDebounceFn(() => {
  isOpened.value = false;
}, props.closeDelay);

/**
 * Handle click outside to close the tooltip
 */
onClickOutside(
  triggerElement,
  () => {
    if (props.disableClickOutside !== true) {
      toggleTooltip('close');
    }
  },
  {
    ignore: [tooltipElement],
  }
);

/**
 * Toggle tooltip status on hover
 */
const toggleTooltipHover = (status = '') => {
  if (props.hover) {
    toggleTooltip(status);
  }
};

/**
 * Toggle tooltip status
 */
const toggleTooltip = (status = '') => {
  let nextStatus = status;

  if (status === '') {
    nextStatus = isOpened.value ? 'close' : 'open';
  }

  if (nextStatus === 'open') {
    openWithDelay();
    return;
  }
  closeWithDelay();
};

/**
 * Get popper options by merging default options with user-supplied options
 */
const getPopperOptions = computed(() => {
  return {
    ...popperDefaultOptions,
    strategy: props.strategy,
    placement: props.placement,
    modifiers: [...popperDefaultOptions.modifiers, ...props.modifiers],
    ...props.popperOptions,
  };
});

/**
 * Get offset modifier from popper options
 * Set to [0,0] if not found
 */
const getOffset = computed(() => {
  const offset = getPopperOptions.value.modifiers?.find(modifier => modifier.name === 'offset')?.options?.offset;
  const [x, y] = offset ?? [0, 0];
  return { x, y };
});

/**
 * Add a transparent border around element when interactive
 * and hover are set to true to prevent mouseleave event
 */
const getContainerStyle = computed(() => {
  if (props.interactive === false || props.hover === false) {
    return {};
  }

  return {
    border: `${getOffset.value.y}px solid transparent`,
    margin: `-${getOffset.value.y}px`,
  };
});

/**
 * Create popper instance
 */
onMounted(() => {
  if (triggerElement.value !== undefined && tooltipElement.value !== undefined) {
    popperInstance.value = createPopper(triggerElement.value, tooltipElement.value, getPopperOptions.value);
  }
});

/**
 * Destroy popper instance
 */
onUnmounted(() => {
  popperInstance.value?.destroy();
  popperInstance.value = undefined;
});

/**
 * Watch isOpened value to emit events
 */
watch(isOpened, value => {
  if (value) {
    emit('opened');

    // Update popper instance to reposition tooltip
    popperInstance.value?.update();
    return;
  }
  emit('closed');
});

defineExpose({
  popper: popperInstance,
});
</script>

<style lang="scss">
.popper-container {
  display: inline-block;
}

.popper-content-wrapper {
  z-index: 20;

  &[data-popper-placement^='top'] > .popper-content > [data-popper-arrow] {
    bottom: -4px;
  }

  &[data-popper-placement^='bottom'] > .popper-content > [data-popper-arrow] {
    top: -4px;
  }

  &[data-popper-placement^='left'] > .popper-content > [data-popper-arrow] {
    right: -4px;
  }

  &[data-popper-placement^='right'] > .popper-content > [data-popper-arrow] {
    left: -4px;
  }

  .popper-content {
    background: var(--vue-popper-bg, #fff);
    z-index: var(--vue-popper-zindex, 1000);
    box-shadow: var(
      --vue-popper-shadow,
      0 0 20px 4px rgb(154 161 177 / 15%),
      0 4px 80px -8px rgb(36 40 47 / 25%),
      0 4px 4px -2px rgb(91 94 105 / 15%)
    );
    padding: var(--vue-popper-padding, 0em);
    border-radius: var(--vue-popper-border-radius, 6px);
    color: var(--vue-popper-text-color, #000);
    border: var(--vue-popper-border, 0px solid transparent);
  }
}

[data-popper-arrow] {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--vue-popper-bg, #fff);
  visibility: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--vue-popper-bg, #fff);
    visibility: visible;
    transform: rotate(45deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity v-bind(getTransitionDuration);
}

.fade-leave-from,
.fade-enter-to {
  opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all v-bind(getTransitionDuration);
}

.slide-leave-form,
.slide-enter-to {
  transform: translateX(0);
}

.slide-enter-from,
.slide-leave-to {
  transform: v-bind(getSlideTransform);
}
</style>
