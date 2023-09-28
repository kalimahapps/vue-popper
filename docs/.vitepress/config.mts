import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "Documentation",
	description: "Documentation for VuePopper Dashboard",
	base: "/docs/",
	themeConfig: {
		logo: './logo.svg',
		siteTitle: "VuePopper",
		outline: 'deep',
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/kalimah-apps' },
			{ icon: 'twitter', link: 'https://twitter.com/KalimahApps' },
		],
		nav: [
			{ text: "Guide", link: "/guide/overview" },
			{ text: "Changelog", link: "/changelog" },
			{ text: "Links", link: "/links" },
		],
		sidebar: [
			{
				text: "Getting started",
				collapsable: false,
				items: [
					{
						text: "Overview",
						link: "/guide/overview",
					}, {
						text: "Installation",
						link: "/guide/installation",
					},
					{
						text: "Usage",
						link: "/guide/usage",
						items:
							[
								{
									text: "Component",
									link: "/guide/usage/component",
								},
								{
									text: "Composition API",
									link: "/guide/usage/composition-api",
								}
							]

					},
					{
						text: "Defaults",
						link: "/guide/defaults",
					},

				],
			},
			{
				text: "API",
				collapsable: false,
				items: [
					{
						text: "Props & options",
						link: "/guide/props-options",
					},
					{
						text: "Events",
						link: "/guide/events",
					},
					{
						text: "Slots",
						link: "/guide/slots",
					},
					{
						text: "Styling",
						link: "/guide/styling",
					},
				],
			}
		],
		footer: {
			message: "Released under the MIT License.",
		},
	},
});
