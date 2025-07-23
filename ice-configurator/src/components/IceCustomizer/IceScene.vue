<template>
    <div ref="sceneContainer" class="scene" />
  </template>
  
  <script setup>
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
  import * as THREE from 'three'
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
  import { gsap } from 'gsap'
  import { TextureLoader } from 'three'
  
  const props = defineProps({
    selectedFlavor: String,
    selectedTopping: Object
  })
  
  // Smaakopties moeten beschikbaar zijn in de component
  const mainFlavors = [
    { name: 'Chocolade', color: '#6b3e26' },
    { name: 'Aardbei', color: '#ff4b7b' },
    { name: 'Pistache', color: '#a8e060' },
    { name: 'Vanille', color: '#fff8b0' },
    { name: 'Mango', color: '#ffb347' },
    { name: 'Bubblegum', color: '#c77dff' },
    { name: 'Karamel', color: '#d4a76a' },
    { name: 'Mint', color: '#7fffd4' }
  ]
  
  const sceneContainer = ref(null)
  const iceParts = ref({})
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0) // Lichtgrijze achtergrond
  let camera, renderer, mixer
  
  // Initialisatie
  onMounted(() => {
    initScene()
    loadModel()
    animate()
  })
  
  onBeforeUnmount(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', handleResize)
    // Cleanup Three.js resources
    if (renderer) {
      renderer.dispose()
    }
  })
  
  function initScene() {
    // Camera setup
    camera = new THREE.PerspectiveCamera(45, getAspectRatio(), 0.1, 1000)
    camera.position.set(0, 0.5, 6) // Iets hoger voor beter zicht op het ijs
  
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Limiteer voor performance
    renderer.setSize(sceneContainer.value.clientWidth, sceneContainer.value.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    sceneContainer.value.appendChild(renderer.domElement)
  
    // Belichting
    setupLights()
    
    // Responsiveness
    window.addEventListener('resize', handleResize)
  }
  
  function setupLights() {
    // Verwijder bestaande lichten
    scene.children.filter(child => child.isLight).forEach(light => scene.remove(light))
  
    // 1. Ambient Light - Basisverlichting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)
  
    // 2. Directional Light - Hoofdlicht
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
  
    // 3. Hemisphere Light - Natuurlijk kleureffect
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5)
    scene.add(hemisphereLight)
  
    // 4. Spot Light - Accentverlichting
    const spotLight = new THREE.SpotLight(0xffffff, 0.8)
    spotLight.position.set(0, 5, 5)
    spotLight.angle = Math.PI / 5
    spotLight.penumbra = 0.2
    spotLight.decay = 1
    spotLight.distance = 20
    spotLight.castShadow = true
    scene.add(spotLight)
  
    // 5. Rim Light - Voor contrast
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.5)
    rimLight.position.set(-3, 2, -3)
    scene.add(rimLight)
  }
  
  function loadModel() {
    const loader = new GLTFLoader()
    loader.load('/src/assets/models/IceCream.glb', (gltf) => {
      const model = gltf.scene
      model.scale.set(2, 2, 2)
      model.position.set(0, -0.5, 0) // Iets lager voor betere compositie
      scene.add(model)
  
      // Animations
      if (gltf.animations?.length) {
        mixer = new THREE.AnimationMixer(model)
        gltf.animations.forEach(clip => {
          mixer.clipAction(clip).play()
        })
      }
  
      // Materialen optimaliseren
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          
          // Optimaliseer materialen voor ijs
          if (child.material) {
            child.material = new THREE.MeshStandardMaterial({
              color: child.material.color,
              roughness: 0.25, // Glanzender voor ijs-effect
              metalness: 0.1,
              envMapIntensity: 0.3
            })
          }
          
          iceParts.value[child.name] = child
        }
      })
  
      // Debug: Log alle mesh namen
      console.log('Loaded meshes:', Object.keys(iceParts.value))
  
      // Startanimatie
      gsap.from(model.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)'
      })
    }, undefined, (error) => {
      console.error('Error loading model:', error)
    })
  }
  
  watch(() => props.selectedFlavor, (newFlavor) => {
  const flavor = mainFlavors.find(f => f.name === newFlavor)
  if (!flavor) return

  const targetMesh = iceParts.value["IceCream_3_3"] // unified mesh
  if (!targetMesh) {
    console.warn('Ice cream mesh not found')
    return
  }

  const targetColor = new THREE.Color(flavor.color)
  // Gebruik GSAP om de kleurcomponenten te animeren, niet het hele color-object
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
  
  let toppingTween = null;

  watch(() => props.selectedTopping, (newTopping) => {
  const targetMesh = iceParts.value["IceCream_3_2"]
  if (!targetMesh) {
    console.warn('Topping mesh not found')
    return
  }

  const targetColor = newTopping && newTopping.color
    ? new THREE.Color(newTopping.color)
    : new THREE.Color('#ffffff') // reset naar wit als geen topping

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
  
  // Animation loop
  let animationId
  function animate() {
    animationId = requestAnimationFrame(animate)
    
    // Zachte rotatie
    scene.rotation.y += 0.002
    
    // Animatie updates
    if (mixer) mixer.update(0.016)
    
    renderer.render(scene, camera)
  }
  
  // Helper functions
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