const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const lb=document.getElementById('lightbox'),lbi=document.getElementById('lightbox-img');
document.querySelectorAll('[data-photo]').forEach(el=>el.addEventListener('click',()=>{lbi.src=el.dataset.photo;lb.style.display='flex';document.body.style.overflow='hidden'}));
function closeLb(){lb.style.display='none';document.body.style.overflow=''}
document.getElementById('close').addEventListener('click',closeLb);lb.addEventListener('click',e=>{if(e.target===lb)closeLb()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLb()});
const dot=document.getElementById('cursor');window.addEventListener('pointermove',e=>{dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px'});

// Venn: full viewBox with outer labels on wide screens, a tight numbers-only one on phones.
document.querySelectorAll('[data-vb-full]').forEach(svg=>{
 const mq=matchMedia('(max-width:700px)'),set=()=>svg.setAttribute('viewBox',mq.matches?svg.dataset.vbCompact:svg.dataset.vbFull);
 mq.addEventListener('change',set);set();
});

// Highlight groups (the story, "How I work"): the step nearest the middle of the screen is lit.
// In the story, the pinned photo crossfades to match it.
document.querySelectorAll('[data-highlight]').forEach(group=>{
 const steps=[...group.querySelectorAll('[data-step]')],imgs=[...group.querySelectorAll('[data-story-img]')],num=group.querySelector('[data-story-num]');
 const media=group.querySelector('.story-media,.venn'),mobile=matchMedia('(max-width:700px)');
 let current=-1;
 function pick(){
  // On phones the story photo (or Venn) pins above the text, so aim for the middle of the space left below it.
  const mid=media&&mobile.matches?(media.getBoundingClientRect().bottom+innerHeight)/2:innerHeight*.55;let best=0,dist=Infinity;
  steps.forEach((el,i)=>{const r=el.getBoundingClientRect(),d=Math.abs(r.top+r.height/2-mid);if(d<dist){dist=d;best=i}});
  if(best===current)return;current=best;
  steps.forEach((el,i)=>el.classList.toggle('active',i===best));imgs.forEach((el,i)=>el.classList.toggle('active',i===best));
  if(num)num.textContent=String(best+1).padStart(2,'0');
 }
 addEventListener('scroll',pick,{passive:true});addEventListener('resize',pick);pick();
});

// Polaroids: each photo lifts off a small pile into a big spotlight in the middle, then slides into
// a fanned hand of cards as the next one comes up. At the end the whole hand is fanned out.
document.querySelectorAll('[data-fan]').forEach(wrap=>{
 const stage=wrap.querySelector('.fan-stage'),head=wrap.querySelector('.section-head'),note=wrap.querySelector('.gallery-note');
 const cards=[...wrap.querySelectorAll('[data-fan-card]')],n=cards.length;
 const still=matchMedia('(prefers-reduced-motion: reduce)').matches,mobile=matchMedia('(max-width:700px)');
 const clamp=v=>Math.min(1,Math.max(0,v)),ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
 const lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,r:a.r+(b.r-a.r)*t,s:a.s+(b.s-a.s)*t});
 let pile,spot,hand;
 function layout(){
  const W=stage.clientWidth,H=stage.clientHeight,m=mobile.matches;
  // The spotlight card is about two thirds of the screen tall (width*1.25 plus the polaroid frame).
  const cw=Math.min(W*(m?.78:.42),(H*(m?.58:.66)-40)/1.25);
  cards.forEach(c=>c.style.width=cw+'px');
  pile=cards.map((_,i)=>({x:W*(m?.3:.4),y:H*(m?.34:.3),r:6+i*3,s:m?.32:.38}));
  spot={x:0,y:H*(m?.08:.05),r:0,s:1};
  const hs=m?.46:.6,gap=Math.min((W*.94-cw*hs)/Math.max(1,n-1),cw*.75);
  hand=cards.map((_,i)=>{const o=i-(n-1)/2;return{x:o*gap,y:H*(m?.12:.1)+o*o*(m?4:9),r:o*(m?7:5),s:hs}});
  update();
 }
 function update(){
  const r=wrap.getBoundingClientRect(),p=still?1:clamp(-r.top/(r.height-innerHeight)),seg=1/(n+1);
  let top=-1;
  cards.forEach((c,i)=>{
   const tin=ease(clamp((p-i*seg)/(seg*.6))),tout=ease(clamp((p-(i+1)*seg)/(seg*.6)));
   const st=tout>0?lerp(spot,hand[i],tout):lerp(pile[i],spot,tin);
   if(tin>0&&tout<1)top=i;
   c.style.translate=`calc(-50% + ${st.x.toFixed(1)}px) calc(-50% + ${st.y.toFixed(1)}px)`;
   c.style.rotate=st.r.toFixed(2)+'deg';c.style.scale=st.s.toFixed(3);
   c.style.zIndex=tout>0?10+i:tin>0?30+i:20-i;
   c.classList.toggle('in-spot',tin>.95&&tout<.05);
  });
  if(top>=0)cards[top].style.zIndex=50;
  // On phones the heading steps aside while photos are in the spotlight and comes back for the final fan.
  const end=clamp((p-n*seg)/(seg*.5));
  if(head)head.style.opacity=mobile.matches?Math.max(1-clamp(p/seg*2),end).toFixed(2):'';
  if(note)note.style.opacity=end.toFixed(2);
 }
 addEventListener('scroll',update,{passive:true});addEventListener('resize',layout);layout();
});

