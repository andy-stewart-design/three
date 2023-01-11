import {
  BoxGeometry,
  Clock,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import "@styles/style.css";

function init() {
  // setup
  const canvas = document.querySelector(".webgl");
  if (!canvas) return;

  const sizes = { width: 800, height: 600 };

  // scene
  const scene = new Scene();

  // Object: geometry + material + mesh
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

  // Camera
  const camera = new PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.z = 3;
  scene.add(camera);

  // Renderer
  const renderer = new WebGLRenderer({
    canvas,
  });
  renderer.setSize(sizes.width, sizes.height);

  // let time = Date.now();
  const clock = new Clock();

  // Animate
  function tick() {
    // const currentTime = Date.now();
    // const deltaTime = currentTime - time;
    // time = currentTime;
    const time = clock.getElapsedTime();

    mesh.position.y = Math.sin(time * 2);
    mesh.position.x = Math.cos(time * 2);
    camera.lookAt(mesh.position);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}

init();
