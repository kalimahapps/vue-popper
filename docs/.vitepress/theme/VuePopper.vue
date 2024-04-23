<template>
	<VuePopperComponent hover>
		<template #default>
			<button>{{ text }}</button>
		</template>

		<template #content>
			<div>
				<div class="tooltip-text">
					<slot name="default">
						Hi, from vue-popper! 🍿
					</slot>
				</div>
			</div>
		</template>
	</VuePopperComponent>
</template>

<script setup lang="ts">
import VuePopperComponent from '@kalimahapps/vue-popper';

defineProps({
	text: {
		type: String,
		default: 'Button',
	},
});
</script>

<style lang="scss">
.popper-container {
	.tooltip-text {
		font-size: 0.8rem;
		white-space: nowrap;
	}

	button {
		border-color: #21333c;
		background-color: #21333c;
		color: #ececec;
		padding: 0.6em 1.5em;
		transition: all 0.1s linear;
		&:hover {
			background-color: #2c4a57;
		}
	}

	.trigger-element {
		display: inline-block;
	}
}
</style>
