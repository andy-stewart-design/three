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
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import "@styles/style.css"; 

function init() {
  // setup
  const canvas: HTMLCanvasElement | null = document.querySelector(".webgl");
  if (!canvas) return;

  let mouse = {
    x: 0, 
    y: 0
  } 

  window.addEventListener('mousemove', (event)=>{
    const canvasPositionX = canvas.getBoundingClientRect().left;
    const canvasPositionY = canvas.getBoundingClientRect().top;
    const cursorX = (event.clientX - canvasPositionX) / sizes.width - 0.5;
    const cursorY = (event.clientY - canvasPositionY) / sizes.height - 0.5;
    if (cursorX >= -0.5 && cursorX <= 0.5) mouse.x = cursorX;
    if (cursorY >= -0.5 && cursorY <= 0.5) mouse.y = cursorY;
    
    console.log(mouse);
  })

  const sizes = { width: 800, height: 600 };

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
  // const camera = new OrthographicCamera(-2 * aspectRatio, 2 * aspectRatio, 2, -2, 0.1, 100)
  // camera.position.x = 2;
  // camera.position.y = 2;
  camera.position.z = 3;
  scene.add(camera);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // Renderer
  const renderer = new WebGLRenderer({
    canvas,
  });
  renderer.setSize(sizes.width, sizes.height);

  // let time = Date.now();
  // const clock = new Clock();
  

  // Animate
  function tick() {
    // const currentTime = Date.now();
    // const deltaTime = currentTime - time;
    // time = currentTime;
    // const time = clock.getElapsedTime();

    // mesh.rotation.y = time;
    // camera.position.x = Math.sin(mouse.x * Math.PI * 2) * 3;
    // camera.position.y = mouse.y * 5;
    // camera.position.z = Math.cos(mouse.x * Math.PI * 2) * 3;
    // camera.lookAt(mesh.position);
    controls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}

init();
