(()=>{'use strict';
if(window.top!==window.self||document.getElementById('eur-exam-companion-root'))return;
const host=document.createElement('div');
host.id='eur-exam-companion-root';
host.style.cssText='all:initial;position:fixed;top:12px;right:12px;z-index:2147483647;pointer-events:auto';
const shadow=host.attachShadow({mode:'closed'});
const style=document.createElement('style');
style.textContent=`
:host{all:initial}*,*:before,*:after{box-sizing:border-box}
.wrap{font-family:Arial,Helvetica,sans-serif;color:#002328;font-size:14px;line-height:1.45}
button{font:600 14px Arial,Helvetica,sans-serif;cursor:pointer;border:1px solid #b8d2c9;border-radius:9px;padding:9px 12px;background:#f2f7f5;color:#002328}
button:focus-visible{outline:3px solid #ffb900;outline-offset:2px}
#toggle{background:#0c8066;color:white;border-color:#0c8066;box-shadow:0 3px 12px #0004}
#panel{position:absolute;top:46px;right:0;width:300px;max-width:calc(100vw - 24px);padding:16px;background:white;color:#002328;border:1px solid #b8d2c9;border-radius:14px;box-shadow:0 10px 32px #0005}
#panel[hidden]{display:none}.battery{margin:10px 0;padding:9px;border-radius:9px;background:#edf5f2}.battery.low{background:#fff3d9;border:1px solid #a86600}.battery.critical{background:#fff0f0;border:2px solid #a32032}.battery-note{display:block;font-weight:600;margin-top:4px}.launcher-battery[hidden]{display:none!important}.launcher-battery{display:inline-flex;align-items:center;justify-content:center;margin-right:8px;padding:8px 10px;border-radius:9px;background:#edf5f2;color:#002328;font-weight:700;white-space:nowrap}.launcher-battery.low{background:#fff3d9;color:#703e00}.launcher-battery.critical{background:#fff0f0;color:#9f2637}.battery-badge{display:inline-block;margin-left:6px;border-radius:5px;padding:1px 5px;background:#fff3d9;color:#703e00}.battery-badge.critical{background:#fff0f0;color:#9f2637}.companion-version{font-size:11px;color:#64766f;text-align:right;margin:12px 0 0}h2{font-size:17px;margin:0 0 12px}p{margin:10px 0;overflow-wrap:anywhere}
.actions{display:flex;gap:8px;flex-wrap:wrap}.danger{background:#9f2637;color:white;border-color:#9f2637}.warning{border:2px solid #9f2637;border-radius:10px;padding:10px;background:#fff4f4}.hint{padding:10px;background:#edf5f2;border-radius:9px}
`;
shadow.append(style);
const wrap=document.createElement('div');wrap.className='wrap';
const toggle=document.createElement('button');toggle.id='toggle';toggle.type='button';toggle.textContent='⚙ Tools';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','panel');
const panel=document.createElement('section');panel.id='panel';panel.hidden=true;panel.setAttribute('role','region');panel.setAttribute('aria-label','EUR Exam Companion');
const launcherBattery=document.createElement('span');launcherBattery.className='launcher-battery';launcherBattery.hidden=true;launcherBattery.setAttribute('role','status');
wrap.append(launcherBattery,toggle,panel);shadow.append(wrap);
let lang='nl';
let batteryState=null; // null = not yet read, unavailable = unsupported or denied
let batteryManager=null;
let view='menu';
const words={
nl:{title:'EUR Exam Companion',language:'English',close:'Menu verbergen',exit:'Examen sluiten',warningTitle:'Examen verlaten?',warning:'WAARSCHUWING: Als je het examen verlaat, kunnen alle niet-opgeslagen antwoorden en je examenvoortgang verloren gaan. Mogelijk kun je het examen niet hervatten. Verlaat het examen alleen op instructie van de surveillant.',cancel:'Annuleren',confirmExit:'Examen verlaten',date:'Datum',time:'Lokale tijd',site:'Website',help:'Technische problemen? Meld deze direct bij de surveillant.',battery:'Batterij',charging:'Opladen',notCharging:'Niet aan het opladen',batteryUnavailable:'Batterijstatus niet beschikbaar in deze browsercontext.',batteryLow:'Batterij bijna leeg. Sluit de Chromebook aan op de oplader.',batteryCritical:'Batterij kritiek laag! Sluit de Chromebook onmiddellijk aan op de oplader.'},
en:{title:'EUR Exam Companion',language:'Nederlands',close:'Hide menu',exit:'Exit examination',warningTitle:'Leave examination?',warning:'WARNING: Leaving the examination may result in the loss of all unsaved answers and examination progress. You may not be able to resume. Only leave when instructed by the invigilator.',cancel:'Cancel',confirmExit:'Leave examination',date:'Date',time:'Local time',site:'Website',help:'Technical issue? Report it directly to the invigilator.',battery:'Battery',charging:'Charging',notCharging:'Not charging',batteryUnavailable:'Battery status is unavailable in this browser context.',batteryLow:'Battery low. Connect the Chromebook to a charger.',batteryCritical:'Battery critically low! Connect the Chromebook to a charger immediately.'}
};
const launcherUrl='https://yonathan007.github.io/EUR-Exam-Launcher/';
const onLauncher=location.origin==='https://yonathan007.github.io'&&location.pathname.startsWith('/EUR-Exam-Launcher/');
const node=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;};
function close(){panel.hidden=true;toggle.setAttribute('aria-expanded','false');}
function render(){
 view='menu';panel.replaceChildren();const t=words[lang];
 panel.append(node('h2','',t.title));
 const actions=node('div','actions'),switcher=node('button','',t.language),dismiss=node('button','',t.close);
 switcher.type=dismiss.type='button';switcher.addEventListener('click',()=>{lang=lang==='nl'?'en':'nl';render();});
 dismiss.addEventListener('click',close);actions.append(switcher,dismiss);panel.append(actions);
 if(!onLauncher){const exit=node('button','danger',t.exit);exit.type='button';exit.addEventListener('click',()=>showWarning());panel.append(node('p','', ''));panel.append(exit);}
 renderBattery(panel);
 const now=new Date(), locale=lang==='nl'?'nl-NL':'en-GB';
 panel.append(node('p','',t.date+': '+now.toLocaleDateString(locale,{weekday:'long',day:'numeric',month:'long',year:'numeric'})));
 panel.append(node('p','',t.time+': '+now.toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit'})));
 panel.append(node('p','',t.site+': '+(location.hostname||'local file')));
 panel.append(node('p','hint',t.help));
 panel.append(node('p','companion-version','v0.3.0'));
}
function showWarning(){
 view='exit';const t=words[lang];panel.replaceChildren();panel.append(node('h2','',t.warningTitle));
 const warning=node('p','warning',t.warning);warning.setAttribute('role','alert');panel.append(warning);
 const actions=node('div','actions'),cancel=node('button','',t.cancel),confirm=node('button','danger',t.confirmExit);
 cancel.type=confirm.type='button';cancel.addEventListener('click',render);confirm.addEventListener('click',()=>{window.location.assign(launcherUrl);});
 actions.append(cancel,confirm);panel.append(actions);cancel.focus();
}

function renderBattery(container){
 const t=words[lang];
 const block=node('div','battery');
 if(!batteryState||batteryState.unavailable){
  block.textContent=t.battery+': '+t.batteryUnavailable;
 }else{
  const {percentage,charging}=batteryState;
  const level=percentage<=5?'critical':percentage<=15?'low':'normal';
  block.classList.add(level);
  block.append(node('div','',t.battery+': '+percentage+'% · '+(charging?t.charging:t.notCharging)));
  if(level!=='normal'){
   const note=node('span','battery-note',level==='critical'?t.batteryCritical:t.batteryLow);
   note.setAttribute('role','status');block.append(note);
  }
 }
 container.append(block);
}
function updateBattery(){
 if(!batteryManager)return;
 batteryState={percentage:Math.round(batteryManager.level*100),charging:batteryManager.charging};
 const percentage=batteryState.percentage;
 const level=percentage<=5?'critical':percentage<=15?'low':'normal';
 const existing=toggle.querySelector('.battery-badge');if(existing)existing.remove();
 if(onLauncher){
  launcherBattery.hidden=false;
  launcherBattery.className='launcher-battery'+(level==='normal'?'':' '+level);
  launcherBattery.textContent=(charging?'⚡ ':'▰ ')+percentage+'%';
  launcherBattery.setAttribute('aria-label',words[lang].battery+': '+percentage+'%');
  toggle.setAttribute('aria-label','Tools');
 }else{launcherBattery.hidden=true;}
 if(!onLauncher&&level!=='normal'){
  const badge=node('span','battery-badge'+(level==='critical'?' critical':''),percentage+'%');
  toggle.append(badge);
  toggle.setAttribute('aria-label','Tools · '+words[lang].battery+' '+percentage+'%');
 }else toggle.setAttribute('aria-label','Tools');
 // Do not interrupt the exit confirmation dialog or change the exam page.
 if(view==='menu'&&!panel.hidden)render();
}
async function initBattery(){
 if(typeof navigator.getBattery!=='function'){
  batteryState={unavailable:true};launcherBattery.hidden=true;return;
 }
 try{
  batteryManager=await navigator.getBattery();
  batteryManager.addEventListener('levelchange',updateBattery);
  batteryManager.addEventListener('chargingchange',updateBattery);
  updateBattery();
 }catch(_){batteryState={unavailable:true};launcherBattery.hidden=true;}
 if(view==='menu'&&!panel.hidden)render();
}

toggle.addEventListener('click',()=>{if(panel.hidden){render();panel.hidden=false;toggle.setAttribute('aria-expanded','true');}else close();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
document.addEventListener('pointerdown',e=>{if(!host.contains(e.target))close();});
(document.body||document.documentElement).append(host);
initBattery();
})();
