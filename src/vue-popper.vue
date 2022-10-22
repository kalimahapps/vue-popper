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
    <Transition name="fade">
      <div class="popper-content" role="tooltip" ref="tooltipElement" v-show="isOpened">
        <slot name="content" />
        {{ showArrow }}
        <div id="arrow" data-popper-arrow v-show="showArrow" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, computed } from 'vue';
import { onClickOutside, useDebounceFn } from '@vueuse/core';
import { Instance, createPopper } from '@popperjs/core';

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
 * Handle the opening of the tooltip with delay
 */
const openWithDelay = useDebounceFn(() => {
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

  &[data-popper-placement^='top'] > #arrow {
    bottom: -4px;
  }

  &[data-popper-placement^='bottom'] > #arrow {
    top: -4px;
  }

  &[data-popper-placement^='left'] > #arrow {
    right: -4px;
  }

  &[data-popper-placement^='right'] > #arrow {
    left: -4px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

#arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: inherit;
  visibility: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: inherit;
    visibility: visible;
    transform: rotate(45deg);
  }
}
</style>
