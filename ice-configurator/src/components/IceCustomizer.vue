<!-- src/components/IceCustomizer.vue -->
<template>
  <div ref="sceneContainer" class="scene" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'

const sceneContainer = ref(null)

onMounted(() => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  sceneContainer.value.appendChild(renderer.domElement)

  // Licht
  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(1, 1, 1)
  scene.add(light)

  // Object (placeholder voor ijsje)
  const geometry = new THREE.ConeGeometry(1, 2, 32)
  const material = new THREE.MeshStandardMaterial({ color: '#f3c26b' })
  const cone = new THREE.Mesh(geometry, material)
  scene.add(cone)

  camera.position.z = 5

  const animate = () => {
    requestAnimationFrame(animate)
    cone.rotation.y += 0.01
    renderer.render(scene, camera)
  }

  animate()
})
</script>

<style scoped>
.scene {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
