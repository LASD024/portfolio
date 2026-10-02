(function(){
  "use strict";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  // Proyectos
  function media(p){
    let html = "";
    if(p.youtube){
      html += `<div class="media"><button class="video-btn" type="button" data-id="${esc(p.youtube)}" data-title="${esc(p.name)}" aria-label="Reproducir video: ${esc(p.name)}">▶ Reproducir video del proyecto</button></div>`;
    }
    (p.images || []).forEach(im=>{
      html += `<figure class="project-figure"><img src="${esc(im.src)}" alt="${esc(im.alt)}" width="${im.w}" height="${im.h}" loading="lazy" decoding="async"></figure>`;
    });
    return html;
  }
  function render(p,i){
    const period = p.period ? `<p class="meta">${esc(p.period)}</p>` : "";
    const side = media(p);
    return `<article class="project reveal${side ? "" : " project--solo"}" aria-labelledby="p${i}">
      <div>
        <h3 id="p${i}">${esc(p.name)}</h3>
        <p class="sub">${esc(p.org)}</p>${period}
        <h4>Descripción</h4><p>${esc(p.desc)}</p>
        <h4>Tecnologías</h4><ul class="tag-list">${p.tech.map(t=>`<li class="tag">${esc(t)}</li>`).join("")}</ul>
      </div>
      ${side ? `<div class="project-side">${side}</div>` : ""}</article>`;
  }
  const list = document.getElementById("projects-list");
  if(list && typeof PROJECTS !== "undefined"){
    list.innerHTML = PROJECTS.map(render).join("");
    // Video: el iframe de YouTube se carga solo al pulsar (mejor rendimiento)
    list.addEventListener("click", e=>{
      const b = e.target.closest(".video-btn"); if(!b) return;
      const f = document.createElement("iframe");
      f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(b.dataset.id)}?autoplay=1`;
      f.title = "Demostración del proyecto: " + b.dataset.title;
      f.allow = "accelerometer; autoplay; encrypted-media; picture-in-picture";
      f.allowFullscreen = true; f.loading = "lazy";
      b.replaceWith(f); f.focus();
    });
  }

  // Modo oscuro (se guarda la elección; por defecto sigue el sistema)
  const root = document.documentElement, tbtn = document.getElementById("theme-toggle");
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  function paintTheme(){
    const dark = root.getAttribute("data-theme") === "dark";
    tbtn.setAttribute("aria-pressed", dark);
    tbtn.setAttribute("aria-label", dark ? "Activar modo claro" : "Activar modo oscuro");
    tbtn.querySelector(".theme-icon").textContent = dark ? "☀" : "☾";
    tbtn.querySelector(".theme-label").textContent = dark ? "Modo claro" : "Modo oscuro";
    if(metaTheme) metaTheme.content = dark ? "#08111F" : "#0F2D5B";
  }
  tbtn.addEventListener("click", ()=>{
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try{ localStorage.setItem("theme", next); }catch(e){}
    paintTheme();
  });
  paintTheme();

  // Menú móvil
  const toggle = document.querySelector(".nav-toggle"), nav = document.getElementById("menu");
  toggle.addEventListener("click", ()=>{
    const open = nav.classList.toggle("open"); toggle.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", e=>{ if(e.target.tagName==="A"){ nav.classList.remove("open"); toggle.setAttribute("aria-expanded","false"); }});
  document.addEventListener("keydown", e=>{ if(e.key==="Escape"){ nav.classList.remove("open"); toggle.setAttribute("aria-expanded","false"); }});

  // Enlace activo según sección visible
  const links = [...document.querySelectorAll(".nav-list a")];
  const secs = links.map(a=>document.querySelector(a.getAttribute("href")));
  const spy = new IntersectionObserver(es=>es.forEach(en=>{
    if(en.isIntersecting){ links.forEach(a=>{const on=a.getAttribute("href")==="#"+en.target.id; a.classList.toggle("active",on); on?a.setAttribute("aria-current","true"):a.removeAttribute("aria-current");}); }
  }),{rootMargin:"-40% 0px -55% 0px"});
  secs.forEach(s=>s&&spy.observe(s));

  // Aparición discreta (respeta prefers-reduced-motion)
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = document.querySelectorAll(".reveal");
  if(reduce || !("IntersectionObserver" in window)){ items.forEach(i=>i.classList.add("visible")); }
  else{
    const io = new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("visible"); io.unobserve(en.target);} }),{threshold:.08});
    items.forEach(i=>io.observe(i));
  }
  document.getElementById("year").textContent = new Date().getFullYear();
})();