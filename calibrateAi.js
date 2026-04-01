
/* ══════════════════════════════════════════
   HERO SCROLL-OVER TRANSITION
   Key: about-section has margin-top:-100vh
   so it starts exactly behind the hero.
   Hero is sticky inside a 170vh wrapper.
   We animate hero scale+opacity+borderRadius
   as user scrolls through the 70vh runway.
══════════════════════════════════════════ */
(function(){
  const wrap  = document.getElementById('heroWrap');
  const hero  = document.getElementById('heroSec');
  if(!wrap || !hero) return;
  function mob(){ return window.innerWidth <= 1024; }
  function tick(){
    if(mob()){ hero.style.cssText=''; return; }
    const top    = wrap.getBoundingClientRect().top;
    const runway = wrap.offsetHeight - window.innerHeight; // ≈ 70vh
    const gone   = Math.max(0, -top);
    const p      = Math.min(1, gone / runway);
    // smoothstep
    const s = p*p*(3-2*p);
    hero.style.transform    = `scale(${1 - s*0.08})`;
    hero.style.opacity      = 1 - s*0.65;
    hero.style.borderRadius = `${s*22}px`;
  }
  window.addEventListener('scroll', tick, {passive:true});
  window.addEventListener('resize', ()=>{ if(mob()) hero.style.cssText=''; else tick(); },{passive:true});
  tick();
})();

/* ══════════════════════════════════════════
   NAV — transparent while hero visible
══════════════════════════════════════════ */
(function(){
  const nav  = document.getElementById('nav');
  const wrap = document.getElementById('heroWrap');
  function upd(){
    // Go solid when about-section edge enters viewport
    const below = wrap.getBoundingClientRect().bottom;
    nav.classList.toggle('solid', below < 80 || window.scrollY > window.innerHeight * 0.85);
  }
  window.addEventListener('scroll', upd,{passive:true});
  upd();
})();

/* HAMBURGER */
const ham=document.getElementById('ham'),mob2=document.getElementById('mob');
ham.addEventListener('click',()=>{ham.classList.toggle('open');mob2.classList.toggle('open');});
mob2.querySelectorAll('a,button').forEach(el=>el.addEventListener('click',()=>{ham.classList.remove('open');mob2.classList.remove('open');}));

/* TYPING */
const prompts=["Create a SaaS dashboard with auth...","Build a portfolio with animations...","Generate an AI chatbot landing page...","Design a pitch deck site..."];
const ta=document.getElementById('aiPrompt');
let pi=0,ci=0,del=false,anim=true,tmr;
function type(){
  if(!anim) return;
  const txt=prompts[pi];
  if(!del){ta.value=txt.slice(0,++ci);if(ci===txt.length){del=true;tmr=setTimeout(type,1500);return;}}
  else{ta.value=txt.slice(0,--ci);if(!ci){del=false;pi=(pi+1)%prompts.length;}}
  tmr=setTimeout(type,del?36:70);
}
type();
ta.addEventListener('focus',()=>{anim=false;clearTimeout(tmr);ta.value='';});
ta.addEventListener('blur',()=>{if(!ta.value.trim()){anim=true;type();}});
document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{anim=false;clearTimeout(tmr);ta.value=c.textContent+' — ';ta.focus();}));

/* SCROLL REVEAL */
const rio=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');rio.unobserve(e.target);}}),{threshold:.1,rootMargin:'0px 0px -36px 0px'});
document.querySelectorAll('.reveal').forEach(el=>rio.observe(el));

/* ══════════════════════════════════════════
   FEATURE CARDS STACKING
══════════════════════════════════════════ */
(function(){
  const wrap  = document.getElementById('featWrap');
  const cards = [document.getElementById('fCard0'),document.getElementById('fCard1'),document.getElementById('fCard2')];
  const dots  = document.querySelectorAll('#featDots .feat-dot');
  const N     = 3;
  function mob(){ return window.innerWidth<=1024; }
  function init(){
    if(mob()){ cards.forEach(c=>{c.style.transform=c.style.opacity=c.style.zIndex='';}); return; }
    cards.forEach((c,i)=>{
      c.style.zIndex=i+1;
      c.style.transition='transform .6s cubic-bezier(.22,1,.36,1), opacity .6s ease';
      if(i===0){c.style.transform='translateY(0) scale(1)';c.style.opacity='1';}
      else{c.style.transform='translateY(105%) scale(0.96)';c.style.opacity='0';}
    });
  }
  function upd(){
    if(mob()) return;
    const r=wrap.getBoundingClientRect();
    const vh=window.innerHeight;
    const scrollable=wrap.offsetHeight-vh;
    const gone=Math.max(0,-r.top);
    const rawP=Math.min(N-1,(gone/scrollable)*(N-1));
    const ai=Math.min(Math.floor(rawP),N-2);
    const lp=rawP-ai;
    const ep=lp*lp*(3-2*lp);
    cards.forEach((card,i)=>{
      if(i<ai){
        const d=ai-i;
        card.style.transform=`translateY(0) scale(${Math.max(.88,1-d*.04)})`;
        card.style.opacity=String(Math.max(.25,1-d*.28));
        card.style.zIndex=String(i+1);
      } else if(i===ai){
        card.style.transform=`translateY(0) scale(${1-ep*.04})`;
        card.style.opacity=String(1-ep*.18);
        card.style.zIndex=String(i+1);
      } else if(i===ai+1){
        card.style.transform=`translateY(${(1-ep)*105}%) scale(${.96+ep*.04})`;
        card.style.opacity=String(ep);
        card.style.zIndex=String(i+1);
      } else {
        card.style.transform='translateY(105%) scale(0.96)';
        card.style.opacity='0';
        card.style.zIndex=String(i+1);
      }
    });
    const vis=rawP>=N-1?N-1:ai;
    dots.forEach((d,i)=>d.classList.toggle('on',i===vis));
  }
  init();
  window.addEventListener('scroll',upd,{passive:true});
  window.addEventListener('resize',()=>{init();upd();},{passive:true});
  upd();
})();

