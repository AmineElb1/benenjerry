<template>
    <div ref="sceneContainer" class="scene" />
  </template>
  
  <script setup>
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
  import * as THREE from 'three'
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
  import { gsap } from 'gsap'
  import { TextureLoader } from 'three'
  
  const props = defineProps({
    selectedFlavor: String,
    selectedTopping: Object
  })
  
  const mainFlavors = [
    { name: 'Chocolade', color: '#6b3e26' },
    { name: 'Aardbei', color: '#ff4b7b' },
    { name: 'Pistache', color: '#a8e060' },
    { name: 'Vanille', color: '#fff8b0' },
    { name: 'Mango', color: '#ffb347' },
    { name: 'Bubblegum', color: '#c77dff' },
    { name: 'Karamel', color: '#d4a76a' },
    { name: 'Mint', color: '#7fffd4' },
    { name: 'Smurfen', color: '#0099ff' }
  ]
  
  const sceneContainer = ref(null)
  const iceParts = ref({})
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)
  let camera, renderer, mixer
  
  onMounted(() => {
    initScene()
    loadModel()
    animate()
  })
  
  onBeforeUnmount(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', handleResize)
    if (renderer) {
      renderer.dispose()
    }
  })
  
  function initScene() {
    camera = new THREE.PerspectiveCamera(45, getAspectRatio(), 0.1, 1000)
    camera.position.set(0, 0.5, 6)
    renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(sceneContainer.value.clientWidth, sceneContainer.value.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    sceneContainer.value.appendChild(renderer.domElement)
    setupLights()
    window.addEventListener('resize', handleResize)
  }
  
  function setupLights() {
    scene.children.filter(child => child.isLight).forEach(light => scene.remove(light))
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    directionalLight.position.set(3, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 20
    directionalLight.shadow.camera.left = -5
    directionalLight.shadow.camera.right = 5
    directionalLight.shadow.camera.top = 5
    directionalLight.shadow.camera.bottom = -5
    scene.add(directionalLight)
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5)
    scene.add(hemisphereLight)
    const spotLight = new THREE.SpotLight(0xffffff, 0.8)
    spotLight.position.set(0, 5, 5)
    spotLight.angle = Math.PI / 5
    spotLight.penumbra = 0.2
    spotLight.decay = 1
    spotLight.distance = 20
    spotLight.castShadow = true
    scene.add(spotLight)
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.5)
    rimLight.position.set(-3, 2, -3)
    scene.add(rimLight)
  }
  
  function loadModel() {
    const loader = new GLTFLoader()
    loader.load('/IceCream.glb', (gltf) => {
      const model = gltf.scene
      model.scale.set(2, 2, 2)
      model.position.set(0, -0.5, 0)
      scene.add(model)
      if (gltf.animations?.length) {
        mixer = new THREE.AnimationMixer(model)
        gltf.animations.forEach(clip => {
          mixer.clipAction(clip).play()
        })
      }
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          if (child.material) {
            child.material = new THREE.MeshStandardMaterial({
              color: child.material.color,
              roughness: 0.25,
              metalness: 0.1,
              envMapIntensity: 0.3
            })
          }
          iceParts.value[child.name] = child
        }
      })
      const smaakMesh = iceParts.value["IceCream_3_3"]
      if (smaakMesh) {
        smaakMesh.material.color.set("#fff8b0")
        smaakMesh.material.needsUpdate = true
      }
      const toppingMesh = iceParts.value["IceCream_3_2"]
      if (toppingMesh) {
        toppingMesh.visible = false
      }
    }, undefined, (error) => {})
  }
  
  watch(() => props.selectedFlavor, (newFlavor) => {
    const flavor = mainFlavors.find(f => f.name === newFlavor)
    if (!flavor) return
    const targetMesh = iceParts.value["IceCream_3_3"]
    if (!targetMesh) return
    const targetColor = new THREE.Color(flavor.color)
    gsap.to(targetMesh.material.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.8,
      onUpdate: () => {
        targetMesh.material.needsUpdate = true
      }
    })
  })
  
  watch(() => props.selectedTopping, (newTopping) => {
    const targetMesh = iceParts.value["IceCream_3_2"]
    if (!targetMesh) return
    targetMesh.visible = !!(newTopping && newTopping.color)
    if (!targetMesh.visible) return
    const targetColor = new THREE.Color(newTopping.color)
    gsap.to(targetMesh.material.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.8,
      onUpdate: () => {
        targetMesh.material.needsUpdate = true
      }
    })
  })
  
  let animationId
  function animate() {
    animationId = requestAnimationFrame(animate)
    scene.rotation.y += 0.002
    if (mixer) mixer.update(0.016)
    renderer.render(scene, camera)
  }
  
  function getAspectRatio() {
    return sceneContainer.value.clientWidth / sceneContainer.value.clientHeight
  }
  
  function handleResize() {
    camera.aspect = getAspectRatio()
    camera.updateProjectionMatrix()
    renderer.setSize(
      sceneContainer.value.clientWidth, 
      sceneContainer.value.clientHeight
    )
  }
  </script>
  
  <style scoped>
  .scene {
    width: 70%;
    height: 100vh;
    position: relative;
  }
  
  @media (max-width: 1024px) {
    .scene {
      width: 60%;
    }
  }
  
  @media (max-width: 768px) {
    .scene {
      width: 100%;
      height: 60vh;
    }
  }
  
  @media (max-width: 480px) {
    .scene {
      height: 50vh;
    }
  }
  </style>