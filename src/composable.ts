import {
	ref,
	withDirectives,
	vShow,
	onUnmounted,
	h,
	computed,
	watch,
	Transition,
	onMounted
} from 'vue';
import type { SetupContext, VNode } from 'vue';
import { createPopper } from '@popperjs/core';
import type {
	Instance,
	PositioningStrategy,
	Placement,
	Modifier,
	Options as ModifierOptions
} from '@popperjs/core';
import { onClickOutside, useDebounceFn } from '@vueuse/core';
import './style.scss';

/**
 * Set default popper default options
 */
const popperDefaultOptions = {
	modifiers: [
		{
			name: 'offset',
			options: { offset: [0, 12] },
		},
		{
			name: 'preventOverflow',
			options: { padding: 8 },
		},
		{
			name: 'flip',
			options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] },
		},
		{
			name: 'arrow',
			options: { element: ':scope > .popper-content > [data-popper-arrow]' },
		},
	],
};

/**
 * Generate a css text from style object
 *
 * @param  {object} style List of style properties
 * @param  {object} extra Extra style properties
 * @return {string}       Css string
 */
const createCssText = function (style: object = {}, extra: object = {}): string {
	const combined = {
		...style,
		...extra,
	};

	const cssText = [];
	for (const [key, value] of Object.entries(combined)) {
		cssText.push(`${key}: ${value};`);
	}

	return cssText.join(' ');
};

/**
 * List of transform directions for shift
 * animation
 */
const shiftMap = {
	top: 'translateY(-7px)',
	bottom: 'translateY(7px)',
	left: 'translateX(-7px)',
	right: 'translateX(7px)',
};

const transformOriginMap = {
	top: 'bottom center',
	bottom: 'top center',
	left: 'center right',
	right: 'center left',
};

type Options = {
	placement?: Placement;
	hover?: boolean;
	disableClickOutside?: boolean;
	openDelay?: number;
	closeDelay?: number;
	showArrow?: boolean;
	strategy?: PositioningStrategy;
	interactive?: boolean;
	animation?: string;
	animationDuration?: number | number[];
	popperOptions?: object;
	modifiers?: Modifier<string, ModifierOptions>[];
	onOpened?: () => void;
	onClosed?: () => void;
	onTransition?: (transition: string, element: HTMLElement) => void;
};

type TransitionNames = {
	outer: string;
	inner: string;
};

