(() => {
  const root=document.documentElement, body=document.body;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const hero=document.querySelector('#hero'), scene=document.querySelector('#heroScene');
  const featured=document.querySelector('.featured'), copy=document.querySelector('.hero-copy');
  const control=document.querySelector('#motionToggle');
  let paused=media.matches, manual=false, frame=0, elapsed=0, last=0, heroVisible=true, held=false;
  let targetX=0,targetY=0, x=0,y=0,activeCard=null;
  try{manual=localStorage.getItem('nusa-motion')==='paused';paused=paused||manual}catch{}
  body.classList.add('motion-ready');
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});
  function reveal(){document.querySelectorAll('.section-head,.section-sub,.island,.game,.isle-tag,.deal-spot,.coupon,.rank,.filterbar,.free-grid,.values>div,.footer-grid>div').forEach((el,i)=>{if(el.dataset.revealReady)return;el.dataset.revealReady='true';el.classList.add('reveal');el.style.setProperty('--reveal-delay',`${el.matches('.island,.game,.coupon,.rank')?(Array.from(el.parentElement.children).indexOf(el)%6)*65:0}ms`);observer.observe(el)})}
  reveal();new MutationObserver(reveal).observe(document.querySelector('main'),{childList:true,subtree:true});
  function enter(){if(paused)return;copy.classList.remove('entering');scene.classList.remove('changing');void copy.offsetWidth;copy.classList.add('entering');scene.classList.add('changing')}
  let lastTitle=document.querySelector('#herotitle').textContent;
  new MutationObserver(()=>{const title=document.querySelector('#herotitle').textContent;if(title!==lastTitle){lastTitle=title;elapsed=0;enter()}}).observe(document.querySelector('#herotitle'),{childList:true,subtree:true});
  function update(){body.classList.toggle('motion-paused',paused);control.innerHTML=`<span aria-hidden="true">${paused?'▶':'Ⅱ'}</span> ${paused?'Aktifkan animasi':'Jeda animasi'}`;control.setAttribute('aria-pressed',String(paused));featured.classList.toggle('cycle-running',!paused);if(paused){cancelAnimationFrame(frame);frame=0;scene.style.setProperty('--mx','0px');scene.style.setProperty('--my','0px');if(activeCard)activeCard.style.transform=''}else start();}
  control.addEventListener('click',()=>{paused=!paused;manual=paused;try{localStorage.setItem('nusa-motion',paused?'paused':'active')}catch{}update()});
  media.addEventListener('change',()=>{paused=media.matches||manual;update()});
  new IntersectionObserver(([entry])=>{heroVisible=entry.isIntersecting;if(!heroVisible){last=0;cancelAnimationFrame(frame);frame=0}else start()},{threshold:0}).observe(featured);
  function start(){if(frame||paused||document.hidden||!heroVisible)return;last=0;frame=requestAnimationFrame(tick)}
  function tick(t){frame=0;if(paused||document.hidden||!heroVisible)return;const delta=last?Math.min(t-last,50):0;last=t;x+=(targetX-x)*.055;y+=(targetY-y)*.055;scene.style.setProperty('--mx',`${x.toFixed(2)}px`);scene.style.setProperty('--my',`${(y+Math.min(scrollY*.12,95)).toFixed(2)}px`);if(!held)elapsed+=delta;if(elapsed>=9000){elapsed=0;selectFeature((selected+1)%features.length)}frame=requestAnimationFrame(tick)}
  featured.addEventListener('pointermove',e=>{if(!fine.matches||paused)return;const r=featured.getBoundingClientRect();targetX=(e.clientX/r.width-.5)*-24;targetY=((e.clientY-r.top)/r.height-.5)*-15});
  featured.addEventListener('pointerleave',()=>{targetX=targetY=0});
  function hold(v){held=v;featured.classList.toggle('is-held',v)}
  document.querySelector('.featured-list').addEventListener('pointerenter',()=>hold(true));
  document.querySelector('.featured-list').addEventListener('pointerleave',()=>hold(false));
  featured.addEventListener('focusin',()=>hold(true));featured.addEventListener('focusout',e=>{if(!featured.contains(e.relatedTarget))hold(false)});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0}else start()});
  let scrollFrame=0;
  function onScroll(){if(scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;const length=document.documentElement.scrollHeight-innerHeight;root.style.setProperty('--page-progress',length>0?scrollY/length:0);document.querySelector('header').classList.toggle('scrolled',scrollY>60);const fg=document.querySelector('.free-grid');if(!paused&&fg){const r=fg.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)document.querySelector('.free-art').style.setProperty('--free-y',`${Math.max(-25,Math.min(25,(r.top-innerHeight/2)*.06))}px`)}})}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll,{passive:true});onScroll();
  let cardFrame=0,px=0,py=0;
  document.addEventListener('pointermove',e=>{if(paused||!fine.matches)return;const card=e.target.closest('.game,.island');if(activeCard&&activeCard!==card)activeCard.style.transform='';activeCard=card;if(!card)return;px=e.clientX;py=e.clientY;if(cardFrame)return;cardFrame=requestAnimationFrame(()=>{cardFrame=0;if(!activeCard)return;const r=activeCard.getBoundingClientRect();const rx=-((py-r.top)/r.height-.5)*8,ry=((px-r.left)/r.width-.5)*9;activeCard.style.transform=`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-7px)`})},{passive:true});
  document.addEventListener('pointerout',e=>{if(activeCard&&!activeCard.contains(e.relatedTarget)){activeCard.style.transform='';activeCard=null}});
  document.addEventListener('click',e=>{if(e.target.closest('[data-feature]'))elapsed=0});
  update();enter();
})();