/* ══════════════════════════════════════════
   HOW IT WORKS — scroll sync right image
══════════════════════════════════════════ */
(function(){
  const section = document.getElementById('how-it-works');
  const steps   = document.querySelectorAll('.hiw-step');
  const images  = document.querySelectorAll('.hiw-img-item');

  function update(){
    if(window.innerWidth <= 1024) return;

    const rect = section.getBoundingClientRect();
    const totalScroll = section.offsetHeight - window.innerHeight;
    const scrollY = Math.max(0, -rect.top);

    let progress = scrollY / totalScroll;
    progress = Math.min(progress, 1);

    const stepIndex = Math.min(steps.length - 1, Math.floor(progress * steps.length));

    steps.forEach((step,i)=>{
      step.classList.toggle('active', i === stepIndex);
    });

    images.forEach((img,i)=>{
      img.classList.toggle('active', i === stepIndex);
    });
  }

  window.addEventListener('scroll', update, { passive:true });
  update();
})();

/* ══════════════════════════════════════════
   TESTIMONIAL CARDS STACKING
══════════════════════════════════════════ */
(function(){
  const wrap  = document.getElementById('testWrap');

  if (!wrap) return;

  const cards = [
    document.getElementById('tCard0'),
    document.getElementById('tCard1'),
    document.getElementById('tCard2')
  ].filter(Boolean); 

  const dots  = document.querySelectorAll('#testDots .test-dot');
  const N     = cards.length;

  function mob(){ return window.innerWidth<=1024; }

  function init(){
    if(mob()){
      cards.forEach(c=>{
        if (!c) return;
        c.style.transform = '';
        c.style.opacity = '';
        c.style.zIndex = '';
      });
      return;
    }

    cards.forEach((c,i)=>{
      if (!c) return;

      c.style.zIndex = i+1;
      c.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1), opacity .6s ease';

      if(i===0){
        c.style.transform='translateY(0) scale(1)';
        c.style.opacity='1';
      } else {
        c.style.transform='translateY(105%) scale(0.96)';
        c.style.opacity='0';
      }
    });
  }

  function upd(){
    if(mob()) return;

    const r = wrap.getBoundingClientRect();
    const vh = window.innerHeight;
    const scrollable = wrap.offsetHeight - vh;
    const gone = Math.max(0, -r.top);

    const rawP = Math.min(N-1, (gone/scrollable)*(N-1));
    const ai = Math.min(Math.floor(rawP), N-2);
    const lp = rawP - ai;
    const ep = lp*lp*(3-2*lp);

    cards.forEach((card,i)=>{
      if (!card) return;

      if(i<ai){
        const d=ai-i;
        card.style.transform=`translateY(0) scale(${Math.max(.88,1-d*.04)})`;
        card.style.opacity=String(Math.max(.25,1-d*.28));
      } 
      else if(i===ai){
        card.style.transform=`translateY(0) scale(${1-ep*.04})`;
        card.style.opacity=String(1-ep*.18);
      } 
      else if(i===ai+1){
        card.style.transform=`translateY(${(1-ep)*105}%) scale(${.96+ep*.04})`;
        card.style.opacity=String(ep);
      } 
      else {
        card.style.transform='translateY(105%) scale(0.96)';
        card.style.opacity='0';
      }

      card.style.zIndex = String(i+1);
    });

    const vis = rawP>=N-1 ? N-1 : ai;
    dots.forEach((d,i)=>d.classList.toggle('on',i===vis));
  }

  init();
  window.addEventListener('scroll',upd,{passive:true});
  window.addEventListener('resize',()=>{init();upd();},{passive:true});
  upd();
})();

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".faq-q").forEach(q => {
    q.addEventListener("click", () => {
      q.parentElement.classList.toggle("open");
    });
  });
});



/* STATS COUNT-UP */
(function(){
  let fired=false;
  function run(){
    if(fired) return; fired=true;
    document.querySelectorAll('.acount').forEach(el=>{
      const tgt=+el.dataset.t,dur=1800,t0=performance.now();
      (function tick(now){
        const p=Math.min((now-t0)/dur,1);
        const ease=1-Math.pow(1-p,3);
        const v=Math.round(ease*tgt);
        el.textContent=v>=1000?v.toLocaleString():v;
        if(p<1) requestAnimationFrame(tick);
        else el.textContent=tgt>=1000?tgt.toLocaleString():tgt;
      })(t0);
    });
  }
  const sio=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in-view');run();}
  }),{threshold:.4});
  document.querySelectorAll('.about-stat').forEach(s=>sio.observe(s));
})();
