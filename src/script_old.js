import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls'
import * as dat from 'dat.gui'
// import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
// import{GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'


//loading

const textureloader = new THREE.TextureLoader()

const normalMap = textureloader.load('https://raw.githubusercontent.com/fireship-io/threejs-scroll-animation-demo/main/normal.jpg')

const texture = textureloader.load('https://static.vecteezy.com/system/resources/thumbnails/000/135/839/small/basketball-texture-free-vector.png')

const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xcccccc );
scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

// lights
scene.add( new THREE.AmbientLight( 0x666666 ) );

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Objects
const geometry = new THREE.SphereGeometry( 5, 32, 32 );

// Materials

const material = new THREE.MeshStandardMaterial({
    map: texture,
    normalMap: normalMap,
})

// Mesh
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)


const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 70, 70, 0 );

const camera_position = gui.addFolder('camera_position')

scene.add(camera)

camera_position.add(camera.position, 'x').min(0).max(100)
camera_position.add(camera.position, 'y').min(0).max(100)
camera_position.add(camera.position, 'z').min(0).max(100)


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// Base camera
const controls = new OrbitControls( camera, renderer.domElement );

controls.rotateSpeed = 1;
controls.zoomSpeed = 0.9;

controls.minDistance = 3;
controls.maxDistance = 200;

controls.minPolarAngle = 0; // radians
controls.maxPolarAngle = Math.PI /2; // radians

controls.enableDamping = true;
controls.dampingFactor = 0.05;




/**
 * Animate
 */

document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0
let mouseY = 0

let targetx = 0
let targety = 0

const windowX = window.innerWidth / 2
const windowY = window.innerHeight / 2

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowX
  mouseY = event.clientY - windowY
}




const geometry1 = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
const material1 = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
const groundTexture = textureloader.load( 'https://3js-starter.vercel.app/surface.jpeg' );
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set( 25, 25 );
groundTexture.anisotropy = 16;
groundTexture.encoding = THREE.sRGBEncoding;

const groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );

const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20000, 20000 ), groundMaterial );
mesh.position.y = -239;
mesh.position.z = 0;
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add( mesh );

const mesh_position = gui.addFolder('mesh_position')

mesh_position.add(mesh.position, 'x').min(-500).max(100);
mesh_position.add(mesh.position, 'y').min(-500).max(100);
mesh_position.add(mesh.position, 'z').min(-500).max(100);

const clock = new THREE.Clock()

const tick = () => {
  targetx = mouseX * 0.008
  targety = mouseY * 0.008

 
  const elapsedTime = clock.getElapsedTime()
  // Update objects
  sphere.rotation.y = 1 * elapsedTime
  const time = Date.now() * 0.005;

  sphere.position.y = Math.cos( time ) * 10 + 1.25;

  sphere.rotation.y += 0.5 * (targetx - sphere.rotation.y)
  sphere.rotation.x += 0.5 * (targetx - sphere.rotation.x)
  sphere.rotation.z += 0.5 * (targetx - sphere.rotation.x)

  sphere.rotat

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick();