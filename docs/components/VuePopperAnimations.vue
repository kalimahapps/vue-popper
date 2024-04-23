<template>
	<div class="grid">
		<VuePopper v-for="animation in animations" :text="animation" :animation="animation" />
	</div>
</template>

<script setup lang="ts">
const animations = ['none', 'fade', 'shift-in', 'shift-out', 'scale'];
</script>

<style scoped>
.grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
	grid-gap: 1em;
}
</style>
