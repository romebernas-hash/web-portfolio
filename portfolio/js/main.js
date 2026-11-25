(function(){
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,root=document.documentElement;
const header=$('header'),burger=$('.burger'),menu=$('#menu');
const setMenu=o=>{menu.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''};
burger.onclick=()=>setMenu(!menu.classList.contains('open'));
$$('a',menu).forEach(a=>a.addEventListener('click',()=>setMenu(false)));
const lb=$('#lightbox'),frame=$('#lbFrame');let lf=null;
const closeLb=()=>{lb.classList.remove('show');lf&&lf.focus()};
addEventListener('keydown',e=>{if(e.key==='Escape'){setMenu(false);closeLb()}});
const onScroll=()=>{header.classList.toggle('scrolled',scrollY>30);root.style.setProperty('--sy',scrollY);
 $$('.timeline').forEach(t=>{const r=t.getBoundingClientRect();t.style.setProperty('--tp',Math.max(0,Math.min(1,(innerHeight*.65-r.top)/r.height)).toFixed(3))})};
addEventListener('scroll',onScroll,{passive:true});onScroll();
const links=$$('nav a');
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
$$('main section').forEach(s=>spy.observe(s));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>{const sibs=[...el.parentElement.children].filter(c=>c.classList.contains('reveal'));el.style.transitionDelay=(sibs.indexOf(el)*90)+'ms';io.observe(el)});
setTimeout(()=>$$('.reveal:not(.in)').forEach(el=>{const r=el.getBoundingClientRect();if(r.top<innerHeight)el.classList.add('in')}),1800);
$$('.toggle').forEach(b=>b.addEventListener('click',()=>{const c=b.closest('.proj'),o=c.classList.toggle('open');b.setAttribute('aria-expanded',o);b.textContent=o?'Hide details':'Show details'}));
$$('.cert').forEach(c=>c.addEventListener('click',()=>{lf=c;const s=c.dataset.src;frame.innerHTML=s?'<img src="'+s+'" alt="'+c.dataset.title+'">':'<div class="ph">'+c.dataset.title+'</div>';lb.classList.add('show');$('.close').focus()}));
$$('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{lf=b;frame.innerHTML='<div class="gal">'+b.dataset.gallery.split(',').map(s=>'<img src="'+s.trim()+'" alt="Tourism design screenshot" onerror="this.remove()">').join('')+'</div>';lb.classList.add('show');$('.close').focus()}));
$('.close').onclick=closeLb;lb.addEventListener('click',e=>{if(e.target===lb)closeLb()});
const form=$('#contactForm'),note=$('#formNote');
form.addEventListener('submit',e=>{let ok=true;$$('input,textarea',form).forEach(f=>{const err=f.parentElement.querySelector('.err');let m='';if(!f.value.trim())m='Enter your '+f.name+'.';else if(f.type==='email'&&!/^\S+@\S+\.\S+$/.test(f.value))m='Enter a valid email address.';err.textContent=m;if(m)ok=false});
 if(!ok)e.preventDefault();else{const b=$('button[type=submit]',form);b.textContent='Sending…';b.disabled=true;note.textContent='Sending your message…'}});
addEventListener('pageshow',()=>{const b=$('button[type=submit]',form);b.textContent='Send message';b.disabled=false;note.textContent=''});
const loadImg=el=>{const exts=['jpg','jpeg','png','webp','JPG','JPEG','PNG','WEBP'],has=/\.(jpe?g|png|webp|gif|avif)$/i,list=[];
 el.dataset.img.split(',').map(s=>s.trim()).filter(Boolean).forEach(b=>has.test(b)?list.push(b):exts.forEach(x=>list.push(b+'.'+x)));
 let i=0;(function next(){if(i>=list.length){if(el.dataset.hint)el.textContent=el.dataset.hint;return}const src=list[i++],im=new Image();
 im.onload=()=>{im.alt=el.dataset.alt||'';el.textContent='';el.appendChild(im);el.classList.add('loaded');const c=el.closest('.cert');if(c)c.dataset.src=src};im.onerror=next;im.src=src})()};
$$('[data-img]').forEach(loadImg);

const pt=$('.portrait');
if(pt&&!RM&&matchMedia('(hover: hover) and (pointer: fine)').matches){
 pt.addEventListener('pointermove',e=>{const r=pt.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
  pt.style.setProperty('--ry',((px-.5)*14).toFixed(1)+'deg');pt.style.setProperty('--rx',((.5-py)*14).toFixed(1)+'deg');pt.style.setProperty('--gx',(px*100).toFixed(0)+'%');pt.style.setProperty('--gy',(py*100).toFixed(0)+'%')});
 pt.addEventListener('pointerleave',()=>{pt.style.setProperty('--rx','0deg');pt.style.setProperty('--ry','0deg')});
}
$$('a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
if(!RM){const rays=document.createElement('div');rays.id='rays';document.body.prepend(rays);
 const cv=document.createElement('canvas');cv.id='fx';document.body.prepend(cv);const x=cv.getContext('2d');let W,H,P=[];
 const size=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight;P=Array.from({length:innerWidth<700?10:30},()=>({x:Math.random()*W,y:Math.random()*H,r:.6+Math.random()*1.6,v:.08+Math.random()*.25,a:.15+Math.random()*.35,c:Math.random()<.3?'155,117,208':'245,245,245'}))};
 size();addEventListener('resize',size);
 (function loop(){x.clearRect(0,0,W,H);for(const p of P){p.y-=p.v;if(p.y<-5){p.y=H+5;p.x=Math.random()*W}x.fillStyle='rgba('+p.c+','+p.a+')';x.beginPath();x.arc(p.x,p.y,p.r,0,6.283);x.fill()}requestAnimationFrame(loop)})()}
})();

