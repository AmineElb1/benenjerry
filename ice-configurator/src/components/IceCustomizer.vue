<!-- src/components/IceCustomizer.vue -->
<template>
  <div ref="sceneContainer" class="scene" />
  <div style="position: absolute; top: 20px; left: 20px; z-index: 10; background: rgba(255,255,255,0.9); padding: 14px; border-radius: 10px; box-shadow: 0 2px 8px #0001;">
    <div style="font-weight: bold; margin-bottom: 8px;">Kies een smaak:</div>
    <div style="display: flex; gap: 10px;">
      <button v-for="flavor in flavors" :key="flavor.name" :style="{background: flavor.color, border: selectedFlavor === flavor.name ? '2px solid #333' : '2px solid #fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer'}" @click="setFlavor(flavor)"></button>
    </div>
    <div style="margin-top: 8px; font-size: 0.95em; color: #444;">{{ selectedFlavor }}</div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const sceneContainer = ref(null)
const iceParts = ref({}) // Hierin slaan we de meshes op
const flavors = [
  { name: 'Chocolade', color: '#6b3e26' },
  { name: 'Aardbei', color: '#ff4b7b' },
  { name: 'Pistache', color: '#a8e060' },
  { name: 'Vanille', color: '#fff8b0' },
]
const selectedFlavor = ref('Vanille')

function setFlavor(flavor) {
  selectedFlavor.value = flavor.name
  const mesh = iceParts.value["IceCream_3_3"]
  if (mesh) {
    mesh.material.color.set(flavor.color)
  }
}

onMounted(() => {
  const scene = new THREE.Scene()

  // Gebruik de container-afmetingen
  const container = sceneContainer.value
  const width = container.clientWidth || window.innerWidth - 1000
  const height = container.clientHeight || window.innerHeight - 100

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(0, 0, 6) // Recht voor het model

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setClearColor(0x222222, 1) // Donkere achtergrond
  container.appendChild(renderer.domElement)

  // Belichting
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2)
  keyLight.position.set(5, 10, 7)
  scene.add(keyLight)

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.7)
  fillLight.position.set(-5, 5, 5)
  scene.add(fillLight)

  const backLight = new THREE.DirectionalLight(0xffffff, 0.5)
  backLight.position.set(0, -5, -5)
  scene.add(backLight)

  const ambient = new THREE.AmbientLight(0xffffff, 0.7)
  scene.add(ambient)

  // Laad het model
  const loader = new GLTFLoader()
  loader.load('/src/assets/models/IceCream.glb', (gltf) => {
    const model = gltf.scene
    model.scale.set(2, 2, 2)
    model.position.set(0, -0.5, 0) // Iets naar beneden voor centrering
    scene.add(model)

    // 🔍 Meshes & materialen loggen en opslaan
    model.traverse((child) => {
      if (child.isMesh) {
        console.log('🔍 Mesh:', child.name, '| Materiaal:', child.material?.name || '(geen naam)')
        iceParts.value[child.name] = child
      }
    })
    // Zet startsmaak direct goed
    setFlavor(flavors.find(f => f.name === selectedFlavor.value))
  }, undefined, (error) => {
    console.error('❌ Fout bij laden model:', error)
  })

  // Responsief maken
  window.addEventListener('resize', () => {
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  })

  const animate = () => {
    requestAnimationFrame(animate)
    scene.rotation.y += 0.003 // hele scene draaien (kan je aanpassen)
    renderer.render(scene, camera)
  }

  animate()
})
</script>
