import {
  AdditiveBlending,
  // BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  // Clock,
  // Mesh,
  // MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "@styles/style.css";
// import dat from "dat.gui";

function init() {
  // --------------------
  // SETUP
  // --------------------

  const canvas: HTMLCanvasElement | null = document.querySelector(".webgl");
  if (!canvas) return;

  // GUI
  // const gui = new dat.GUI();

  // SCENE
  const scene = new Scene();

  // TEXTURES
  const textureLoader = new TextureLoader();
  const particleTexture = textureLoader.load("/textures/particles/2.png");
  console.log(particleTexture);

  // --------------------
  // PARTICLES
  // --------------------

  // GEOMETRY
  const particlesGeometry = new BufferGeometry();
  const count = 20000;
  const positionsArray = new Float32Array(count * 3);
  const colorArray = new Float32Array(count * 3);

  for (let i = 0; i < positionsArray.length; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 10;
    colorArray[i] = Math.random();
  }

  particlesGeometry.setAttribute(
    "position",
    new BufferAttribute(positionsArray, 3)
  );
  particlesGeometry.setAttribute("color", new BufferAttribute(colorArray, 3));

  // MATERIAL
  const particlesMaterial = new PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    // color: "#ff88cc",
  });
  particlesMaterial.transparent = true;
  particlesMaterial.alphaMap = particleTexture;
  // particlesMaterial.alphaTest = 0.001;
  // particlesMaterial.depthTest = false;
  particlesMaterial.depthWrite = false;
  particlesMaterial.blending = AdditiveBlending;
  particlesMaterial.vertexColors = true;

  // POINTS
  const particles = new Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // Test Cube
  // const cube = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
  // scene.add(cube);

  // SIZES

  const sizes = { width: window.innerWidth, height: window.innerHeight };
  let mouse = { x: 0, y: 0 };

  // --------------------
  // EVENT LISTENERS
  // --------------------

  window.addEventListener("mousemove", (event) => {
    const canvasPositionX = canvas.getBoundingClientRect().left;
    const canvasPositionY = canvas.getBoundingClientRect().top;
    const cursorX = (event.clientX - canvasPositionX) / sizes.width - 0.5;
    const cursorY = (event.clientY - canvasPositionY) / sizes.height - 0.5;
    if (cursorX >= -0.5 && cursorX <= 0.5) mouse.x = cursorX;
    if (cursorY >= -0.5 && cursorY <= 0.5) mouse.y = cursorY;
  });

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // --------------------
  // CAMERA
  // --------------------
  const aspectRatio = sizes.width / sizes.height;
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
  camera.position.z = 3;
  scene.add(camera);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // --------------------
  // RENDERER
  // --------------------
  const renderer = new WebGLRenderer({
    canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // --------------------
  // ANIMATE
  // --------------------

  // const clock = new Clock();

  function tick() {
    // const elapsedTime = clock.getElapsedTime();

    // particles.rotation.y = elapsedTime / 5;

    // for (let i = 0; i < count; i++) {
    //   const xIndex = i * 3;
    //   const yIndex = xIndex + 1;
    //   const xPos = particlesGeometry.attributes.position.array[xIndex];
    //   // @ts-expect-error
    //   particlesGeometry.attributes.position.array[yIndex] = Math.sin(
    //     elapsedTime + xPos
    //   );
    // }

    // particlesGeometry.attributes.position.needsUpdate = true;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}

init();