// Scroll-driven parallax, in the style of Apple product pages.
// Uses the individual `translate`/`scale` properties so they compose with existing CSS transforms and animations.
(()=>{
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const clamp=v=>Math.min(1,Math.max(0,v));
const parallax=[...document.querySelectorAll('[data-parallax]')],scaleIn=[...document.querySelectorAll('[data-scale-in]')],zoomOut=[...document.querySelectorAll('[data-zoom-out]')];
const heroFade=document.querySelector('[data-hero-fade]'),heroZoom=document.querySelector('[data-hero-zoom]');
const scrub=[...document.querySelectorAll('[data-scrub-words]')];
const scenesEl=document.querySelector('[data-scenes]'),scenes=[...document.querySelectorAll('[data-scene]')];
// Wrap each word of the quote in a span, keeping inline markup like <em>.
scrub.forEach(el=>{const walk=n=>[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t))f.append(t);else{const s=document.createElement('span');s.className='w';s.textContent=t;f.append(s)}});c.replaceWith(f)}else walk(c)});walk(el);el._words=[...el.querySelectorAll('.w')]});
const all=[...new Set([...parallax,...scaleIn,...zoomOut,...scrub])];
// Cache natural positions with effects cleared, so measurements don't feed back into themselves.
function measure(){all.forEach(el=>{el.style.translate='';el.style.scale=''});all.forEach(el=>{const r=el.getBoundingClientRect();el._top=r.top+scrollY;el._h=r.height});if(scenesEl)scenesEl._top=scenesEl.getBoundingClientRect().top+scrollY;update()}
function update(){
 const y=scrollY,vh=innerHeight;
 parallax.forEach(el=>{const c=el._top+el._h/2-y-vh/2;el.style.translate=`0 ${(c*+el.dataset.parallax).toFixed(1)}px`});
 const hp=clamp(y/(vh*.75));
 if(heroFade)heroFade.style.opacity=(1-hp*1.15).toFixed(3);
 if(heroZoom)heroZoom.style.scale=(1+hp*.18).toFixed(4);
 scaleIn.forEach(el=>{const p=clamp((y+vh-el._top)/(vh*.6));el.style.scale=(.88+.12*p).toFixed(4)});
 zoomOut.forEach(el=>{const p=clamp((y+vh-el._top)/(vh+el._h));el.style.scale=(1.22-.22*p).toFixed(4)});
 // Scenes stack like cards: each zooms out while entering, then sinks and dims as the next one covers it.
 scenes.forEach((el,i)=>{const start=scenesEl._top+i*vh,enter=clamp((y-start+vh)/vh),cover=i<scenes.length-1?clamp((y-start)/vh):0;
  el.firstElementChild.style.scale=(1.25-.25*enter).toFixed(4);el.style.scale=(1-.08*cover).toFixed(4);el.style.filter=cover?`brightness(${(1-.55*cover).toFixed(3)})`:'';
  const copy=el.querySelector('.scene-copy'),cp=clamp((enter-.45)/.4);copy.style.opacity=cp.toFixed(3);copy.style.translate=`0 ${((1-cp)*40).toFixed(1)}px`});
 scrub.forEach(el=>{const p=clamp((y+vh*.8-el._top)/(el._h+vh*.35)),n=Math.round(p*el._words.length);el._words.forEach((w,i)=>w.classList.toggle('on',i<n))});
}
let ticking=false;
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{update();ticking=false})}},{passive:true});
addEventListener('resize',measure);addEventListener('load',measure);measure();
// Lazy images change the layout as they arrive, so re-measure (debounced) after each one loads.
let mt;document.querySelectorAll('img[loading=lazy]').forEach(i=>i.addEventListener('load',()=>{clearTimeout(mt);mt=setTimeout(measure,120)}));
})();
