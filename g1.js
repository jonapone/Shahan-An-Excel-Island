/* ===== GAME CORE: state, levels, badges ===== */
const $=q=>document.querySelector(q);
const SAVEK='shahan_excel_v1';
let S={seen:{},done:{},xp:0,badges:{},fts:0,fn:{},cnt:{},minis:0,flaw:0,intro:0,lvl:1};
try{const j=localStorage.getItem(SAVEK);if(j)S=Object.assign(S,JSON.parse(j))}catch(e){}
const save=()=>{try{localStorage.setItem(SAVEK,JSON.stringify(S))}catch(e){}};
const REGS={a:{n:'The Drowned Reach',tier:'Beginner',c:'#3fc2a8',view:[40,230,330,330]},d:{n:'The Sunscar',tier:'Intermediate',c:'#f0922f',view:[330,590,470,300]},
  m:{n:'Elysion',tier:'Advanced',c:'#b98cf0',view:[780,270,300,310]},h:{n:'The Hoarfrost Spine',tier:'Expert',c:'#78c4f2',view:[370,60,480,200]}};
const ROR=['a','d','m','h'];
let LV=[0];
function buildLV(){const T=STOPS.reduce((a,s)=>a+s.xp,0)*.95;LV=[0];for(let i=1;i<20;i++)LV.push(Math.round(T*Math.pow(i/19,1.75)/10)*10)}
const RANKS=['Stray','Ledger-Keeper','Tally-Hand','Scribe','Counter','Cell-Walker','Sum-Sayer','Surveyor','Rule-Reader','Cartographer','Archivist','Wayfinder','Lookup-Seeker','Loremaster','Warden of Cells','Data-Wright','Grand Archivist','Formula-Wright','Elite Challenger','Survivor of the Fourth Expedition'];
const lvlOf=x=>{let l=0;while(l+1<LV.length&&x>=LV[l+1])l++;return l+1};
const BADGES=[
 ['first','🚩','Landfall','Clear your first stop',s=>cleared()>=1],
 ['ft5','🎯','Sure Hand','5 stops solved on the first try',s=>s.fts>=5],
 ['ft15','🏹','Dead Eye','15 stops solved on the first try',s=>s.fts>=15],
 ['c10','📜','Ten Pages','Clear 10 stops',s=>cleared()>=10],
 ['c25','📚','Half the Ledger','Clear 25 stops',s=>cleared()>=25],
 ['mini1','🗡','Bossbreaker','Defeat 3 mini-bosses',s=>s.minis>=3],
 ['mini8','⚔','Warlord of Cells','Defeat all 12 mini-bosses',s=>s.minis>=12],
 ['flaw','💎','Unscathed','Beat a boss without losing a life',s=>s.flaw>=1],
 ['dbg','🔧','Formula Mechanic','Fix 5 broken formulas',s=>(s.cnt.dbg||0)>=5],
 ['prd','🔮','Seer','Correctly predict 5 outputs',s=>(s.cnt.pred||0)>=5],
 ['cod','🧙','Script Reader','Solve 4 VBA / Office Scripts puzzles',s=>((s.cnt.code||0)+(s.cnt.bug||0))>=4],
 ['pck','🧠','Sharp Mind','Pick the right formula 4 times',s=>(s.cnt.pick||0)>=4],
 ['fn15','🧰','Toolbelt','Use 15 different functions',s=>Object.keys(s.fn).length>=15],
 ['fn30','🛠','Master Toolbelt','Use 30 different functions',s=>Object.keys(s.fn).length>=30],
 ['ra','🌊','Reachwalker','Clear The Drowned Reach (Beginner)',s=>regionDone('a')],
 ['rd','🏜','Sunscarred','Clear The Sunscar (Intermediate)',s=>regionDone('d')],
 ['rm','🏛','Godtouched','Clear Elysion (Advanced)',s=>regionDone('m')],
 ['rh','❄','Frostbound','Clear The Hoarfrost Spine (Expert)',s=>regionDone('h')],
 ['l5','⭐','Cartographer','Reach level 5',s=>lvlOf(s.xp)>=5],
 ['l10','🌟','Grand Archivist','Reach level 10',s=>lvlOf(s.xp)>=10],
 ['all','👑','Survivor','Complete every stop',s=>cleared()>=STOPS.length]];
