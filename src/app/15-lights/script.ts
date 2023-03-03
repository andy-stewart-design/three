import {
  AmbientLight,
  BoxGeometry,
  Clock,
  DirectionalLight,
  DirectionalLightHelper,
  HemisphereLight,
  HemisphereLightHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  PointLightHelper,
  RectAreaLight,
  Scene,
  SphereGeometry,
  SpotLight,
  SpotLightHelper,
  TorusGeometry,
  WebGLRenderer,
} from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import * as dat from "dat.gui";
import "@styles/style.css";

// Debug
// const gui = new dat.GUI();

// textures

function init() {
  // setup
  const canvas: HTMLCanvasElement | null = document.querySelector(".webgl");
  if (!canvas) return;

  // Resize and mouse pos event listeners
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

  const material = new MeshStandardMaterial();
  material.roughness = 0.1;

  const sphere = new Mesh(new SphereGeometry(0.5, 64, 64), material);
  sphere.position.x = -1.5;

  const cube = new Mesh(new BoxGeometry(0.75, 0.75, 0.75), material);

  const torus = new Mesh(new TorusGeometry(0.4, 0.2, 64, 128), material);
  torus.position.x = 1.5;

  const plane = new Mesh(new PlaneGeometry(5, 5), material);
  plane.rotation.x = -Math.PI * 0.5;
  plane.position.y = -0.65;

  scene.add(sphere, cube, torus, plane);

  // Lights
  const ambient_light = new AmbientLight(0xffffff, 0.5);
  scene.add(ambient_light);

  const directional_light = new DirectionalLight(0x00fffc, 0.3);
  directional_light.position.set(1, 0.25, 0);
  scene.add(directional_light);

  const hemisphere_light = new HemisphereLight(0xff0000, 0x0000ff, 0.3);
  scene.add(hemisphere_light);

  const point_light = new PointLight(0xff9000, 0.5, 3, 2);
  point_light.position.set(1, -0.5, 1);
  scene.add(point_light);

  const rect_area_light = new RectAreaLight(0x4300ff, 2, 1, 1);
  rect_area_light.position.set(-1.5, 0, 1.5);
  scene.add(rect_area_light);

  const spotlight = new SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1);
  spotlight.position.set(0, 2, 3);
  scene.add(spotlight);

  // Helpers
  const hemisphere_light_helper = new HemisphereLightHelper(
    hemisphere_light,
    0.2
  );

  const directional_light_helper = new DirectionalLightHelper(
    directional_light,
    0.2
  );

  const point_light_helper = new PointLightHelper(point_light, 0.2);

  const spotlight_helper = new SpotLightHelper(spotlight);

  const rect_area_light_helper = new RectAreaLightHelper(rect_area_light);

  scene.add(
    directional_light_helper,
    hemisphere_light_helper,
    point_light_helper,
    spotlight_helper,
    rect_area_light_helper
  );

  // Camera
  const aspectRatio = sizes.width / sizes.height;
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 2;
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // Renderer
  const renderer = new WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Animate
  const clock = new Clock();

  function tick() {
    const elapsed_time = clock.getElapsedTime();

    sphere.rotation.x = elapsed_time;
    sphere.rotation.y = elapsed_time;

    cube.rotation.x = elapsed_time / 2;
    cube.rotation.y = elapsed_time / 2;

    torus.rotation.x = elapsed_time / 4;
    torus.rotation.y = elapsed_time / 4;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}

init();
