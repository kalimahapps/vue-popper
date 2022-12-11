# Component Usage

### Local Registration

```vue
<template>
	<VuePopper hover placement="top">
		<template #default>
			<button>Hover me</button>
		</template>

		<template #content>
			<div class="p-2">
				<p class="text-sm">This is a tooltip</p>
			</div>
		</template>
	</VuePopper>
</template>

<script lang="ts" setup>
import VuePopper from "@kalimahapps/vue-popper";
</script>

<style lang="scss" scoped></style>
```

### Global Registration

```vue
// your-component.vue
<template>
	<vue-popper hover placement="top">
		<template #default>
			<button>Hover me</button>
		</template>

		<template #content>
			<div class="p-2">
				<p class="text-sm">This is a tooltip</p>
			</div>
		</template>
	</vue-popper>
</template>
```

```js
// main.js
import { createApp } from "vue";
import VuePopper from "@kalimahapps/vue-popper";
import App from "./App.vue";

const app = createApp(App);

app.component("VuePopper", VuePopper).mount("#app");
```
