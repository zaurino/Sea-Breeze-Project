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
 monaco:['ЧАСТНЫЕ КЛИЕНТЫ','Личные встречи <br>в Монако.','Частные клиенты, семейные офисы и агентства премиальной недвижимости Монако.','Закрытые презентации, деловые встречи и передача запросов команде в Баку.'],
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
 document.querySelectorAll('.section>h2,.section-top,.map-layout,.profile-copy,.portrait,.collaboration-card,.footer-heading,.footer-contacts,.footer-baseline,.concert-art,.concert-copy,.concert-experience,.concert-plan').forEach(element=>{element.classList.add('reveal-ready');observer.observe(element)});
 const card=document.querySelector('.collaboration-card');new IntersectionObserver(entries=>card.classList.toggle('in-view',entries[0].isIntersecting),{threshold:.2}).observe(card);
 const map=document.querySelector('.map-visual');new IntersectionObserver(entries=>map.classList.toggle('is-visible',entries[0].isIntersecting),{threshold:.2}).observe(map);
}

const headerPhone=document.querySelector('.header-phone');
document.addEventListener('click',event=>{if(!headerPhone.contains(event.target))headerPhone.open=false});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&headerPhone.open){headerPhone.open=false;headerPhone.querySelector('summary').focus()}});
headerPhone.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{headerPhone.open=false}));

video.addEventListener('ended',()=>{document.body.classList.add('header-ready');syncTitle();syncPlay()});

// Concert scene: motion runs only while visible; the user can pause it.
const concertStage=document.querySelector('.concert-stage');
const motionButton=document.querySelector('.stage-motion');
let concertPaused=reducedMotion.matches;
function syncConcertMotion(){concertStage.classList.toggle('motion-paused',concertPaused||reducedMotion.matches);motionButton.setAttribute('aria-pressed',String(concertPaused));motionButton.textContent=concertPaused?'Включить анимацию':'Остановить анимацию';motionButton.hidden=reducedMotion.matches}
syncConcertMotion();
motionButton.addEventListener('click',()=>{concertPaused=!concertPaused;syncConcertMotion()});
reducedMotion.addEventListener('change',()=>{concertPaused=reducedMotion.matches;syncConcertMotion()});
concertStage.classList.add('stage-prepared');
new IntersectionObserver(entries=>{const visible=entries[0].isIntersecting;concertStage.classList.toggle('stage-active',visible);if(visible)concertStage.classList.add('stage-entered')},{threshold:.15}).observe(concertStage);
const concertContent={idea:['EMIN · NICE','Вечер, ради которого встречаются.','Предлагаем организовать концерт EMIN в Ницце: живая музыка и встреча с аудиторией Лазурного Берега.'],role:['ОРГАНИЗАЦИЯ НА МЕСТЕ','От первых переговоров до вечера концерта.','Заур может взять на себя переговоры с площадкой и местными партнёрами, координацию подготовки с командой артиста и работу с приглашёнными гостями.'],brand:['SEA BREEZE · EUROPE','Знакомство, которое продолжается.','Предлагаем дополнить концерт отдельной встречей для потенциальных клиентов и партнёров Sea Breeze — с личным представлением проекта и продолжением диалога.']};
const concertTabs=[...document.querySelectorAll('[data-concert]')];
function chooseConcert(key){concertTabs.forEach(t=>{const active=t.dataset.concert===key;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1});['kicker','title','text'].forEach((field,i)=>document.querySelector('#concert-'+field).textContent=concertContent[key][i]);const panel=document.querySelector('#concert-panel');panel.setAttribute('aria-labelledby','concert-tab-'+key);animate(panel)}
concertTabs.forEach(t=>t.addEventListener('click',()=>chooseConcert(t.dataset.concert)));
document.querySelector('.concert-tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();let i=concertTabs.indexOf(document.activeElement);i=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;chooseConcert(concertTabs[i].dataset.concert);concertTabs[i].focus()});

// Scroll sets the composition; no scroll interception or animation libraries.
const concertScroll=document.querySelector('.concert-scroll');
const sceneFinale=document.querySelector('.scene-finale');
let sceneFrame=0;
const clampScene=v=>Math.max(0,Math.min(1,v));
const easeScene=v=>{v=clampScene(v);return v*v*(3-2*v)};
function renderConcertScene(){sceneFrame=0;const rect=concertScroll.getBoundingClientRect();const range=Math.max(1,concertScroll.offsetHeight-concertStage.offsetHeight);const p=(reducedMotion.matches||concertPaused)?1:clampScene(-rect.top/range);const platform=easeScene((p-.12)/.4),audience=easeScene((p-.4)/.4),finale=easeScene((p-.65)/.25);const values={'--scene-p':p,'--platform-o':platform,'--audience-o':audience,'--opening-o':1-easeScene((p-.16)/.3),'--final-o':finale,'--platform-y':(1-platform)*90+'px','--audience-y':(1-audience)*120+'px','--land-scale':1.12-p*.12,'--land-y':p*-25+'px'};Object.entries(values).forEach(([k,v])=>concertScroll.style.setProperty(k,v));const stageHeight=concertStage.offsetHeight,stageWidth=concertStage.offsetWidth;const landscapeHeight=Math.max(stageHeight,stageWidth/1.5);const shoreBase=(stageHeight-landscapeHeight)/2+landscapeHeight*.758;const shore=stageHeight/2+(shoreBase-stageHeight/2)*(1.12-p*.12)-p*25;const platformHeight=document.querySelector('.scene-platform').offsetWidth/2;concertScroll.style.setProperty('--platform-top',(shore-platformHeight*.83)+'px');sceneFinale.classList.toggle('ready',finale>.1);sceneFinale.setAttribute('aria-hidden',String(finale<=.1));sceneFinale.querySelector('a').tabIndex=finale>.1?0:-1}
function queueScene(){if(!sceneFrame)sceneFrame=requestAnimationFrame(renderConcertScene)}
window.addEventListener('scroll',queueScene,{passive:true});window.addEventListener('resize',queueScene,{passive:true});motionButton.addEventListener('click',queueScene);reducedMotion.addEventListener('change',queueScene);renderConcertScene();

const openConcertProposal=document.querySelector('#open-concert-proposal');
openConcertProposal.addEventListener('click',()=>{
 concertScroll.hidden=false;
 openConcertProposal.setAttribute('aria-expanded','true');
 renderConcertScene();
 concertScroll.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'start'});
});

const eminSignature=document.querySelector('.emin-signature');
if(!reducedMotion.matches){
 eminSignature.classList.add('signature-ready');
 const signatureObserver=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){eminSignature.classList.add('signature-visible');signatureObserver.disconnect()}},{threshold:.7});
 signatureObserver.observe(eminSignature);
}
