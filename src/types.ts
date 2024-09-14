import type { PositioningStrategy, Placement, Modifier } from '@popperjs/core';

type Options = {
	placement?: Placement;
	hover?: boolean;
	disableClickOutside?: boolean;
	openDelay?: number;
	closeDelay?: number;
	showArrow?: boolean;
	strategy?: PositioningStrategy;
	animation?: string;
	animationDuration?: number | number[];
	popperOptions?: object;
	modifiers?: Modifier<any, any>[];
	element?: string;
	onOpened?: () => void;
	onClosed?: () => void;
	onTransition?: (transition: string, element: HTMLElement) => void;
};

type TransitionNames = {
	outer: string;
	inner: string;
};

export type { Options, TransitionNames };