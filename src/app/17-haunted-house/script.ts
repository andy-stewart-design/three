import {
  AmbientLight,
  BoxGeometry,
  Clock,
  ConeGeometry,
  DirectionalLight,
  Float16BufferAttribute,
  Fog,
  Group,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  TextureLoader,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import "@styles/style.css";

function init() {
  // --------------------------------------
  // Setup
  // --------------------------------------
  // DEBUG
  const gui = new dat.GUI();

  // CANVAS
  const canvas: HTMLCanvasElement | null = document.querySelector(".webgl");
  if (!canvas) return;

  // SCENE
  const scene = new Scene();

  // Fog
  const fogColor = "#262837";
  const fog = new Fog(fogColor, 1, 15);
  scene.fog = fog;

  // DOOR TEXTURES
  const textureLoader = new TextureLoader();
  const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
  const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
  const doorAmbientOcclusionTexture = textureLoader.load(
    "/textures/door/ambientOcclusion.jpg"
  );
  const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
  const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
  const doorMetalnessTexture = textureLoader.load(
    "/textures/door/metalness.jpg"
  );
  const doorRoughnessTexture = textureLoader.load(
    "/textures/door/roughness.jpg"
  );
  // WALL TEXTURES
  const wallColorTexture = textureLoader.load("/textures/bricks/color.jpg");
  const wallAmbientOcclusionTexture = textureLoader.load(
    "/textures/bricks/ambientOcclusion.jpg"
  );
  const wallNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
  const wallRoughnessTexture = textureLoader.load(
    "/textures/bricks/roughness.jpg"
  );

  // GRASS TEXTURE
  const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
  const grassAmbientOcclusionTexture = textureLoader.load(
    "/textures/grass/ambientOcclusion.jpg"
  );
  const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
  const grassRoughnessTexture = textureLoader.load(
    "/textures/grass/roughness.jpg"
  );
  grassColorTexture.repeat.set(8, 8);
  grassAmbientOcclusionTexture.repeat.set(8, 8);
  grassNormalTexture.repeat.set(8, 8);
  grassRoughnessTexture.repeat.set(8, 8);

  grassColorTexture.wrapS = RepeatWrapping;
  grassAmbientOcclusionTexture.wrapS = RepeatWrapping;
  grassNormalTexture.wrapS = RepeatWrapping;
  grassRoughnessTexture.wrapS = RepeatWrapping;
  grassColorTexture.wrapT = RepeatWrapping;
  grassAmbientOcclusionTexture.wrapT = RepeatWrapping;
  grassNormalTexture.wrapT = RepeatWrapping;
  grassRoughnessTexture.wrapT = RepeatWrapping;

  // --------------------------------------
  // House
  // --------------------------------------
  // HOUSE GROUP
  const house = new Group();
  scene.add(house);

  // WALLS
  const wallHeight = 2.5;
  const wallWidth = 4;
  const walls = new Mesh(
    new BoxGeometry(wallWidth, wallHeight, wallWidth),
    new MeshStandardMaterial({
      map: wallColorTexture,
      aoMap: wallAmbientOcclusionTexture,
      normalMap: wallNormalTexture,
      roughnessMap: wallRoughnessTexture,
    })
  );
  walls.geometry.setAttribute(
    "uv2",
    new Float16BufferAttribute(walls.geometry.attributes.uv.array, 2)
  );
  walls.position.y = wallHeight / 2;
  house.add(walls);

  // ROOF
  const roofHeight = 1;
  const roof = new Mesh(
    new ConeGeometry(3.5, roofHeight, 4),
    new MeshStandardMaterial({ color: "#b35f45" })
  );
  roof.position.y = wallHeight + roofHeight / 2;
  roof.rotation.y = Math.PI * 0.25;
  house.add(roof);

  // DOOR
  const doorHeight = 2.2;
  const door = new Mesh(
    new PlaneGeometry(doorHeight, doorHeight, 100, 100),
    new MeshStandardMaterial({
      map: doorColorTexture,
      transparent: true,
      alphaMap: doorAlphaTexture,
      aoMap: doorAmbientOcclusionTexture,
      displacementMap: doorHeightTexture,
      displacementScale: 0.1,
      normalMap: doorNormalTexture,
      metalnessMap: doorMetalnessTexture,
      roughnessMap: doorRoughnessTexture,
    })
  );
  door.geometry.setAttribute(
    "uv2",
    new Float16BufferAttribute(door.geometry.attributes.uv.array, 2)
  );
  door.position.y = doorHeight / 2 - 0.2;
  door.position.z = wallWidth / 2 + 0.01;
  house.add(door);

  // Bushes
  const bushGeometry = new SphereGeometry(1, 16, 16);
  const bushMaterial = new MeshStandardMaterial({ color: "#89c854" });

  const bush1 = new Mesh(bushGeometry, bushMaterial);
  bush1.scale.set(0.5, 0.5, 0.5);
  bush1.position.set(0.8, 0.2, 2.2);

  const bush2 = new Mesh(bushGeometry, bushMaterial);
  bush2.scale.set(0.25, 0.25, 0.25);
  bush2.position.set(1.4, 0.1, 2.1);

  const bush3 = new Mesh(bushGeometry, bushMaterial);
  bush3.scale.set(0.4, 0.4, 0.4);
  bush3.position.set(-0.8, 0.1, 2.2);

  const bush4 = new Mesh(bushGeometry, bushMaterial);
  bush4.scale.set(0.15, 0.15, 0.15);
  bush4.position.set(-1, 0.05, 2.6);

  house.add(bush1, bush2, bush3, bush4);

  // GRAVES
  const graves = new Group();
  scene.add(graves);

  const graveHeight = 0.8;
  const graveGeometry = new BoxGeometry(0.6, graveHeight, 0.2);
  const graveMaterial = new MeshStandardMaterial({ color: "#b2b6b1" });

  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const x = Math.sin(angle) * (Math.random() * 5 + wallWidth);
    const z = Math.cos(angle) * (Math.random() * 5 + wallWidth);

    const grave = new Mesh(graveGeometry, graveMaterial);
    grave.position.set(x, graveHeight / 2 - 0.2, z);
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.castShadow = true;
    graves.add(grave);
  }

  // Floor
  const floor = new Mesh(
    new PlaneGeometry(30, 30),
    new MeshStandardMaterial({
      map: grassColorTexture,
      aoMap: grassAmbientOcclusionTexture,
      normalMap: grassNormalTexture,
      roughnessMap: grassRoughnessTexture,
    })
  );
  floor.geometry.setAttribute(
    "uv2",
    new Float16BufferAttribute(floor.geometry.attributes.uv.array, 2)
  );
  floor.rotation.x = -Math.PI * 0.5;
  floor.position.y = 0;
  scene.add(floor);

  // --------------------------------------
  // LIGHTS
  // --------------------------------------

  // Ambient light
  const ambientLight = new AmbientLight("#b9d5ff", 0.12);
  gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
  scene.add(ambientLight);

  // Directional light
  const moonLight = new DirectionalLight("#b9d5ff", 0.12);
  moonLight.position.set(4, 5, -2);
  gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
  gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
  gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
  gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
  scene.add(moonLight);

  // Door Light
  const doorLight = new PointLight("#ff7d46", 1, 7);
  doorLight.position.set(0, 2.2, 2.7);
  house.add(doorLight);

  // --------------------------------------
  // GHOSTS
  // --------------------------------------
  const ghost1 = new PointLight("#ff00ff", 2, 3);
  const ghost2 = new PointLight("#ffff00", 2, 3);
  const ghost3 = new PointLight("#00ffff", 2, 3);
  scene.add(ghost1, ghost2, ghost3);

  // --------------------------------------
  // ENABLE FULLSCREEN VIEW
  // --------------------------------------
  // SIZES
  const sizes = { width: window.innerWidth, height: window.innerHeight };

  // FULLSCREEN
  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // --------------------------------------
  // CAMERA
  // --------------------------------------
  // Base camera
  const camera = new PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 4;
  camera.position.y = 2;
  camera.position.z = 5;
  scene.add(camera);

  // CONTROLS
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.maxDistance = 12;
  controls.minDistance = 5;
  controls.rotateSpeed = 0.4;
  controls.zoomSpeed = 0.1;

  // RENDERER
  const renderer = new WebGLRenderer({
    canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(fogColor);

  // SHADOWS
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  moonLight.castShadow = true;
  doorLight.castShadow = true;
  ghost1.castShadow = true;
  ghost2.castShadow = true;
  ghost3.castShadow = true;

  walls.castShadow = true;
  bush1.castShadow = true;
  bush2.castShadow = true;
  bush3.castShadow = true;
  bush4.castShadow = true;

  floor.receiveShadow = true;

  doorLight.shadow.mapSize.width = 256;
  doorLight.shadow.mapSize.height = 256;
  doorLight.shadow.camera.far = 7;

  ghost1.shadow.mapSize.width = 256;
  ghost1.shadow.mapSize.height = 256;
  ghost1.shadow.camera.far = 7;

  ghost2.shadow.mapSize.width = 256;
  ghost2.shadow.mapSize.height = 256;
  ghost2.shadow.camera.far = 7;

  ghost3.shadow.mapSize.width = 256;
  ghost3.shadow.mapSize.height = 256;
  ghost3.shadow.camera.far = 7;

  // --------------------------------------
  // Animate
  // --------------------------------------
  const clock = new Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.z = Math.sin(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(ghost1Angle * 3) + 1;

    const ghost2Angle = -elapsedTime * 0.32;
    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.position.y =
      Math.sin(ghost2Angle * 4) + Math.sin(ghost2Angle * 2.5) + 1;

    const ghost3Angle = elapsedTime * 0.18;
    ghost3.position.x =
      Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.z =
      Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    ghost3.position.y =
      Math.sin(ghost2Angle * 5) + Math.sin(ghost2Angle * 2) + 1;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
}

init();
