import "@styles/style.css";

function init() {
  const pages = import.meta.glob(`./**/index.html`);
  const paths = Object.keys(pages);
  const allSlugs = paths.map((path) => {
    const href = path.replace("./", "").replace("/index.html", "");
    const text = href.replaceAll("-", " ");
    return { href, text };
  });
  const slugs = allSlugs.slice(0, allSlugs.length - 1);
  console.log(slugs);

  const html = slugs.map((link) => `<a href="/${link.href}/">${link.text}</a>`);

  document.querySelector(
    "#app"
  )!.innerHTML = `<div style="display: grid;">${html.join("")}</div>`;
}

init();