/* Redesign layer. Load AFTER js/main.js (both with defer). Injects the new
   elements so index.html stays almost untouched. */
(function(){
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const home=$('#home'), grid=$('.hero-grid',home||document), intro=$('.intro',home||document), big=$('.bigname',home||document);

  /* ---- Hero ---- */
  if(home&&grid&&intro){
    home.insertAdjacentHTML('afterbegin','<div class="hero-word" aria-hidden="true">PORTFOLIO</div>');
    home.insertAdjacentHTML('beforeend','<div class="hero-top"><span id="clk">Capiz, PH</span><span class="st"><i></i>Open to opportunities</span></div>');
    if(big) intro.prepend(big);
    intro.insertAdjacentHTML('afterbegin','<p class="hello">Hello, I’m</p>');
    grid.insertAdjacentHTML('beforeend','<div class="stats" aria-label="Quick facts">'+
      [[2,'Government internships'],[4,'Projects built'],[2,'Certificates']]
      .map(([n,l])=>'<div class="stat"><b data-n="'+n+'">0</b><small>'+l+'</small></div>').join('')+'</div>');

    const count=el=>{const n=+el.dataset.n; if(RM){el.textContent=n;return}
      let t0; const f=t=>{t0=t0||t; const p=Math.min((t-t0)/1200,1); el.textContent=Math.round(n*(1-Math.pow(1-p,3))); if(p<1)requestAnimationFrame(f)}; requestAnimationFrame(f)};
    const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){$$('b',e.target).forEach(count);so.disconnect()}}));
    so.observe($('.stats'));

    const clk=$('#clk'), tick=()=>{clk.textContent='Capiz, PH · '+new Date().toLocaleTimeString('en-US',{timeZone:'Asia/Manila',hour:'numeric',minute:'2-digit'})};
    tick(); setInterval(tick,30000);
  }

  /* ---- Work process + quote (inside About) ---- */
  const wrap=$('#about .wrap');
  if(wrap){
    const S=[
      ['Understand','Learning the problem, the users and what the system needs to do.','<circle cx="11" cy="11" r="6"/><path d="M16 16l5 5"/>'],
      ['Plan','Sketching the database, the pages and how everything connects.','<path d="M4 6h16M4 12h16M4 18h10"/>'],
      ['Design','Shaping layouts and interfaces with Figma, HTML and CSS.','<path d="M4 20l4-1 11-11-3-3L5 16z"/>'],
      ['Build','Writing the code with Python, MySQL and web technologies.','<path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/>'],
      ['Test','Checking results, fixing errors and improving with my group.','<path d="M5 12l5 5 9-10"/>']
    ];
    wrap.insertAdjacentHTML('beforeend','<div class="proc"><div class="proc-list glass reveal" data-r="l"><h3>Work process</h3>'+
      S.map((s,i)=>'<div class="pstep reveal"><span class="pn">0'+(i+1)+'</span><span class="pc"><svg viewBox="0 0 24 24" aria-hidden="true">'+s[2]+'</svg></span><div><h4>'+s[0]+'</h4><p>'+s[1]+'</p></div></div>').join('')+
      '</div><aside class="pquote glass reveal" data-r="r"><span class="qm" aria-hidden="true">“</span><p class="q">Build it simple, make it work, and keep learning.</p><span class="sig">Jerome</span><small>Let’s build something great together.</small></aside></div>');
    $$('.proc .pstep').forEach((el,i)=>el.style.transitionDelay=(i*140)+'ms');
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
    $$('.proc .reveal').forEach(el=>io.observe(el));
  }

  /* ---- Contact ---- */
  const h=$('#contact h2'); if(h) h.textContent='Let’s connect';
 const ic=['<path d="M4 6h16v12H4zM4 7l8 6 8-6"/>','<path d="M5 9v10M5 5v1M10 19v-6a3 3 0 016 0v6M10 9v10"/>','<path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/>','<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'];
  $$('#contact .links>div').forEach((d,i)=>{if(ic[i]) d.insertAdjacentHTML('afterbegin','<span class="ci"><svg viewBox="0 0 24 24" aria-hidden="true">'+ic[i]+'</svg></span>')});

  /* ---- Scroll progress bar ---- */
  const pg=document.createElement('div'); pg.id='prog'; pg.setAttribute('aria-hidden','true'); document.body.append(pg);
  const de=document.documentElement;
  addEventListener('scroll',()=>pg.style.setProperty('--pg',(scrollY/Math.max(1,de.scrollHeight-innerHeight)).toFixed(3)),{passive:true});
})();

