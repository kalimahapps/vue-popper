<script setup>
import VuePopperAnimation from "../components/VuePopperAnimations.vue";
import VuePopperAnimationsDuration from "../components/VuePopperAnimationsDuration.vue";
import VuePopperPlacement from "../components/VuePopperPlacement.vue";
</script>

# What is Vue Popper?
Vue Popper is a Vue 3 component that wraps [Popper.js](https://popper.js.org/) to provide a simple way to create tooltips, popovers, dropdowns, and more.

It provides a declarative API that allows you to easily create complex UIs without having to worry about positioning.

It is fully customizable and has small footprint.

:::tip
All examples in the documentation use the new [script setup](https://vuejs.org/api/sfc-script-setup.html#script-setup) syntax for brevity.
:::

## Trigger
Vue popper can be triggered by either clicking or hovering over the trigger element.

<VuePopper text="Click" :hover="false" style="margin-right: 1em;" />

<VuePopper text="Hover" hover />


## Animations
Vue Popper comes with a few built-in animations. See below for a list of available animations.

You can also add a custom animation by passing the name of the animation class to the `animation` prop.
<VuePopperAnimation />

## Animation Duration
<VuePopperAnimationsDuration />

## Placement
Vue Popper can be placed in any of the 12 positions relative to the trigger element. See below for a list of available placements.
<VuePopperPlacement />

<br>
VuePopper has many other features that you can explore in the documentation.

## Nested
Vue Popper can be nested inside other Vue Popper components.
<VuePopper interactive text="Start">
	<VuePopper placement="right" interactive text="First level">
		<VuePopper interactive text="Secon level">
			<VuePopper interactive text="One more level" placement="right">
				<VuePopper interactive text="Almost there!!">
					You have arrived! 🎉
				</VuePopper>
			</VuePopper>
		</VuePopper>
	</VuePopper>
</VuePopper>