const video=document.querySelector('#hero-video');
const title=document.querySelector('.film-title');
const play=document.querySelector('#play');
const full=document.querySelector('#full-film');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reducedMotion.matches,heroVisible=true,lastFocus=null,wasPlaying=false;
function syncTitle(){
 const opacity=Math.max(0,Math.min(1,(video.currentTime-9.8)/1.5));
 title.style.opacity=opacity;title.classList.toggle('visible',opacity>.8);
 title.setAttribute('aria-hidden',String(opacity<=.8));
 title.querySelector('a').tabIndex=opacity>.8?0:-1;
}
function syncPlay(){
 play.innerHTML=video.paused?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>';
 play.setAttribute('aria-label',video.paused?'Воспроизвести видео':'Приостановить видео');
}
function resumeHero(){if(heroVisible&&!paused&&!document.hidden&&!document.querySelector('dialog[open]'))video.play().catch(syncPlay)}
video.addEventListener('timeupdate',syncTitle);video.addEventListener('seeking',syncTitle);
video.addEventListener('play',syncPlay);video.addEventListener('pause',syncPlay);
play.onclick=()=>{paused=!video.paused;if(paused)video.pause();else resumeHero()};
if(paused){video.removeAttribute('autoplay');video.pause()}
new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;document.body.classList.toggle('in-film',heroVisible);if(!heroVisible)document.body.classList.add('header-ready');if(heroVisible)resumeHero();else video.pause()},{threshold:.15}).observe(document.querySelector('#intro'));
document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else resumeHero()});
const cities={
 milan:['КОМПАНИИ И БРЕНДЫ','Начать <br>с деловых встреч.','Интерьерные бренды, поставщики, операторы услуг — под задачи Sea Breeze.','Поиск компаний, личные встречи и сопровождение переговоров.'],
 nice:['КЛИЕНТЫ И АГЕНТСТВА','Представить проект. <br>Обсудить интерес.','Встречи с агентствами и потенциальными клиентами на Лазурном Берегу.','Презентации, работа с запросами и организация следующей встречи.'],
 baku:['КОМАНДА SEA BREEZE','Связать интерес <br>с возможностями.','Передача подготовленных запросов команде проекта.','Координация переговоров, визитов и дальнейших действий.']
};
function animate(panel){panel.classList.remove('changing');void panel.offsetWidth;panel.classList.add('changing')}
function selectCity(key){
 document.querySelectorAll('[data-city]').forEach(element=>{
  const selected=element.dataset.city===key;element.classList.toggle('selected',selected);
  if(element.getAttribute('role')==='tab'){element.setAttribute('aria-selected',String(selected));element.tabIndex=selected?0:-1}
 });
 const panel=document.querySelector('#city-panel');panel.setAttribute('aria-labelledby',key);
 ['label','title','copy','task'].forEach((field,index)=>{const element=document.querySelector('#city-'+field);if(field==='title')element.innerHTML=cities[key][index];else element.textContent=cities[key][index]});
 document.querySelector('#milan-preview').hidden=key!=='milan';
 animate(panel);
}
function openDialog(id){lastFocus=document.activeElement;wasPlaying=!video.paused;video.pause();document.querySelector(id).showModal();document.body.style.overflow='hidden'}
document.querySelectorAll('[data-city]').forEach(element=>{
 element.addEventListener('click',()=>{selectCity(element.dataset.city)});
 if(element.tagName.toLowerCase()==='g')element.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();element.dispatchEvent(new MouseEvent('click',{bubbles:true}))}});
});
document.querySelector('.city-tabs').addEventListener('keydown',event=>{
 if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
 event.preventDefault();const tabs=[...document.querySelectorAll('.city-tabs [role=tab]')];const current=tabs.indexOf(document.activeElement);
 const index=event.key==='Home'?0:event.key==='End'?tabs.length-1:(current+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
 selectCity(tabs[index].dataset.city);tabs[index].focus();
});
document.querySelector('#office-expand').onclick=()=>openDialog('#office-dialog');
document.querySelector('#expand').onclick=()=>{openDialog('#film-dialog');full.currentTime=0;full.play().catch(()=>{})};
document.querySelectorAll('dialog').forEach(dialog=>{
 dialog.querySelector('[data-close]').onclick=()=>dialog.close();
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close()});
 dialog.addEventListener('close',()=>{full.pause();document.body.style.overflow='';if(wasPlaying)resumeHero();lastFocus?.focus({preventScroll:true})});
});
selectCity('milan');syncPlay();syncTitle();
if(!reducedMotion.matches){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});
 document.querySelectorAll('.section>h2,.section-top,.map-layout,.profile-copy,.portrait,.collaboration-card,.footer-heading,.footer-contacts,.footer-baseline').forEach(element=>{element.classList.add('reveal-ready');observer.observe(element)});
 const card=document.querySelector('.collaboration-card');new IntersectionObserver(entries=>card.classList.toggle('in-view',entries[0].isIntersecting),{threshold:.2}).observe(card);
 const map=document.querySelector('.map-visual');new IntersectionObserver(entries=>map.classList.toggle('is-visible',entries[0].isIntersecting),{threshold:.2}).observe(map);
}

const headerPhone=document.querySelector('.header-phone');
document.addEventListener('click',event=>{if(!headerPhone.contains(event.target))headerPhone.open=false});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&headerPhone.open){headerPhone.open=false;headerPhone.querySelector('summary').focus()}});
headerPhone.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{headerPhone.open=false}));

video.addEventListener('ended',()=>{document.body.classList.add('header-ready');syncTitle();syncPlay()});