/* ---- Skills marquee: builds the seamless loop from one list per row ---- */
(function(){
  document.querySelectorAll('.mq-track').forEach(function(t){
    var base=t.querySelector('.mq-set'); if(!base) return;
    var items=[].slice.call(base.children);
    function mk(hid){
      var u=document.createElement('ul'); u.className='mq-set'; if(hid) u.setAttribute('aria-hidden','true');
      for(var k=0;k<3;k++) items.forEach(function(li){var c=li.cloneNode(true); if(hid||k) c.setAttribute('aria-hidden','true'); u.appendChild(c)});
      return u;
    }
    base.replaceWith(mk(false)); t.appendChild(mk(true));
    t.querySelectorAll('img').forEach(function(i){
      var bad=function(){i.replaceWith(document.createTextNode(i.dataset.fb||'•'))};
      i.addEventListener('error',bad); if(i.complete&&!i.naturalWidth) bad();
    });
  });
})();

/* ===== Loader skip + favicon ===== */
(function(){
  var h=document.documentElement, seen=false;
  try{seen=sessionStorage.getItem('jbl')}catch(e){}
  if(seen) h.classList.add('ld-skip'); else { try{sessionStorage.setItem('jbl','1')}catch(e){} }
  var skip=function(){h.classList.add('ld-skip')};
  ['click','keydown','touchstart','wheel'].forEach(function(ev){addEventListener(ev,skip,{once:true,passive:true})});
  setTimeout(skip,1900);
  if(!document.querySelector('link[rel~=icon]')){
    var l=document.createElement('link'); l.rel='icon';
    l.href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%2308090B'/%3E%3Crect x='2' y='2' width='60' height='60' rx='12' fill='none' stroke='%239B75D0' stroke-width='3'/%3E%3Ctext x='32' y='43' font-family='Arial,sans-serif' font-size='28' font-weight='700' text-anchor='middle' fill='%23F5F5F5'%3EJB%3C/text%3E%3C/svg%3E";
    document.head.appendChild(l);
  }
  var m=document.createElement('meta'); m.name='theme-color'; m.content='#08090B'; document.head.appendChild(m);
})();

