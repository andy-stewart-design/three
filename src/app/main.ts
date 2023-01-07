import "@styles/style.css";

function init() {
  const links = [
    { href: "/basic-scene/", text: "Basic Scene" },
    { href: "/transform-objects/", text: "Transform Objects" },
  ];

  const html = links.map((link) => `<a href="${link.href}">${link.text}</a>`);
  console.log(html);

  document.querySelector(
    "#app"
  )!.innerHTML = `<div style="display: grid;">${html.join("")}</div>`;
}

init();
