import {
  AmbientLight,
  BufferAttribute,
  // BoxGeometry,
  Clock,
  // Color,
  CubeTextureLoader,
  // DoubleSide,
  Mesh,
  // MeshBasicMaterial,
  // MeshDepthMaterial,
  // MeshLambertMaterial,
  // MeshMatcapMaterial,
  // MeshNormalMaterial,
  // MeshPhongMaterial,
  MeshStandardMaterial,
  // MeshToonMaterial,
  // NearestFilter,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  // TextureLoader,
  TorusGeometry,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import "@styles/style.css";

// Debug
const gui = new dat.GUI();

// textures
// const texture_loader = new TextureLoader();
const cube_texture_loader = new CubeTextureLoader();

// const color_texture = texture_loader.load("/textures/door/color.jpg");
// const alpha_texture = texture_loader.load("/textures/door/alpha.jpg");
// const ambient_occlusion_texture = texture_loader.load(
//   "/textures/door/ambientOcclusion.jpg"
// );
// const height_texture = texture_loader.load("/textures/door/height.jpg");
// const metalness_texture = texture_loader.load("/textures/door/metalness.jpg");
// const normal_texture = texture_loader.load("/textures/door/normal.jpg");
// const roughness_texture = texture_loader.load("/textures/door/roughness.jpg");
// const matcap_texture = texture_loader.load("/textures/matcaps/3.png");
// const gradients_texture = texture_loader.load("/textures/gradients/5.jpg");
// gradients_texture.minFilter = NearestFilter;
// gradients_texture.magFilter = NearestFilter;
// gradients_texture.generateMipmaps = false;

const env_map_texture = cube_texture_loader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

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

  // const material = new MeshMatcapMaterial();
  // material.matcap = matcap_texture;

  // const material = new MeshDepthMaterial();
  // const material = new MeshLambertMaterial();

  // const material = new MeshPhongMaterial();
  // material.shininess = 100;
  // material.specular = new Color(0xff0000);

  // const material = new MeshToonMaterial();
  // material.gradientMap = gradients_texture;

  // const material = new MeshStandardMaterial();
  // // material.metalness = 0.45;
  // // material.roughness = 0.65;
  // material.metalness = 0;
  // material.roughness = 1;

  // material.side = DoubleSide;
  // material.map = color_texture;
  // material.aoMap = ambient_occlusion_texture;
  // material.aoMapIntensity = 1;
  // material.displacementMap = height_texture;
  // material.displacementScale = 0.05;
  // material.metalnessMap = metalness_texture;
  // material.roughnessMap = roughness_texture;
  // material.normalMap = normal_texture;
  // material.normalScale.set(0.5, 0.5);
  // material.transparent = true;
  // material.alphaMap = alpha_texture;

  const material = new MeshStandardMaterial();
  material.metalness = 0.9;
  material.roughness = 0.1;
  material.envMap = env_map_texture;

  gui.add(material, "metalness").min(0).max(1).step(0.001);
  gui.add(material, "roughness").min(0).max(1).step(0.001);
  gui.add(material, "displacementScale").min(0).max(1).step(0.001);
  gui.add(material, "aoMapIntensity").min(0).max(2).step(0.001);

  const sphere = new Mesh(new SphereGeometry(0.5, 64, 64), material);
  sphere.geometry.setAttribute(
    "uv2",
    new BufferAttribute(sphere.geometry.attributes.uv.array, 2)
  );
  sphere.position.x = -1.5;

  const plane = new Mesh(new PlaneGeometry(1, 1, 100, 100), material);
  plane.geometry.setAttribute(
    "uv2",
    new BufferAttribute(plane.geometry.attributes.uv.array, 2)
  );

  const torus = new Mesh(new TorusGeometry(0.4, 0.2, 64, 128), material);
  torus.position.x = 1.5;
  torus.geometry.setAttribute(
    "uv2",
    new BufferAttribute(torus.geometry.attributes.uv.array, 2)
  );
  scene.add(sphere, plane, torus);

  // Lights
  const ambient_light = new AmbientLight(0xffffff, 0.5);
  scene.add(ambient_light);

  const point_light = new PointLight(0xffffff, 0.5);
  point_light.position.x = 2;
  point_light.position.y = 3;
  point_light.position.z = 4;
  scene.add(point_light);

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
