'use strict';
const $ = (s, r=document) => r.querySelector(s), $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduced && 'IntersectionObserver' in window) {
 document.documentElement.classList.add('js-motion');
 const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});
 $$('.reveal').forEach(el=>observer.observe(el));
}
let scrollQueued=false;
window.addEventListener('scroll',()=>{if(!scrollQueued){requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;$('.scroll-progress').style.width=(max>0?scrollY/max*100:0)+'%';scrollQueued=false});scrollQueued=true}},{passive:true});
const menu=$('.menu-toggle'),nav=$('.site-header nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('open',open)});
$$('a',nav).forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}});
const sports={
 muay:{image:'assets/muay.webp',alt:'Atleta de Muay Thai pratica chute com aparadores.',name:'Muay Thai',word:'MUAY<br>THAI',title:'A arte de superar seus limites.',description:'Socos, chutes, joelhadas e cotoveladas. Desenvolva técnica, coordenação e condicionamento, um treino de cada vez.',tags:['TÉCNICA','CONDICIONAMENTO','CONFIANÇA']},
 jiu:{image:'assets/jiu.webp',alt:'Dois praticantes de jiu-jitsu treinam guarda no tatame.',name:'Jiu-jitsu',word:'JIU<br>JITSU',title:'Estratégia em cada movimento.',description:'Posicionamento, controle e finalizações. Descubra uma prática em que técnica, paciência e constância caminham juntas.',tags:['ESTRATÉGIA','CONTROLE','TÉCNICA']},
 boxe:{image:'assets/boxe.webp',alt:'Boxeadora com luvas treina com o professor nas manoplas.',name:'Boxe',word:'BO<br>XE',title:'Foco, ritmo e precisão.',description:'Trabalhe golpes, esquivas e movimentação. Encontre seu ritmo e desenvolva coordenação e condicionamento dentro do treino.',tags:['PRECISÃO','AGILIDADE','FOCO']},
 cross:{image:'assets/cross.webp',alt:'Atleta de Cross Training trabalha com cordas navais.',name:'Cross Training',word:'CROSS<br>TRAINING',title:'Prepare o corpo para ir além.',description:'Movimentos variados para trabalhar força, resistência e condicionamento. Mais possibilidades para colocar seu corpo em movimento.',tags:['FORÇA','RESISTÊNCIA','ENERGIA']},
 mobility:{image:'assets/mobility.webp',alt:'Atleta trabalha a mobilidade do quadril em um avanço ajoelhado.',name:'Mobility Fight',word:'MOBILITY<br>FIGHT',title:'Liberdade para se movimentar.',description:'Explore mobilidade e controle corporal. Conheça uma prática voltada a ampliar suas possibilidades de movimento.',tags:['MOBILIDADE','CONTROLE','MOVIMENTO']},
 gin:{image:'assets/gin.webp',alt:'Praticante de Gin Natural se desloca em quatro apoios no tatame.',name:'Gin Natural',word:'GIN<br>NATURAL',title:'Seu corpo é o ponto de partida.',description:'Movimentos integrados com o peso do próprio corpo. Explore coordenação, mobilidade e consciência corporal.',tags:['COORDENAÇÃO','FLUIDEZ','CONSCIÊNCIA']}
};
let currentSport='muay';
const panel=$('#discipline-panel'),tabs=$$('.discipline');
function setSport(key,focus=false){currentSport=key;const sport=sports[key];const photo=$('.panel-image img',panel);photo.alt=sport.alt;photo.src=sport.image;tabs.forEach(tab=>{const active=tab.dataset.sport===key;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus()});panel.setAttribute('aria-labelledby','tab-'+key);$('.panel-word',panel).innerHTML=sport.word;$('h3',panel).textContent=sport.title;$('.panel-content p',panel).textContent=sport.description;$('.panel-tags',panel).replaceChildren(...sport.tags.map(t=>{const span=document.createElement('span');span.textContent=t;return span}));$('[data-current-sport]',panel).innerHTML='QUERO CONHECER '+sport.name.toLocaleUpperCase('pt-BR')+' <span>↗</span>';panel.classList.remove('panel-changing');void panel.offsetWidth;panel.classList.add('panel-changing')}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>setSport(tab.dataset.sport));tab.addEventListener('keydown',e=>{let next=index;if(e.key==='ArrowDown'||e.key==='ArrowRight')next=(index+1)%tabs.length;else if(e.key==='ArrowUp'||e.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();setSport(tabs[next].dataset.sport,true)})});
function waUrl(message){return 'https://wa.me/5511989420759?text='+encodeURIComponent(message)}
const book=$('#book-dialog'),dialogSport=$('#dialog-sport');
function updateBookLink(){$('#dialog-whatsapp').href=waUrl('Olá! Vim pelo site do CT Hórus Fight e quero agendar minha primeira aula. Meu interesse é: '+dialogSport.value+'. Podem me informar horários, valores e disponibilidade?')}
$$('[data-book]').forEach(btn=>btn.addEventListener('click',()=>{dialogSport.value=btn.hasAttribute('data-current-sport')?sports[currentSport].name:$('#sport-select').value;updateBookLink();book.showModal();document.body.classList.add('modal-open')}));
dialogSport.addEventListener('change',updateBookLink);
$$('dialog').forEach(dialog=>{const close=()=>{dialog.close();document.body.classList.remove('modal-open')};$('.dialog-close',dialog).addEventListener('click',close);dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}});dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'))});
$('#start-form').addEventListener('submit',e=>{e.preventDefault();const message='Olá! Vim pelo site do CT Hórus Fight. Tenho interesse em '+$('#sport-select').value+'. '+$('#level-select').value+'. Quero conhecer os horários, valores e agendar minha primeira aula.';window.open(waUrl(message),'_blank','noopener,noreferrer')});
const gallery=$('#image-dialog');$$('[data-image]').forEach(btn=>btn.addEventListener('click',()=>{$('img',gallery).src=btn.dataset.image;gallery.showModal();document.body.classList.add('modal-open')}));
$$('.faq details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)$$('.faq details').forEach(other=>{if(other!==detail)other.open=false})}));
$('#year').textContent=String(new Date().getFullYear());


$$('.site-header nav a').forEach(link=>link.addEventListener('click',()=>{$$('.site-header nav a').forEach(other=>other.classList.toggle('active',other===link))}));
