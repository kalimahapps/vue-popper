# Composition API Usage

Import and call the `useVuePopper`.
```vue
<script>
import { useVuePopper } from '@kalimahapps/vue-popper';

const VuePopperOptions = {
	hover: false,
	showArrow: true,
	strategy: 'fixed'
}

const {
	popperInstance,
	triggerElement,
	tooltipElement
} = useVuePopper(VuePopperOptions);
</script>
```

As you notice, the `useVuePopper` returns an object with three properties:
- `popperInstance`: The popper instance. It will give you access to the popper instance.
- `triggerElement`: The trigger element. Use this to add the trigger element.
- `tooltipElement`: The tooltip element. Use this to add the tooltip element.

We can use these in template to add the trigger and tooltip elements. Like this:

```vue
<template>
	<div class="popper-container">
		<component :is="triggerElement">
			Click here for more info
		</component>

		<component :is="tooltipElement">
			More info
		</component>
	</div>
</template>
```