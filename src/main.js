import gsap from "gsap";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const gui = new dat.GUI();
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50
  },
};
gui.add(world.plane, "width", 1, 500).onChange(generatePlane);

gui.add(world.plane, "height", 1, 500).onChange(generatePlane);

gui.add(world.plane, "widthSegments", 1, 100).onChange(generatePlane);

gui.add(world.plane, "heightSegments", 1, 100).onChange(generatePlane);


function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );


  // vertice position randomization
  const { array } = planeMesh.geometry.attributes.position;

  for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i + 2] = z + Math.random();

    // console.log(array[i])
  }

  const colors = []

for(let i =0; i < planeMesh.geometry.attributes.position.count; i++) {
  // console.log(i)
  colors.push(0,.19,.4)
}

// console.log(colors)

planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
}

const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement)


// const boxGeometry = new THREE.BoxGeometry(1,1,1)

// const material = new THREE.MeshBasicMaterial({color: 0x00ff00})

// const mesh = new THREE.Mesh(boxGeometry, material)

// console.log(mesh)

// scene.add(mesh)

camera.position.z = 50;

const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
const planeMaterial = new THREE.MeshPhongMaterial({
  // color: 0xff0000,
  side: THREE.DoubleSide,
  flatShading: true, // Use true instead of THREE.FlatShading
  vertexColors: true
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

// console.log(planeMesh.geometry.attributes.position.array);


// vertice  position randomization
const { array } = planeMesh.geometry.attributes.position;
const randomValues = []

for (let i = 0; i < array.length; i++ ) {


  if( i % 3 === 0 ) {

  
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];

  array[i] = x + (Math.random() - 0.5) * 3;;
  array[i + 1] = y + (Math.random() - 0.5) * 3;
  array[i + 2] = z + (Math.random() - 0.5) * 10;
}
  // console.log(array[i])

  randomValues.push(Math.random() - 0.5)
}


planeMesh.geometry.attributes.position.randomValues = randomValues


planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array


console.log(planeMesh.geometry.attributes.position)

// planeMesh.geometry.attributes.position

// color attribute addition
const colors = []

for(let i =0; i < planeMesh.geometry.attributes.position.count; i++) {
  // console.log(i)
  colors.push(0,.19,.4)
}

// console.log(colors)

planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1);
scene.add(light);


const backlight = new THREE.DirectionalLight(0xffffff, 1);
backlight.position.set(0, 0, -1);
scene.add(backlight);


const mouse = {
  x: undefined,
  y: undefined
}

let frame = 0
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // mesh.rotation.x += 0.01
  // mesh.rotation.y += 0.01

  //  planeMesh.rotation.y += 0.01

  raycaster.setFromCamera(mouse, camera)
  frame += 0.01

  const {array, originalPosition, randomValues} = planeMesh.geometry.attributes.position

  for (let i = 0; i < array.length; i += 3) {
    
    // x
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i] ) * 0.003

    // Y
    array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1] ) * 0.003


    // if(i === 0) {
    //   console.log(Math.cos(frame))
    // }

  }

  planeMesh.geometry.attributes.position.needsUpdate = true


  const intersects = raycaster.intersectObject(planeMesh)

  if(intersects.length > 0) {
    
    // console.log(intersects[0].face)


    const {color} = intersects[0].object.geometry.attributes


    //vertice 1
    color.setX(intersects[0].face.a, 0.1)
    color.setY(intersects[0].face.a, 0.5)
    color.setZ(intersects[0].face.a, 1)

    //vertice 2
    color.setX(intersects[0].face.b, 0.1)
    color.setY(intersects[0].face.b, 0.5)
    color.setZ(intersects[0].face.b, 1)


    //vertice 3
    color.setX(intersects[0].face.c, 0.1)
    color.setY(intersects[0].face.c, 0.5)
    color.setZ(intersects[0].face.c, 1)


    intersects[0].object.geometry.attributes.color.needsUpdate = true

    const initialColor = {
      r: 0,
      g: .19,
      b: .4
    }

    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1
    }

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
          //vertice 1
    color.setX(intersects[0].face.a, hoverColor.r)
    color.setY(intersects[0].face.a, hoverColor.g)
    color.setZ(intersects[0].face.a, hoverColor.b)

    //vertice 2
    color.setX(intersects[0].face.b, hoverColor.r)
    color.setY(intersects[0].face.b, hoverColor.g)
    color.setZ(intersects[0].face.b, hoverColor.b)


    //vertice 3
    color.setX(intersects[0].face.c, hoverColor.r)
    color.setY(intersects[0].face.c, hoverColor.g)
    color.setZ(intersects[0].face.c, hoverColor.b)
    color.needsUpdate = true

      }
    })

  }
}

animate();


addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1
  // console.log(mouse)
}, { passive: true });
