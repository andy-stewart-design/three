import {
  AxesHelper,
  BoxGeometry,
  Group,
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
  // const geometry = new BoxGeometry(1, 1, 1);
  // const material = new MeshBasicMaterial({ color: 0xff0000 });
  // const mesh = new Mesh(geometry, material);
  // mesh.position.x = 0.7;
  // mesh.position.y = -0.6;
  // mesh.position.z = 1;
  // mesh.position.set(0.7, -0.6, 1);
  // mesh.scale.x = 2;
  // mesh.scale.y = 0.5;
  // mesh.scale.z = -0.5;
  // mesh.scale.set(2, 0.5, -0.5);

  // mesh.rotation.reorder("YXZ");
  // mesh.rotation.x = Math.PI / 4;
  // mesh.rotation.y = Math.PI / 4;
  // scene.add(mesh);

  const group = new Group();
  scene.add(group);

  const cube1 = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0xff0000 })
  );
  group.add(cube1);

  const cube2 = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0x00ff00 })
  );
  cube2.position.x = -2;
  group.add(cube2);
  group.position.y = 1;

  const cube3 = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0x0000ff })
  );
  cube3.position.x = 2;
  group.add(cube3);

  // Axes helper
  const axesHelper = new AxesHelper(3);
  scene.add(axesHelper);

  // Camera
  const camera = new PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.z = 3;
  scene.add(camera);

  // camera.lookAt(mesh.position);

  // Renderer
  const renderer = new WebGLRenderer({
    canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
}

init();
