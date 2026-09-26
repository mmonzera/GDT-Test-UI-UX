(() => {
 const button=document.querySelector('#theme');
 const root=document.documentElement;
 function apply(theme,persist=false){
  const dark=theme==='dark';
  root.dataset.theme=dark?'dark':'light';
  document.body.classList.toggle('dark',dark);
  button.setAttribute('aria-checked',String(dark));
  button.title=dark?'Ganti ke mode terang':'Ganti ke mode gelap';
  document.querySelector('meta[name="theme-color"]').content=dark?'#19382d':'#fff9e8';
  if(persist)try{localStorage.setItem('nusa-theme',dark?'dark':'light')}catch{}
 }
 button.addEventListener('click',()=>apply(root.dataset.theme==='dark'?'light':'dark',true));
 window.addEventListener('storage',e=>{if(e.key==='nusa-theme')apply(e.newValue==='dark'?'dark':'light')});
 apply(root.dataset.theme==='dark'?'dark':'light');
})();
