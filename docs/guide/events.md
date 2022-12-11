# Events

These are the events that are emitted by the tooltip component.

:::tip
If you used the component method, you can listen to these events using the `@event-name` syntax. If you used the composition method, you can listen to these events by prefixing the event name with `on` and using camel case. For example, `opened` event will be `onOpened`.
:::

### `opened`
Triggered when tooltip is opened

### `closed`
Triggered when tooltip is closed

### `transition`
Triggered during the various stages of the tooltip transition. The event has the following parameters:

- `stage`: The stage of the transition. They are the same as vue js hooks:
  - `before-enter`
  - `enter`
  - `after-enter`
  - `before-leave`
  - `leave`
  - `after-leave`
- `el`: The tooltip element.


## Examples
### Component method
```vue
<template>
  <VuePopper
      @opened="handleOpen"
      @closed="handleClose"
      @transition="handleTransition"
    >
    <template #default>Click me</template>
    <template #content>This is a tooltip</template>
  </VuePopper>
</template>
```

### Composition method
```vue
<template>
  <component :is="triggerElement">Click here for more info</component>
	<component :is="tooltipElement">More info</component>
</template>

<script lang="ts" setup>
import { useVuePopper } from "@kalimahapps/vue-popper";

const { triggerElement, tooltipElement } = useVuePopper({
  showArrow: true,
  placement: "top",
  onOpened: () => console.log("opened"),
  onClosed: () => console.log("closed"),
  onTransition: (stage, el) => console.log(stage, el),
});
```