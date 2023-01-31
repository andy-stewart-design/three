import "@styles/style.css";
import {
  BoxGeometry,
  LoadingManager,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  PerspectiveCamera,
  // RepeatWrapping,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// textures
const loadingManager = new LoadingManager();
loadingManager.onStart = () => console.log("onStart");
loadingManager.onProgress = () => console.log("onProgress");
loadingManager.onLoad = () => console.log("onLoad");
loadingManager.onError = () => console.log("onError");

const textureLoader = new TextureLoader(loadingManager);
const colorTexture = textureLoader.load("/textures/minecraft.png");
// const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
// const heightTexture = textureLoader.load("/textures/door/height.jpg");
// const normalTexture = textureLoader.load("/textures/door/normal.jpg");
// const ambientOcclusionTexture = textureLoader.load(
//   "/textures/door/ambientOcclusion.jpg"
// );
// const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
// const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = RepeatWrapping;
// colorTexture.wrapT = RepeatWrapping;

// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;

// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;
// colorTexture.rotation = Math.PI / 4;

colorTexture.generateMipmaps = false;
colorTexture.minFilter = NearestFilter;
colorTexture.magFilter = NearestFilter;

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

  // Object: geometry + material + mesh
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ map: colorTexture });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

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
