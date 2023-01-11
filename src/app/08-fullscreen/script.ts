import {
  BoxGeometry,
  // Clock,
  Mesh,
  MeshBasicMaterial,
  // OrthographicCamera,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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

  window.addEventListener("dblclick", () => {
    const fullscreenElement =
      // @ts-expect-error
      document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullscreenElement) {
      if (canvas.requestFullscreen) canvas.requestFullscreen();
      // @ts-expect-error
      else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      // @ts-expect-error
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  });

  // scene
  const scene = new Scene();

  // Object: geometry + material + mesh
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: 0xff0000 });
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