// eslint-disable-next-line max-lines-per-function
const useVuePopper = function (suppliedOptions: Options = {}) {
	const defaults: Options = {
		placement: 'bottom',
		hover: false,
		disableClickOutside: false,
		openDelay: 0,
		closeDelay: 0,
		showArrow: true,
		strategy: 'absolute',
		interactive: false,
		animation: 'shift-in',
		animationDuration: 300,
		popperOptions: {},
		modifiers: [],
		onOpened: () => {
			/**
			 * Callback when the tooltip is opened
			 */
		},
		onClosed: () => {
			/**
			 * Callback when the tooltip is closed
			 */
		},
		onTransition: () => {
			/**
			 * Callback when the tooltip is transitioning
			 *
			 * @param {string}      transition Name of the transition
			 * @param {HTMLElement} element    Element that is transitioning
			 */
		},
	};

	const options: Options = {
		...defaults,
		...suppliedOptions,
	};

	const triggerReference = ref(undefined);
	const tooltipReference = ref(undefined);
	const popperInstance = ref<Instance | undefined>(undefined);
	const isOpened = ref(false);
	const isTargetHovered = ref(false);
	const isTooltipHovered = ref(false);

	/**
	 * Get current placement of the tooltip
	 */
	const placementState = ref(options.placement || 'top');

	/**
	 * Get popper options by merging default options with user-supplied options
	 */
	const getPopperOptions = computed(() => {
		let { modifiers } = popperDefaultOptions;
		if (options.modifiers) {
			modifiers = [...modifiers, ...options.modifiers];
		}

		return {
			...popperDefaultOptions,
			strategy: options.strategy,
			placement: options.placement,
			modifiers,
			...options.popperOptions,
		};
	});

	// Add a minor delay to the close delay to check if the user is hovering the tooltip
	const getCloseDelay = function () {
		if (options.hover === false || options.interactive === false) {
			return options.closeDelay;
		}

		return options.closeDelay === 0 ? 150 : options.closeDelay;
	};

	/**
	 * Handle the opening of the tooltip with delay
	 */
	const openWithDelay = useDebounceFn(async () => {
		const updated = await popperInstance.value?.update();
		placementState.value = updated?.placement || options.placement;
		isOpened.value = true;
	}, options.openDelay);

	/**
	 * Handle the closing of the tooltip with delay
	 */
	const closeWithDelay = useDebounceFn(() => {
		if (options.hover === false || options.interactive === false) {
			isOpened.value = false;
			return;
		}

		// Make sure both elements are not hovered before closing
		if (isTargetHovered.value === false && isTooltipHovered.value === false) {
			isOpened.value = false;
		}
	}, getCloseDelay());

	/**
	 * Toggle tooltip status
	 *
	 * @param {string} status The status of the tooltip (open|close)
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
	 * Toggle tooltip status on hover
	 *
	 * @param {string} status The status of the tooltip (open|close)
	 * @param {string} source The source of the event (trigger|tooltip)
	 */
	const toggleTooltipHover = (status = '', source = '') => {
		if (options.hover === false) {
			return;
		}

		if (source === 'trigger') {
			isTargetHovered.value = status === 'open';
		} else {
			isTooltipHovered.value = status === 'open';
		}

		toggleTooltip(status);
	};

	/**
	 * Build trigger element
	 *
	 * @param  {object}       props   Props passed to the component
	 * @param  {SetupContext} context Context passed to the component
	 * @return {VNode}                Trigger element
	 */
	const triggerElement = function (props: object, context: SetupContext): VNode {
		const { slots } = context;
		return h('div',
			{
				class: 'trigger-element',
				ref: triggerReference,
				ariaDescribedby: 'tooltip',
				onMouseenter: () => {
					return toggleTooltipHover('open', 'trigger');
				},
				onMouseleave: () => {
					return toggleTooltipHover('close', 'trigger');
				},
				onFocus: () => {
					return toggleTooltipHover('open');
				},
				onClick: () => {
					return toggleTooltip();
				},
			},
			slots.default ? slots.default() : '');
	};

	/**
	 * Get the animation class
	 */
	const getTransitionNames = computed<TransitionNames>(() => {
		const { animation } = options;

		if (animation === 'none') {
			return {
				outer: '',
				inner: '',
			};
		}

		let animationName = animation;

		// Backward compatibility
		if (animation === 'fade-slide') {
			animationName = 'shift-in';
		}

		return {
			outer: 'fade',
			inner: animationName,
		};
	});

	/**
	 * Get the animation duration in seconds
	 * Animation duration can be a single number
	 * or an array of numbers for each direction
	 * of the animation
	 */
	const getTransitionDuration = computed(() => {
		const { animationDuration } = options;

		if (!Array.isArray(animationDuration)) {
			const animationDurationWithDefault: number = animationDuration || 300;
			return {
				enter: `${animationDurationWithDefault / 1000}s`,
				leave: `${animationDurationWithDefault / 1000}s`,
			};
		}

		const [enter, leave] = animationDuration;
		return {
			enter: `${enter / 1000}s`,
			leave: `${leave / 1000}s`,
		};
	});

	/**
	 * Get the transform value of the tooltip for slide animation
	 */
	const getShiftTransform = computed(() => {
		const getTransform = Object.keys(shiftMap).find((key) => {
			return placementState.value.startsWith(key);
		});

		if (getTransform === undefined) {
			return 'translate(0, 0)';
		}

		return shiftMap[getTransform];
	});

	const getScaleOrigin = computed(() => {
		const getScale = Object.keys(transformOriginMap).find((key) => {
			return placementState.value.startsWith(key);
		});

		if (getScale === undefined) {
			return 'center center';
		}

		return transformOriginMap[getScale];
	});

	const createTooltipStyle = computed(() => {
		if (popperInstance.value === undefined) {
			return '';
		}

		const toggleStyle = {
			'--vue-popper-enter-duration': getTransitionDuration.value.enter,
			'--vue-popper-leave-duration': getTransitionDuration.value.leave,
			'--vue-popper-shift-transform': getShiftTransform.value,
			'--vue-popper-scale-transform-origin': getScaleOrigin.value,
		};

		const style = popperInstance.value.state.styles.popper;
		const final = createCssText(style, toggleStyle);
		return final;
	});

	const onTransitionCallback = (type: string, element: HTMLElement) => {
		if (options.onTransition !== undefined) {
			options.onTransition(type, element);
		}
	};

	/**
	 * Build tooltip element
	 *
	 * @param  {object}       props   Props passed to the component
	 * @param  {SetupContext} context Context passed to the component
	 * @return {VNode}                Tooltip element
	 */
	const tooltipElement = function (props: object, context: SetupContext): VNode {
		const { slots } = context;
		return h(Transition,
			{ name: getTransitionNames.value.outer },
			{
				default: () => {
					return withDirectives(
						h(
							'div',
							{
								class: 'popper-content-wrapper',
								ref: tooltipReference,
								style: createTooltipStyle.value,
								onMouseleave: () => {
									if (options.hover === false || options.interactive === false) {
										return;
									}
									toggleTooltipHover('close', 'tooltip');
								},
								onMouseenter: () => {
									if (options.hover === false || options.interactive === false) {
										return;
									}
									toggleTooltipHover('open', 'tooltip');
								},
							},
							[
								h(Transition,
									{
										'name': getTransitionNames.value.inner,
										'data-placement': placementState.value,
										'data-name': getTransitionNames.value.inner,

										onBeforeEnter(element: HTMLElement) {
											onTransitionCallback('before-enter', element);
										},

										onEnter(element: HTMLElement) {
											if (getTransitionNames.value.inner === 'shift-out') {
												element.style.animation = `shift-out ${getTransitionDuration.value.enter}`;
											}

											onTransitionCallback('enter', element);
										},

										onAfterEnter(element: HTMLElement) {
											if (getTransitionNames.value.inner === 'shift-out') {
												element.style.transform = getShiftTransform.value;
											}

											onTransitionCallback('after-enter', element);
										},

										onBeforeLeave(element: HTMLElement) {
											if (getTransitionNames.value.inner === 'shift-out') {
												element.style.transform = getShiftTransform.value;
												element.style.animation = '';
											}

											onTransitionCallback('before-leave', element);
										},

										onLeave(element: HTMLElement) {
											if (getTransitionNames.value.inner === 'shift-out') {
												element.style.transform = 'translate(0, 0)';
											}

											onTransitionCallback('leave', element);
										},

										onAfterLeave(element: HTMLElement) {
											if (getTransitionNames.value.inner === 'shift-out') {
												element.style.transform = 'translate(0, 0)';
											}

											onTransitionCallback('after-leave', element);
										},
									},
									{
										default: () => {
											return withDirectives(h('div',
												{ class: 'popper-content' },
												[
													slots.default ? slots.default() : '',
													h('div',
														{
															'data-popper-arrow': true,
															'style': options.showArrow === true ? 'display: block' : 'display: none',
														}),
												]), [[vShow, isOpened.value === true]]);
										},
									}),
							]
						),
						[[vShow, isOpened.value === true]]
					);
				},
			});
	};

	/**
	 * Handle click outside to close the tooltip
	 */
	onClickOutside(
		triggerReference,
		() => {
			if (options.disableClickOutside !== true) {
				toggleTooltip('close');
			}
		},
		{ ignore: [tooltipReference] }
	);

	/**
	 * Create popper instance
	 */
	onMounted(() => {
		if (triggerReference.value !== undefined && tooltipReference.value !== undefined) {
			popperInstance.value = createPopper(
				triggerReference.value,
				tooltipReference.value,
				getPopperOptions.value
			);
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
	watch(isOpened, (value) => {
		if (value === false) {
			if (options.onClosed !== undefined) {
				options.onClosed();
			}
			return;
		}

		if (options.onOpened !== undefined) {
			options.onOpened();
		}

		// Update popper instance to reposition tooltip
		popperInstance.value?.update();
	});

	return {
		triggerElement,
		tooltipElement,
		popperInstance,
		toggleTooltip,
		isOpened: computed(() => { return isOpened.value; }),
	};
};

export { useVuePopper };