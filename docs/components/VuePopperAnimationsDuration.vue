<template>
	<div class="grid">
		<VuePopper
			v-for="(animation, animationIndex) in animations"
			:text="`[${durations[animationIndex].join(', ')}]`"
			:animation-duration="durations[animationIndex]"
		/>
	</div>
</template>

<script setup lang="ts">
const animations = ["fade", "shift-in", "shift-out", "scale"];
const durations = [
	[0, 200],
	[300, 1000],
	[1000, 500],
	[3000, 250],
];
</script>

<style scoped>
.grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
	grid-gap: 1em;
}
</style>