/* ===== Sakura petals + ambient effects (violet theme) =====
   Own IIFE, injects its own canvases and styles. Safe to paste at the very
   bottom of js/main.js, or load as a separate file with <script defer>. */
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var mob=innerWidth<700, DPR=Math.min(window.devicePixelRatio||1,2);
  var N_BACK=mob?12:26, N_FRONT=mob?2:5, N_ORB=mob?6:12;

  /* canvases: one behind the content, one softly blurred in front for depth */
  function mk(id,z,blur){
    var c=document.createElement('canvas'); c.id=id; c.setAttribute('aria-hidden','true');
    c.style.cssText='position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:'+z+(blur?';filter:blur('+blur+'px)':'');
    document.body.appendChild(c); return c;
  }
  var cb=mk('sk-back',1), cf=mk('sk-front',40,1.3), xb=cb.getContext('2d'), xf=cf.getContext('2d');
  var W,H;
  function size(){
    W=innerWidth; H=innerHeight;
    [cb,cf].forEach(function(c){c.width=W*DPR; c.height=H*DPR});
    xb.setTransform(DPR,0,0,DPR,0,0); xf.setTransform(DPR,0,0,DPR,0,0);
  }
  size(); addEventListener('resize',size);

  /* toggle button + styles */
  var st=document.createElement('style');
  st.textContent='#sk-toggle{position:fixed;left:18px;bottom:18px;z-index:60;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;cursor:pointer;background:rgba(17,18,20,.7);border:1px solid rgba(155,117,208,.4);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 10px 24px -12px #000,0 0 16px rgba(118,81,168,.35);transition:border-color .3s,box-shadow .3s,opacity .3s}'+
    '#sk-toggle:hover{border-color:#9B75D0;box-shadow:0 0 18px rgba(155,117,208,.6)}'+
    '#sk-toggle svg{width:20px;height:20px;fill:none;stroke:#9B75D0;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}'+
    '#sk-toggle[aria-pressed=false]{opacity:.55}#sk-toggle[aria-pressed=false] svg{stroke:#A6A6A6}'+
    'html[data-theme=light] #sk-toggle{background:rgba(255,255,255,.85);box-shadow:0 10px 24px -14px rgba(60,40,110,.4),0 0 16px rgba(124,77,196,.25)}html[data-theme=light] #sk-toggle svg{stroke:#7C4DC4}';
  document.head.appendChild(st);
  var running=true, btn=document.createElement('button');
  btn.id='sk-toggle'; btn.type='button'; btn.setAttribute('aria-label','Toggle falling petals'); btn.setAttribute('aria-pressed','true'); btn.title='Petals on / off';
  btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c4-2 6-5 5-9-1-3-3-5-5-7-2 2-4 4-5 7-1 4 1 7 5 9z"/><path d="M12 8v9"/></svg>';
  btn.onclick=function(){
    running=!running; btn.setAttribute('aria-pressed',running);
    cb.style.display=cf.style.display=running?'':'none';
  };
  document.body.appendChild(btn);

  /* ---------- petals ---------- */
  var COLD=['214,190,245','214,190,245','155,117,208','245,235,255','245,235,255','255,205,228','190,160,235'];
  var COLL=['236,150,190','226,120,175','180,130,230','244,176,206','160,110,215','240,140,185','200,150,235'];
  var root=document.documentElement, light=false;
  var mx=-999,my=-999,wind=0,gust=0,t=0,lastY=scrollY;
  function rnd(a,b){return a+Math.random()*(b-a)}
  function petal(front,x,y,burst){
    return {front:front, x:x, y:y,
      s:front?rnd(11,18):rnd(4.5,10.5), vy:front?rnd(1.1,1.9):rnd(.5,1.2),
      a:front?rnd(.5,.75):rnd(.3,.7), ci:(Math.random()*COLD.length)|0,
      ph:rnd(0,6.28), sw:rnd(.012,.03), amp:front?rnd(.7,1.4):rnd(.3,.9),
      rot:rnd(0,6.28), rv:rnd(-.03,.03), fl:rnd(0,6.28), fv:rnd(.02,.06),
      ex:burst?rnd(-4,4):0, ey:burst?rnd(-5,-1):0, burst:!!burst};
  }
  function reset(p){p.y=-rnd(20,90); p.x=rnd(-100,W+100); p.ex=p.ey=0}
  var back=[],front=[],bursts=[],i;
  for(i=0;i<N_BACK;i++) back.push(petal(false,rnd(0,W),rnd(0,H)));
  for(i=0;i<N_FRONT;i++) front.push(petal(true,rnd(0,W),rnd(0,H)));

  function step(p){
    p.ph+=p.sw; p.rot+=p.rv; p.fl+=p.fv; p.ex*=.94; p.ey*=.94;
    var dx=p.x-mx, dy=p.y-my, d2=dx*dx+dy*dy;
    if(d2<16900){var d=Math.sqrt(d2)||1,f=(1-d/130)*1.6; p.ex+=dx/d*f; p.ey+=dy/d*f*.6}
    p.x+=wind*(p.front?1.7:1)+Math.sin(p.ph)*p.amp+p.ex;
    p.y+=p.vy+p.ey+Math.abs(Math.cos(p.ph))*.15;
    if(!p.burst&&(p.y>H+30||p.x<-120||p.x>W+120)) reset(p);
  }
  function draw(x,p){
    var s=p.s, sx=.25+Math.abs(Math.cos(p.fl))*.75;
    x.save(); x.translate(p.x,p.y); x.rotate(p.rot); x.scale(sx,1);
    x.fillStyle='rgba('+(light?COLL:COLD)[p.ci]+','+p.a+')';
    x.beginPath(); x.moveTo(0,s);
    x.bezierCurveTo(s*.9,s*.5,s*.8,-s*.7,s*.14,-s);
    x.lineTo(0,-s*.76); x.lineTo(-s*.14,-s);
    x.bezierCurveTo(-s*.8,-s*.7,-s*.9,s*.5,0,s);
    x.fill(); x.restore();
  }

  /* ---------- glowing orbs (fireflies) ---------- */
  var spr=document.createElement('canvas'); spr.width=spr.height=64;
  var g=spr.getContext('2d'), gr=g.createRadialGradient(32,32,0,32,32,32);
  gr.addColorStop(0,'rgba(255,255,255,.95)'); gr.addColorStop(.25,'rgba(190,160,235,.55)'); gr.addColorStop(1,'rgba(155,117,208,0)');
  g.fillStyle=gr; g.fillRect(0,0,64,64);
  var spr2=document.createElement('canvas'); spr2.width=spr2.height=64;
  var g2=spr2.getContext('2d'), gr2=g2.createRadialGradient(32,32,0,32,32,32);
  gr2.addColorStop(0,'rgba(124,77,196,.8)'); gr2.addColorStop(.3,'rgba(160,120,220,.4)'); gr2.addColorStop(1,'rgba(160,120,220,0)');
  g2.fillStyle=gr2; g2.fillRect(0,0,64,64);
  var orbs=[]; for(i=0;i<N_ORB;i++) orbs.push({x:rnd(0,W),y:rnd(0,H),r:rnd(2,5),vx:rnd(-.15,.15),vy:rnd(-.25,-.05),ph:rnd(0,6.28),sp:rnd(.01,.03)});

  /* ---------- shooting star ---------- */
  var ss=null, nextSS=performance.now()+4000;
  function spawnSS(){ss={x:rnd(W*.3,W),y:rnd(0,H*.3),vx:-rnd(9,14),vy:rnd(4,7),life:0}}

  /* ---------- interaction ---------- */
  addEventListener('pointermove',function(e){mx=e.clientX; my=e.clientY},{passive:true});
  addEventListener('pointerleave',function(){mx=my=-999});
  addEventListener('scroll',function(){
    var dy=scrollY-lastY; lastY=scrollY;
    gust+=Math.max(-1.5,Math.min(1.5,dy*.006));
    var k=Math.max(-40,Math.min(40,dy));
    back.forEach(function(p){p.y-=k*.12}); front.forEach(function(p){p.y-=k*.3});
  },{passive:true});
  addEventListener('pointerdown',function(e){
    if(!running||e.target.closest&&e.target.closest('input,textarea,select')) return;
    for(var k=0;k<9;k++){
      var p=petal(k%3===0,e.clientX,e.clientY,true); p.a=Math.max(p.a,.55); bursts.push(p);
    }
    if(bursts.length>45) bursts.splice(0,bursts.length-45);
  },{passive:true});

  /* ---------- loop ---------- */
  function loop(now){
    requestAnimationFrame(loop);
    if(!running||document.hidden) return;
    t+=.01; gust*=.97; wind=Math.sin(t*.6)*.35+Math.sin(t*.23)*.25+gust;
    light=root.getAttribute('data-theme')==='light';
    xb.clearRect(0,0,W,H); xf.clearRect(0,0,W,H);

    for(i=0;i<orbs.length;i++){
      var o=orbs[i]; o.ph+=o.sp; o.x+=o.vx+Math.sin(o.ph*.7)*.2; o.y+=o.vy;
      if(o.y<-20){o.y=H+20;o.x=rnd(0,W)} if(o.x<-20)o.x=W+20; if(o.x>W+20)o.x=-20;
      xb.globalAlpha=.2+.5*(Math.sin(o.ph)*.5+.5);
      xb.drawImage(light?spr2:spr,o.x-o.r*3,o.y-o.r*3,o.r*6,o.r*6);
    }
    xb.globalAlpha=1;

    if(!ss&&now>nextSS) spawnSS();
    if(ss){
      ss.x+=ss.vx; ss.y+=ss.vy; ss.life++;
      var len=140, nx=ss.vx/Math.hypot(ss.vx,ss.vy), ny=ss.vy/Math.hypot(ss.vx,ss.vy);
      var lg=xb.createLinearGradient(ss.x,ss.y,ss.x-nx*len,ss.y-ny*len);
      lg.addColorStop(0,light?'rgba(107,63,168,.85)':'rgba(255,255,255,.9)'); lg.addColorStop(1,light?'rgba(124,77,196,0)':'rgba(155,117,208,0)');
      xb.strokeStyle=lg; xb.lineWidth=1.6; xb.lineCap='round';
      xb.beginPath(); xb.moveTo(ss.x,ss.y); xb.lineTo(ss.x-nx*len,ss.y-ny*len); xb.stroke();
      if(ss.life>80||ss.x<-200||ss.y>H+200){ss=null; nextSS=now+rnd(7000,16000)}
    }

    for(i=0;i<back.length;i++){step(back[i]); draw(xb,back[i])}
    for(i=0;i<front.length;i++){step(front[i]); draw(xf,front[i])}
    for(i=bursts.length-1;i>=0;i--){
      var b=bursts[i]; step(b); draw(b.front?xf:xb,b);
      if(b.y>H+40||b.x<-80||b.x>W+80) bursts.splice(i,1);
    }
  }
  requestAnimationFrame(loop);
})();

