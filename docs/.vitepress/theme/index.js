import DefaultTheme from 'vitepress/theme';
import VuePopper from './VuePopper.vue';

import './custom.css';

export default {
	...DefaultTheme,
	enhanceApp(context) {
		DefaultTheme.enhanceApp(context);
		context.app.component('VuePopper', VuePopper);
	},
};