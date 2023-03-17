import {
  AmbientLight,
  CameraHelper,
  Clock,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  SpotLight,
  TextureLoader,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import "@styles/style.css";

// Debug
const gui = new dat.GUI();

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

  // Textures

  const texture_loader = new TextureLoader();
  // const baked_shadow = texture_loader.load(
  //   "/textures/shadows/bakedShadow.jpg"
  // );
  const simple_shadow = texture_loader.load(
    "/textures/shadows/simpleShadow.jpg"
  );

  // scene
  const scene = new Scene();

  const material = new MeshStandardMaterial();
  material.roughness = 0.7;
  gui.add(material, "metalness").min(0).max(1).step(0.001);
  gui.add(material, "roughness").min(0).max(1).step(0.001);

  const sphere = new Mesh(new SphereGeometry(0.5, 64, 64), material);
  sphere.castShadow = false;

  const plane = new Mesh(
    new PlaneGeometry(5, 5),
    // new MeshBasicMaterial({ map: baked_shadow })
    material
  );
  plane.rotation.x = -Math.PI * 0.5;
  plane.position.y = -0.5;
  plane.receiveShadow = true;

  scene.add(sphere, plane);

  const sphere_shadow = new Mesh(
    new PlaneGeometry(1.5, 1.5),
    new MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      alphaMap: simple_shadow,
    })
  );
  sphere_shadow.rotation.x = -Math.PI / 2;
  sphere_shadow.position.y = plane.position.y + 0.01;
  scene.add(sphere_shadow);

  // Lights
  const ambient_light = new AmbientLight(0xffffff, 0.5);
  gui.add(ambient_light, "intensity").min(0).max(1).step(0.001);
  scene.add(ambient_light);

  const directional_light = new DirectionalLight(0xffffff, 0.3);
  directional_light.position.set(2, 2, -1);
  directional_light.castShadow = false;
  directional_light.shadow.mapSize.width *= 2;
  directional_light.shadow.mapSize.height *= 2;
  directional_light.shadow.camera.near = 1;
  directional_light.shadow.camera.far = 6;
  directional_light.shadow.camera.top = 2;
  directional_light.shadow.camera.bottom = -2;
  directional_light.shadow.camera.left = -2;
  directional_light.shadow.camera.right = 2;
  // directional_light.shadow.radius = 10;

  const directional_light_helper = new CameraHelper(
    directional_light.shadow.camera
  );
  directional_light_helper.visible = false;
  scene.add(directional_light_helper);

  gui.add(directional_light, "intensity").min(0).max(1).step(0.001);
  gui.add(directional_light.position, "x").min(-5).max(5).step(0.001);
  gui.add(directional_light.position, "y").min(-5).max(5).step(0.001);
  gui.add(directional_light.position, "z").min(-5).max(5).step(0.001);
  // scene.add(directional_light);

  const spotlight = new SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
  spotlight.position.set(0, 2, 0);
  spotlight.castShadow = false;
  spotlight.shadow.mapSize.width *= 2;
  spotlight.shadow.mapSize.height *= 2;
  spotlight.shadow.camera.fov = 30;
  spotlight.shadow.camera.near = 1;
  spotlight.shadow.camera.far = 6;

  scene.add(spotlight);
  scene.add(spotlight.target);

  const spotlight_camera_helper = new CameraHelper(spotlight.shadow.camera);
  spotlight_camera_helper.visible = false;
  scene.add(spotlight_camera_helper);

  const point_light = new PointLight(0xffffff, 0.3);
  point_light.castShadow = false;
  point_light.position.set(-1, 1, 0);
  point_light.shadow.mapSize.width *= 2;
  point_light.shadow.mapSize.height *= 2;
  point_light.shadow.camera.near = 0.1;
  point_light.shadow.camera.far = 5;
  // scene.add(point_light);

  const point_light_camera_helper = new CameraHelper(point_light.shadow.camera);
  point_light_camera_helper.visible = false;
  scene.add(point_light_camera_helper);

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
  renderer.shadowMap.enabled = false;
  renderer.shadowMap.type = PCFSoftShadowMap;

  // Animate
  const clock = new Clock();

  function tick() {
    const elapsed_time = clock.getElapsedTime();

    spotlight.target.position.x = Math.cos(elapsed_time);
    spotlight.target.position.z = Math.sin(elapsed_time);

    sphere.position.x = Math.cos(elapsed_time) * 1.5;
    sphere.position.z = Math.sin(elapsed_time) * 1.5;
    sphere.position.y = Math.abs(Math.sin(elapsed_time * 3));
    sphere_shadow.position.x = Math.cos(elapsed_time) * 1.5;
    sphere_shadow.position.z = Math.sin(elapsed_time) * 1.5;
    sphere_shadow.material.opacity = (1 - sphere.position.y) * 0.4 + 0.2;
    const scale = (1 - sphere.position.y) * 0.2 + 0.4;
    sphere_shadow.scale.set(scale, scale, scale);

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}

init();