/* ===== Light / dark mode =====
   Load in <head> AFTER the style.css link, WITHOUT defer:
   <script src="js/theme.js"></script>
   It sets the saved theme immediately (no flash), injects the light-mode
   colors, and adds a sun/moon button to the header. */
(function(){
  var KEY='jb-theme', root=document.documentElement;
  function saved(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function setMeta(m){var mc=document.querySelector('meta[name=theme-color]'); if(mc) mc.setAttribute('content',m==='light'?'#F7F5FB':'#08090B')}
  function apply(m){if(m==='light') root.setAttribute('data-theme','light'); else root.removeAttribute('data-theme'); setMeta(m)}
  apply(saved()==='light'?'light':'dark');

  var L='html[data-theme=light]';
  var css=
  L+'{color-scheme:light;--obsidian:#F7F5FB;--charcoal:#EEEAF7;--dark:#E2DCF0;--slate:#C9BFDD;--silver:#6A6381;--light:#3B3452;--white:#1B1530;--violet:#6B3FA8;--violet-soft:#7C4DC4}'+
  /* header + nav */
  L+' header::before{background:rgba(255,255,255,.72);border-color:rgba(27,21,48,.1);box-shadow:0 14px 40px -22px rgba(60,40,110,.35),0 0 40px -22px rgba(124,77,196,.5)}'+
  L+' header.scrolled::before{background:rgba(255,255,255,.92);border-color:rgba(124,77,196,.3)}'+
  L+' nav a:hover{background:rgba(27,21,48,.06)}'+
  L+' nav a.active{background:rgba(124,77,196,.16);box-shadow:0 0 16px rgba(124,77,196,.25)}'+
  '@media(max-width:960px){'+L+' nav{background:rgba(247,245,251,.98)}'+L+' nav a.active{background:none;box-shadow:none}.theme-btn{margin-left:auto}}'+
  /* surfaces */
  L+' .glass{background:rgba(255,255,255,.72);border-color:rgba(27,21,48,.1);box-shadow:0 18px 40px -28px rgba(60,40,110,.35)}'+
  L+' .glass:hover{border-color:rgba(124,77,196,.55)}'+
  L+' .ph{border-color:rgba(27,21,48,.1)}'+
  L+' .jp{-webkit-text-stroke-color:rgba(27,21,48,.09)}'+
  L+' section+section{border-top-color:rgba(27,21,48,.07)}'+
  L+' h2::after{background:linear-gradient(90deg,rgba(124,77,196,.55),rgba(27,21,48,.06))}'+
  L+' .hero-top,'+L+' .stat{border-color:rgba(27,21,48,.12)}'+
  L+' .portrait{filter:drop-shadow(0 22px 26px rgba(70,40,120,.28))}'+
  L+' .portrait::before{background:radial-gradient(closest-side,rgba(124,77,196,.3),transparent 72%)}'+
  L+' .portrait::after{box-shadow:0 0 24px rgba(124,77,196,.3)}'+
  L+' .mq-row{border-block-color:rgba(27,21,48,.08);background:linear-gradient(90deg,transparent,rgba(124,77,196,.08),transparent)}'+
  L+' .mq-item{background:linear-gradient(180deg,#fff,#F1EDF9);border-color:rgba(124,77,196,.25);box-shadow:0 8px 20px -14px rgba(60,40,110,.4)}'+
  L+' .mq-ico,'+L+' .bi{background:#fff;border-color:rgba(27,21,48,.1)}'+
  L+' .about-photo{border-color:rgba(27,21,48,.1)}'+
  L+' .about-photo figcaption{background:linear-gradient(to top,rgba(247,245,251,.92),transparent)}'+
  L+' input,'+L+' textarea{background:rgba(255,255,255,.85)}'+
  L+' .links>div{border-bottom-color:rgba(27,21,48,.09)}'+
  L+' .lightbox{background:rgba(238,234,247,.95)}'+
  L+' .cert .ph.loaded img{background:#fff}'+
  L+' #projects .case-visual .ph{background:#fff;border-color:rgba(124,77,196,.3);box-shadow:0 24px 60px -34px rgba(124,77,196,.5)}'+
  L+' #projects .case dl>div{border-top-color:rgba(27,21,48,.1)}'+
  L+' .pquote{background:linear-gradient(160deg,rgba(124,77,196,.28),rgba(255,255,255,.9) 75%) 0 0/200% 200%}'+
  L+' .pmodal{background:rgba(238,234,247,.85)}'+
  L+' .pm-top{background:rgba(247,245,251,.94);border-bottom-color:rgba(27,21,48,.1)}'+
  L+' .pm-nav button{background:#fff}'+
  L+' .pc-num{color:#fff}'+
  /* background effects */
  L+' #fx{filter:invert(1) hue-rotate(180deg)}'+
  L+' #rays{mix-blend-mode:normal;opacity:.45}'+
  /* theme button */
  '.theme-btn{position:relative;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;cursor:pointer;background:rgba(155,117,208,.08);border:1px solid rgba(155,117,208,.4);color:var(--white);transition:border-color .3s,box-shadow .3s,background .3s}'+
  '.theme-btn:hover{border-color:var(--violet-soft);box-shadow:0 0 14px rgba(155,117,208,.45)}'+
  '.theme-btn svg{position:absolute;width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;transition:transform .5s cubic-bezier(.2,.7,.1,1),opacity .3s}'+
  '.theme-btn .sun{transform:rotate(-90deg) scale(.4);opacity:0}'+
  L+' .theme-btn .sun{transform:none;opacity:1}'+
  L+' .theme-btn .moon{transform:rotate(90deg) scale(.4);opacity:0}'+
  L+' #sk-toggle{background:rgba(255,255,255,.8)}'+
  /* smooth switch */
  'html.theme-anim *,html.theme-anim *::before,html.theme-anim *::after{transition:background-color .5s,color .5s,border-color .5s,box-shadow .5s,fill .5s,stroke .5s!important}';
  var st=document.createElement('style'); st.id='theme-css'; st.textContent=css; document.head.appendChild(st);

  function build(){
    var header=document.querySelector('header'); if(!header) return;
    var btn=document.createElement('button'); btn.type='button'; btn.className='theme-btn';
    btn.innerHTML='<svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/></svg>'+
      '<svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    function label(){var l=root.getAttribute('data-theme')==='light'; btn.setAttribute('aria-label',l?'Switch to dark mode':'Switch to light mode'); btn.title=l?'Dark mode':'Light mode'}
    label();
    btn.addEventListener('click',function(){
      var next=root.getAttribute('data-theme')==='light'?'dark':'light';
      root.classList.add('theme-anim'); apply(next);
      try{localStorage.setItem(KEY,next)}catch(e){}
      label(); setTimeout(function(){root.classList.remove('theme-anim')},650);
    });
    header.insertBefore(btn,header.querySelector('.burger'));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',build); else build();
})();