import "@styles/style.css";

function init() {
  const links = [
    { href: "/03-basic-scene/", text: "03 Basic Scene" },
    { href: "/05-transform-objects/", text: "05 Transform Objects" },
    { href: "/06-animations/", text: "06 Animations" },
    { href: "/07-cameras/", text: "07 Cameras" },
    { href: "/08-fullscreen/", text: "08 Fullscreen" },
  ];

  const html = links.map((link) => `<a href="${link.href}">${link.text}</a>`);
  console.log(html);

  document.querySelector(
    "#app"
  )!.innerHTML = `<div style="display: grid;">${html.join("")}</div>`;
}

init();
