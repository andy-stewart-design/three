import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";
import "@styles/style.css";

function init() {
  // Initiate Debug UI
  const gui = new dat.GUI();
  gui.close();
  const params = {
    color: 0xff0000,
    spin: () => {
      gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2, duration: 1 });
    },
  };

  // setup
  const canvas: HTMLCanvasElement | null = document.querySelector(".webgl");
  if (!canvas) return;

  const sizes = { width: window.innerWidth, height: window.innerHeight };

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  let mouse = { x: 0, y: 0 };

  window.addEventListener("mousemove", (event) => {
    const canvasPositionX = canvas.getBoundingClientRect().left;
    const canvasPositionY = canvas.getBoundingClientRect().top;
    const cursorX = (event.clientX - canvasPositionX) / sizes.width - 0.5;
    const cursorY = (event.clientY - canvasPositionY) / sizes.height - 0.5;
    if (cursorX >= -0.5 && cursorX <= 0.5) mouse.x = cursorX;
    if (cursorY >= -0.5 && cursorY <= 0.5) mouse.y = cursorY;
  });

  // scene
  const scene = new Scene();

  // Object: geometry + material + mesh
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: params.color });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

  gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("Cube Y");
  gui.add(mesh, "visible").name("Show cube");
  gui.add(material, "wireframe");
  gui
    .addColor(params, "color")
    .onChange(() => material.color.set(params.color));
  gui.add(params, "spin");

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

  // Animate
  function tick() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}

init();
