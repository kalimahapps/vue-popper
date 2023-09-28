<template>
	<div class="grid">
		<VuePopper v-for="placement in topPlacements" :text="placement" :placement="placement" />
	</div>

	<div class="grid-position-vertical">
		<div>
			<VuePopper v-for="placement in leftPlacements" :text="placement" :placement="placement" />
		</div>

		<div>
			<VuePopper v-for="placement in rightPlacements" :text="placement" :placement="placement" />
		</div>
	</div>

	<div class="grid">
		<VuePopper v-for="placement in bottomPlacements" :text="placement" :placement="placement" />
	</div>
</template>

<script setup lang="ts">
const topPlacements = ['top-start', 'top', 'top-end'];
const leftPlacements = ['left-start', 'left', 'left-end'];
const rightPlacements = ['right-start', 'right', 'right-end'];
const bottomPlacements = ['bottom-start', 'bottom', 'bottom-end'];
</script>

<style lang="scss" scoped>
.grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 1em;
	margin-bottom: 1em;

	:deep(.trigger-element),
	:deep(button) {
		display: block;
		width: 100%;
	}
}

.grid-position-vertical {
	grid-template-columns: repeat(2, 1fr);
	display: grid;
	grid-gap: 16em;
	margin-bottom: 1em;

	>div {
		display: grid;
		grid-template-rows: repeat(3, 1fr);
	}

	:deep(button) {
		min-height: 150px;
		margin-bottom: 1em;
	}

	:deep(.trigger-element),
	:deep(button) {
		display: block;
		width: 100%;
	}
}
</style>
