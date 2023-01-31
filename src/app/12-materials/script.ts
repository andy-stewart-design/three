import {
  // BoxGeometry,
  Clock,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshMatcapMaterial,
  MeshNormalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  TextureLoader,
  TorusGeometry,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "@styles/style.css";

// textures
const texture_loader = new TextureLoader();
const color_texture = texture_loader.load("/textures/door/color.jpg");
const alpha_texture = texture_loader.load("/textures/door/alpha.jpg");
const ambient_occlusion_texture = texture_loader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const height_texture = texture_loader.load("/textures/door/height.jpg");
const metalness_texture = texture_loader.load("/textures/door/metalness.jpg");
const normal_texture = texture_loader.load("/textures/door/normal.jpg");
const roughness_texture = texture_loader.load("/textures/door/roughness.jpg");
const matcap_texture = texture_loader.load("/textures/matcaps/3.png");
const gradients_texture = texture_loader.load("/textures/gradients/3.jpg");

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

  // const material = new MeshBasicMaterial();
  // material.map = color_texture;
  // material.color = new Color(0xff0000);

  // const material = new MeshNormalMaterial();
  // material.flatShading = true;

  const material = new MeshMatcapMaterial();
  material.matcap = matcap_texture;

  const sphere = new Mesh(new SphereGeometry(0.5, 26, 26), material);
  sphere.position.x = -1.5;
  const plane = new Mesh(new PlaneGeometry(1, 1), material);
  const torus = new Mesh(new TorusGeometry(0.4, 0.2, 16, 32), material);
  torus.position.x = 1.5;
  scene.add(sphere, plane, torus);

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

  const clock = new Clock();

  // Animate
  function tick() {
    const elapsed_time = clock.getElapsedTime();

    sphere.rotation.x = elapsed_time;
    sphere.rotation.y = elapsed_time;
    plane.rotation.x = elapsed_time / 2;
    plane.rotation.y = elapsed_time / 2;
    torus.rotation.x = elapsed_time / 4;
    torus.rotation.y = elapsed_time / 4;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}

init();
