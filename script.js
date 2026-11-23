const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

// pecah headline jadi huruf untuk animasi
let idx=0;
document.querySelectorAll('[data-split]').forEach(el=>{
  const t=el.textContent;el.textContent='';el.setAttribute('aria-hidden','true');
  [...t].forEach(c=>{const s=document.createElement('span');s.className='ch';s.style.setProperty('--i',idx++);s.textContent=c;el.appendChild(s)});
});

// efek ketik
const roles=['3D Designer','UI Designer','Arduino Maker','Web Developer'];
const typed=document.getElementById('typed');
let ri=0,ci=0,del=false;
function type(){
  const w=roles[ri];
  typed.textContent=w.slice(0,ci);
  if(!del&&ci===w.length){del=true;return setTimeout(type,1400)}
  if(del&&ci===0){del=false;ri=(ri+1)%roles.length}
  ci+=del?-1:1;
  setTimeout(type,del?45:90);
}
reduce?typed.textContent=roles[0]:setTimeout(type,1800);

// parallax hero mengikuti mouse
const stage=document.getElementById('stage');
if(!reduce){
  stage.addEventListener('mousemove',e=>{
    const r=stage.getBoundingClientRect();
    stage.style.setProperty('--px',((e.clientX-r.left)/r.width-.5)*2);
    stage.style.setProperty('--py',((e.clientY-r.top)/r.height-.5)*2);
  });
  stage.addEventListener('mouseleave',()=>{stage.style.setProperty('--px',0);stage.style.setProperty('--py',0)});
}

// header: shadow saat scroll, progress bar, link aktif
const header=document.querySelector('.header'),bar=document.getElementById('progress');
const links=[...document.querySelectorAll('.header nav a')];
addEventListener('scroll',()=>{
  header.classList.toggle('scrolled',scrollY>40);
  const h=document.documentElement;
  bar.style.transform='scaleX('+scrollY/(h.scrollHeight-innerHeight)+')';
},{passive:true});
const secs=links.map(a=>document.querySelector(a.getAttribute('href')));
const spy=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));
}),{rootMargin:'-45% 0px -50% 0px'});
secs.forEach(s=>s&&spy.observe(s));

// scroll reveal (berurutan per grup)
document.querySelectorAll('.grid,.stats').forEach(g=>[...g.children].forEach((c,i)=>c.style.setProperty('--r',i)));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// hitung angka
const co=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;co.unobserve(e.target);
  const el=e.target,end=+el.dataset.count,suf=el.hasAttribute('data-plus')?'+':'';
  let n=0;const t=setInterval(()=>{n++;el.textContent=n+(n===end?suf:'');if(n>=end)clearInterval(t)},180);
}),{threshold:.6});
document.querySelectorAll('[data-count]').forEach(el=>co.observe(el));

// marquee tanpa putus
const track=document.getElementById('track');
track.innerHTML+=track.innerHTML;

// kartu: spotlight + tilt 3D
document.querySelectorAll('.card').forEach(c=>{
  c.addEventListener('mousemove',e=>{
    const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',y*100+'%');
    if(!reduce){c.style.setProperty('--ry',(x-.5)*10+'deg');c.style.setProperty('--rx',(.5-y)*10+'deg')}
  });
  c.addEventListener('mouseleave',()=>{c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')});
});

// tombol magnetik
document.querySelectorAll('.magnetic').forEach(b=>{
  b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.2}px,${(e.clientY-r.top-r.height/2)*.3}px)`});
  b.addEventListener('mouseleave',()=>b.style.transform='');
});

// lightbox gambar projek
const lb=document.createElement('div');lb.className='lightbox';lb.setAttribute('role','dialog');lb.setAttribute('aria-label','Pratinjau gambar');lb.innerHTML='<img alt="">';document.body.appendChild(lb);
const lbImg=lb.querySelector('img');
document.querySelectorAll('.thumb').forEach(t=>t.addEventListener('click',()=>{lbImg.src=t.dataset.full;lbImg.alt=t.querySelector('img').alt;lb.classList.add('open');document.body.style.overflow='hidden'}));
const closeLb=()=>{lb.classList.remove('open');document.body.style.overflow=''};
lb.addEventListener('click',closeLb);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLb()});

document.getElementById('year').textContent=new Date().getFullYear();
