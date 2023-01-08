import "@styles/style.css";

function init() {
  const links = [
    { href: "/basic-scene/", text: "03 Basic Scene" },
    { href: "/transform-objects/", text: "05 Transform Objects" },
    { href: "/animations/", text: "06 Animations" },
  ];

  const html = links.map((link) => `<a href="${link.href}">${link.text}</a>`);
  console.log(html);

  document.querySelector(
    "#app"
  )!.innerHTML = `<div style="display: grid;">${html.join("")}</div>`;
}

init();
