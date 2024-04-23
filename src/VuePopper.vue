<template>
	<div class="popper-container">
		<component :is="triggerElement">
			<slot />
		</component>

		<component :is="tooltipElement">
			<slot name="content" />
		</component>
	</div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { computed } from 'vue';
import type { PositioningStrategy, Placement, Modifier } from '@popperjs/core';
import { useVuePopper } from './composable';

const properties = defineProps({
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
		type: Number,
		default: 0,
		validator: (value: number) => {
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
		type: Number,
		default: 0,
		validator: (value: number) => {
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
		default: 'top',
	},

	/**
	 * Set the modifiers of the popper
	 */
	modifiers: {
		type: Array as PropType<Modifier<any, any>[]>,
		default: () => {
			return [];
		},
	},

	/**
	 * Set the type of animation
	 *
	 * @values none, fade, shift-in, shift-out, scale, CUSTOM
	 */
	animation: {
		type: String,
		default: 'shift-in',
	},

	/**
	 * Animation duration in milliseconds
	 */
	animationDuration: {
		type: [Number, Array],
		default: 300,
		validator(value) {
			if (Array.isArray(value)) {
				return value.every((durationValue) => {
					return typeof durationValue === 'number' && durationValue >= 0;
				});
			}
			return typeof value === 'number' && value >= 0;
		},
	},

	/**
	 * Popper options to merge with default options
	 *
	 * @see https://popper.js.org/docs/v2/
	 */
	popperOptions: {
		type: Object,
		default: () => { return {}; },
	},
});

const emit = defineEmits(['opened', 'closed', 'transition']);

// Deprecate popperOptions in favor of multiple props
if (Object.keys(properties.popperOptions).length > 0) {
	console.warn('@kalimahapps/vue-popper: popperOptions is deprecated. Use the individual props instead.');
}

const { popperInstance, triggerElement, tooltipElement, isOpened, toggleTooltip } = useVuePopper({
	hover: properties.hover,
	disableClickOutside: properties.disableClickOutside,
	openDelay: properties.openDelay,
	closeDelay: properties.closeDelay,
	showArrow: properties.showArrow,
	strategy: properties.strategy,
	modifiers: properties.modifiers,
	animation: properties.animation,
	placement: properties.placement,
	interactive: properties.interactive,
	animationDuration: properties.animationDuration,

	onTransition: (transition: string, element: HTMLElement) => {
		emit('transition', transition, element);
	},
	onOpened: () => {
		emit('opened');
	},
	onClosed: () => {
		emit('closed');
	},
});

defineExpose({
	popper: popperInstance,
	isOpened: computed(() => {
		return isOpened.value;
	}),
	toggleTooltip,
});
</script>
