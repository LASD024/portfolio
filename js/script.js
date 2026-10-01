(function(){
  "use strict";
  const PH = t => `<span class="placeholder">[${t}]</span>`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  // Proyectos
  function media(p){
    if(p.youtube){
      return `<div class="media"><button class="video-btn" type="button" data-id="${esc(p.youtube)}" data-title="${esc(p.name)}" aria-label="Reproducir video: ${esc(p.name)}">▶ Reproducir video del proyecto</button></div>`;
    }
    if(p.image) return `<div class="media"><img src="${esc(p.image)}" alt="Imagen del proyecto ${esc(p.name)}" loading="lazy" width="640" height="360"></div>`;
    return `<div class="media"><div class="media-empty">[VIDEO DE YOUTUBE O IMAGEN DEL PROYECTO]</div></div>`;
  }
  function link(url,label,cls,ph){
    return url ? `<a class="btn ${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`
               : `<span class="btn btn-disabled" aria-disabled="true">${label} ${ph}</span>`;
  }
  function render(p,i){
    const badge = p.status ? `<span class="badge">${esc(p.status)}</span>` : "";
    return `<article class="project reveal" aria-labelledby="p${i}">
      <div>
        <h3 id="p${i}">${esc(p.name)}</h3>${badge}
        <h4>Descripción</h4><p>${esc(p.desc)}</p>
        <h4>Problema o propósito</h4><p>${p.purpose ? esc(p.purpose) : PH("PROBLEMA O PROPÓSITO")}</p>
        <h4>Solución y aportes</h4><ul>${p.solution.map(s=>`<li>${esc(s)}</li>`).join("")}</ul>
        <h4>Resultados</h4><p>${p.results ? esc(p.results) : PH("RESULTADOS")}</p>
        <h4>Tecnologías</h4><ul class="tag-list">${p.tech.map(t=>`<li class="tag">${esc(t)}</li>`).join("")}</ul>
      </div>
      <div class="project-side">${media(p)}
        <div class="project-links">${link(p.github,"GitHub","btn-secondary","[URL DE GITHUB]")}${p.extra?link(p.extra,"Enlace adicional","btn-secondary",""):""}</div>
      </div></article>`;
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
