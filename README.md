<h1 align="center">VuePopper</h1>

<p align="center">
Vue3 popper component
</p>

<p align="center">
<a target="_blank" href="https://www.npmjs.com/package/@kalimahapps/vue-popper">
  <img src="https://img.shields.io/npm/v/@kalimahapps/vue-popper.svg">
</a>
<a target="_blank" href="https://www.npmjs.com/package/@kalimahapps/vue-popper">
  <img src="https://img.shields.io/npm/dt/@kalimahapps/vue-popper.svg">
</a>
<img src="https://img.shields.io/badge/vue-3-%2342b883">
</p>
<p align="center">
<a target=_blank href="https://twitter.com/KalimahApps">
  <img src="https://img.shields.io/twitter/follow/KalimahApps?style=for-the-badge">
</a>
</p>
<br>
<br>

## 💽 Installation
### NPM
```bash
npm install @kalimahapps/vue-popper
```

### PNPM
```bash
pnpm add @kalimahapps/vue-popper
```
<br>
<br>

## 🔧 Usage
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
import VuePopper from '@kalimahapps/vue-popper';
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
import { createApp } from 'vue';
import VuePopper from '@kalimahapps/vue-popper';
import App from './App.vue';

const app = createApp(App);

app.component('VuePopper', VuePopper).mount('#app');
```

<br>
<br>

## 🪛 Props

| Name                  | Default      | Description                                                                                                     |
| --------------------- | ------------ | --------------------------------------------------------------------------------------------------------------- |
| show-arrow            | `true`       | Whether to show the arrow                                                                                       |
| hover                 | `false`      | Trigger element on hover                                                                                        |
| disable-click-outside | `false`      | Disable clicking outside to close                                                                               |
| open-delay            | `0`          | How many milliseconds to wait before opening the tooltip                                                        |
| close-delay           | `0`          | How many milliseconds to wait before closing the tooltip                                                        |
| interactive           | `false`      | Whether to interact with tooltip when hover is true                                                             |
| placement             | `top`        | The placement of the tooltip.                                                                                   |
| strategy              | `absolute`   | The strategy to use to position the tooltip. Can be absolute or fixed.                                          |
| modifiers             | `[]`         | The modifiers to override the default modifies.                                                                 |
| animation             | `fade-slide` | The animation to use when showing the tooltip. <br> accepts `none`, `shift-in`, `shift-out`, `scale`, or CUSTOM |
| animation-duration    | `300`        | The duration of the animation in milliseconds.                                                                  |

<br>
<br>

## Default Popper Options

These are the default popper options that will be passed to the component. If you want to override these or add new ones, you can pass your custom options to the each respective prop. (See the example at the top)

```js
{
  placement: 'top',
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 8],
      },
    },
    {
      name: 'preventOverflow',
      options: {
        padding: 8,
      },
    },
    {
      name: 'arrow',
      options: {
        padding: 5,
      },
    },
  ],
}
```

<br>
<br>

## 🧵 Slots
| Name    | Description                               |
| ------- | ----------------------------------------- |
| default | The element that will trigger the tooltip |
| content | The content of the tooltip                |

### Slots Props
These slots props are passed to content slot.
| Name      | Description                            |
| --------- | -------------------------------------- |
| is-opened | Current Status of the tooltip          |
| close     | A function that will close the tooltip |

<br>
<br>

## Events
| Name   | Description                        |
| ------ | ---------------------------------- |
| opened | Emitted when the tooltip is opened |
| closed | Emitted when the tooltip is closed |

<br>
<br>

## 🎨 Styling
To style the tooltip, you can customize the following css variables:
| Name                       | Default Value                                                                                                    | Description                                   |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| --vue-popper-bg            | `#fff`                                                                                                           | Background color of the tooltip and the arrow |
| --vue-popper-border        | `0px solid transparent`                                                                                          | Border of the tooltip                         |
| --vue-popper-border-radius | `6px`                                                                                                            | Border radius of the tooltip                  |
| --vue-popper-text-color    | `#000`                                                                                                           | Text color of the tooltip                     |
| --vue-popper-shadow        | ` 0 0 20px 4px rgb(154 161 177 / 15%), 0 4px 80px -8px rgb(36 40 47 / 25%), 0 4px 4px -2px rgb(91 94 105 / 15%)` | Box shadow of the tooltip                     |
| --vue-popper-zindex        | `1000`                                                                                                           | Z-index of the tooltip                        |
| --vue-popper-padding       | `0em`                                                                                                            | Padding of the tooltip                        |

<br>
<br>

## Exposed Refs
| Name   | Description                                                             |
| ------ | ----------------------------------------------------------------------- |
| popper | The popper instance. You can use this to call popper's instance methods |

<br>
<br>

## 🧮 Version History
- 1.1.0
  - Add composition api
  - Add eslint config
  - Update packages and config
- 1.0.8
  - Added animation and animation-duration props
- 1.0.4
  - Add popper options as individual props and deprecate the popperOptions prop
  - Fix nested tooltip bug
- 1.0.0
  - Initial Release

<br>
<br>

## 🔗 Links
- [Popper.js](https://popper.js.org/)

<br>
<br>

## 🏗️ Other projects
### [Vue Icons](https://www.npmjs.com/package/@kalimahapps/vue-icons)
55,000+ SVG icons from popular icon sets that you can add seamlessly to your vue projects

### [Vite inherit attrs](https://www.npmjs.com/package/vite-plugin-vue-setup-inherit-attrs)
A vite plugin that adds support for inheritAttrs in vue-setup

### [KalimahApps Eslint Config](https://www.npmjs.com/package/@kalimahapps/eslint-config)
Comprehensive eslint rules for vue projects with typescript

<br>
<br>

## ⚖️ License
This project is licensed under the MIT License