<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Experience from '../Experience/Experience';
const experience = ref(null);
onMounted(() => {
    new Experience({ targetElement: experience.value });
});
</script>

<template>
    <div class="experience" ref="experience"></div>
</template>

<style scoped></style>
