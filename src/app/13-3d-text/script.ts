import {
  // AxesHelper,
  // BoxGeometry,
  Mesh,
  // MeshBasicMaterial,
  MeshMatcapMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  TorusGeometry,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import "@styles/style.css";

function init() {
  // setup
  const canvas: HTMLCanvasElement | null = document.querySelector(".webgl");
  if (!canvas) return;

  const sizes = { width: window.innerWidth, height: window.innerHeight };
  let mouse = { x: 0, y: 0 };

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

  // scene
  const scene = new Scene();

  // Axes Helper
  // const axesHelper = new AxesHelper();
  // scene.add(axesHelper);

  // textures
  const textureLoader = new TextureLoader();
  const matcapTexture = textureLoader.load("/textures/matcaps/8.png");

  // fonts
  const fontLoader = new FontLoader();
  fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    const textGeometry = new TextGeometry("Hello Three.js", {
      font,
      size: 0.5,
      height: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    });
    // textGeometry.computeBoundingBox();
    // if (textGeometry.boundingBox) {
    //   const max = textGeometry.boundingBox.max;
    //   const min = textGeometry.boundingBox.min;
    //   const shiftX = (max.x + min.x) / 2;
    //   const shiftY = (max.y + min.z) / 2;
    //   const shiftZ = (max.z + min.x) / 2;
    //   textGeometry.translate(-shiftX, -shiftY, -shiftZ);
    // }
    textGeometry.center();
    const material = new MeshMatcapMaterial();
    material.matcap = matcapTexture;
    // textMaterial.wireframe = true;
    const text = new Mesh(textGeometry, material);
    scene.add(text);

    const donutGeometry = new TorusGeometry(0.1, 0.075, 20, 45);
    for (let i = 0; i < 400; i++) {
      const donut = new Mesh(donutGeometry, material);
      donut.position.x = (Math.random() - 0.5) * 10;
      donut.position.y = (Math.random() - 0.5) * 10;
      donut.position.z = (Math.random() - 0.5) * 10;
      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;
      const scale = Math.random() + 0.25;
      donut.scale.set(scale, scale, scale);
      scene.add(donut);
    }
  });

  // Object: geometry + material + mesh
  // const geometry = new BoxGeometry(1, 1, 1);
  // const material = new MeshBasicMaterial();
  // const mesh = new Mesh(geometry, material);
  // scene.add(mesh);

  // Camera
  const aspectRatio = sizes.width / sizes.height;
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
  camera.position.z = 3;
  scene.add(camera);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // Renderer
  const renderer = new WebGLRenderer({
    canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Animate
  function tick() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}

init();