const regionDone=r=>{const rs=STOPS.filter(x=>x.reg===r);return rs.length>0&&rs.every(x=>S.done[x.id])};
const cleared=()=>Object.keys(S.done).filter(k=>S.done[k]).length;
function toast(h){const t=document.createElement('div');t.className='toast';t.innerHTML=h;$('#toasts').appendChild(t);setTimeout(()=>t.remove(),3800)}
function confetti(n=70){const cs=['#e6b43c','#d9553b','#58b368','#58aee0','#b98cf0','#f6e08a'];for(let i=0;i<n;i++){const d=document.createElement('div');d.className='conf';d.style.left=Math.random()*100+'vw';d.style.background=cs[i%cs.length];d.style.animationDelay=Math.random()*.8+'s';d.style.animationDuration=1.8+Math.random()*1.6+'s';document.body.appendChild(d);setTimeout(()=>d.remove(),4500)}}
let ovlQ=[];
function card(html,after){ovlQ.push([html,after]);if(!$('#ovl').classList.contains('on'))nextCard()}
function nextCard(){const n=ovlQ.shift();if(!n){$('#ovl').classList.remove('on');return}$('#card').innerHTML=n[0]+`<div class="row" style="justify-content:center"><button class="btn" id="cOk">Continue</button></div>`;$('#ovl').classList.add('on');$('#cOk').onclick=()=>{if(n[1])n[1]();nextCard()}}
function hud(){const x=S.xp,l=lvlOf(x);$('#lvl').textContent=l;$('#rkt').textContent=RANKS[l-1];const lo=LV[l-1],hi=LV[l]||LV[LV.length-1]+1;
  $('#xpt').textContent=l>=LV.length?x+' XP · MAX':x+' / '+hi+' XP';$('#xpf').style.width=Math.min(100,(x-lo)/(hi-lo)*100)+'%'}
function checkBadges(){for(const b of BADGES){if(!S.badges[b[0]]&&b[4](S)){S.badges[b[0]]=1;toast(`${b[1]} <b>Badge earned: ${b[2]}</b><br><small>${b[3]}</small>`)}}save()}
function addXP(n,why){const before=lvlOf(S.xp);S.xp+=n;hud();toast(`+${n} XP${why?' · '+why:''}`);const after=lvlOf(S.xp);
  if(after>before){confetti();card(`<div class="big">⭐</div><h2>Level ${after}</h2><p style="text-align:center;font-size:20px;color:#f6e08a">${RANKS[after-1]}</p><p style="text-align:center">${LVMSG[after-1]||'The ledger grows heavier. So do you.'}</p>`)}checkBadges()}
const LVMSG=['','You can add. Most of the Fourth Expedition could not.','You hold the pen now. Guard it.','Numbers stop lying when you ask them properly.','You count things other people lose.','You walk the grid without looking at your feet.','Totals come easily now.','You read the land in cells.','You can read a rule before you write it.','Mapmakers die first. You are still here.','The archive opens its older drawers to you.','You can find a path through any table.','Things come when you name them.','The old lore answers when you call it.','Wardens do not guess. They verify.','You clean data the way others clean blades.','Few in Shahan have climbed this high on spreadsheets alone.','You write formulas the way others write spells.','The island across the sea has begun to notice you.','Survivor. The ledger is complete.'];
function openBadges(){card(`<h2>Badges</h2><p style="text-align:center;margin:0;color:var(--mut)">${Object.keys(S.badges).length} of ${BADGES.length} earned</p><div class="bg">`+BADGES.map(b=>`<div class="bd ${S.badges[b[0]]?'got':''}"><div class="ic">${b[1]}</div><b>${b[2]}</b><small>${b[3]}</small></div>`).join('')+'</div>')}
