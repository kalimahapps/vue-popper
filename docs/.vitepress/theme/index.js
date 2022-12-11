import DefaultTheme from 'vitepress/theme'
import VuePopper from './VuePopper.vue';

import './custom.css';

export default {
	...DefaultTheme,
	enhanceApp(ctx) {
		DefaultTheme.enhanceApp(ctx)
		ctx.app.component('VuePopper', VuePopper)
	}
}