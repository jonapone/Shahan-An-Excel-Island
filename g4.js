function drawMeasure(){}
/* ===== MAP OVERLAY, CAMERA, BOOT ===== */
const NSV='http://www.w3.org/2000/svg';
let gm=null,moved=false;
function setVB2(v){vb=v;svg.setAttribute('viewBox',v.map(n=>+n.toFixed(1)).join(' '));svg.classList.toggle('far',v[2]>760);scaleMarks()}
function animTo2(t,ms=650){const s0=vb.slice(),t0=performance.now();(function f(n){const k=Math.min(1,(n-t0)/ms),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;setVB2(s0.map((v,i)=>v+(t[i]-v)*e));if(k<1)requestAnimationFrame(f)})(t0)}
function kScale(){const w=$('#stage').clientWidth||1200;return Math.max(.45,Math.min(1.25,vb[2]/w*2.1))}
function scaleMarks(){if(!gm)return;const k=kScale();gm.querySelectorAll('.mk').forEach(g=>g.setAttribute('transform',`translate(${g.dataset.x},${g.dataset.y}) scale(${k})`));const lw=gm.querySelectorAll('.pth');lw.forEach(p=>p.setAttribute('stroke-width',(2.6*k).toFixed(2)));gm.classList.toggle('lab',vb[2]<640);gm.classList.toggle('ez',vb[2]<420)}
function status(s){return S.done[s.id]?'done':isOpen(s)?'open':'lock'}
const mixc=(typeof mix==='function')?mix:((a)=>a);
function drawMarks(){
  if(!gm){gm=document.createElementNS(NSV,'g');gm.setAttribute('id','gm');svg.appendChild(gm)}
  let h='<defs><radialGradient id="mkshine" cx=".34" cy=".28" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".45" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient><radialGradient id="mksh"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>'+(typeof isleSvg==='function'?isleSvg():'');
  for(const r of ROR){const rs=regStops(r),c=REGS[r].c;
    for(let i=0;i<rs.length-1;i++){const a=rs[i],b=rs[i+1],d=!!S.done[a.id]&&!!S.done[b.id]||(!!S.done[a.id]&&isOpen(b));const unl=isOpen(a);
      h+=`<line class="pth ${r==='e'?'eis':''}" x1="${a.at[0]+OFF}" y1="${a.at[1]+OFF}" x2="${b.at[0]+OFF}" y2="${b.at[1]+OFF}" stroke="${d?c:'#2a1a0c'}" stroke-opacity="${d?1:unl?.75:.35}" stroke-width="2.6" stroke-dasharray="${d?'none':'5 5'}" stroke-linecap="round"/>`}}
  for(const s of STOPS){const st=status(s),c=REGS[s.reg].c,i=regStops(s.reg).indexOf(s)+1,bs=s.kind==='boss',mn=s.kind==='mini';
    const fill=st==='done'?'#58b368':st==='open'?'#f0c75a':'#6b6558',R0=bs?17:mn?14:11;
    const glyph=st==='done'?'✓':bs?'☠':mn?'⚔':i;
    h+=`<g class="mk ${st==='open'||bs||mn?'o':''} ${s.reg==='e'?'eis':''} ${s.reg==='s'?'sea':''}" data-id="${s.id}" data-x="${s.at[0]+OFF}" data-y="${s.at[1]+OFF}" transform="translate(${s.at[0]+OFF},${s.at[1]+OFF})">`+
      (st==='open'?`<circle class="gpulse" r="19" fill="none" stroke="${bs?'#ff6a4a':'#fff1b0'}" stroke-width="3"/>`:'')+
      `<ellipse cx="4" cy="${R0+7}" rx="${R0+5}" ry="${(R0+3)*.38}" fill="url(#mksh)"/>`+
      `<circle class="mr" cy="${bs?6:4}" r="${R0+3}" fill="#1d130b"/><circle class="mr" cy="${bs?3:2}" r="${R0+3}" fill="${mixc(c,'#000000',.45)}" stroke="#1d130b" stroke-width="1.5"/>`+
      `<g class="top" transform="translate(0 ${bs?-3:-1})"><circle class="mr" r="${R0+3}" fill="${c}" stroke="#1d130b" stroke-width="1.5"/><circle class="mr" r="${R0}" fill="${fill}" stroke="#1d130b" stroke-width="2"/><circle r="${R0}" fill="url(#mkshine)" pointer-events="none"/>`+
      (bs?`<path d="M-9,-${R0+3} l3,-7 l3,5 l3,-7 l3,7 l3,-5 l3,7z" fill="#e6b43c" stroke="#1d130b" stroke-width="1.2" transform="translate(-0,0) scale(.9)"/>`:'')+
      `<text y="${bs||mn||st==='done'?5.5:5}" text-anchor="middle" font-size="${bs?16:mn?14:13}" font-weight="700" fill="${st==='lock'?'#d6cdb8':'#1d130b'}" font-family="Georgia,serif" pointer-events="none">${glyph}</text></g>`+
      `<text class="nm" y="${R0+17}" text-anchor="middle" font-size="12" font-weight="700" fill="#fdf3d6" stroke="#1d130b" stroke-width="3.2" paint-order="stroke" font-family="Georgia,serif" pointer-events="none">${s.name}</text></g>`}
  h+=(typeof ipinSvg==='function'?ipinSvg():'');
  gm.innerHTML=h;
  gm.querySelectorAll('.mk').forEach(g=>g.onclick=()=>{if(moved)return;if(g.dataset.id==='isle'){isOpen(stopById('e1'))?goRegion('e'):toast('Clear all four regions to reach the Obsidian Isle.')}else openStop(g.dataset.id)});scaleMarks();tabs()}
function tabs(){const el=$('#tabs');el.innerHTML='';for(const r of ROR){const rs=regStops(r),dn=rs.filter(s=>S.done[s.id]).length,R=REGS[r],lock=rs[0]?!isOpen(rs[0]):true;
  const b=document.createElement('button');b.className='tab'+(lock?' lock':'');b.style.setProperty('--c',R.c);b.innerHTML=`<b>${lock?'🔒 ':''}${R.n}</b><span>${R.tier} · ${dn}/${rs.length} cleared</span><i><u style="width:${rs.length?dn/rs.length*100:0}%"></u></i>`;b.onclick=()=>lock?toast('Clear the previous region\'s boss first.'):goRegion(r);el.appendChild(b)}}
function goRegion(r){const v=REGS[r].view;const w=$('#stage').clientWidth,pw=$('#panel').classList.contains('open')?Math.min(640,w):0;const sh=pw?pw/2*v[2]/w:0;animTo2([v[0]+OFF+sh,v[1]+OFF,v[2],v[3]])}
function focusStop(s){const w=$('#stage').clientWidth,h=$('#stage').clientHeight,pw=Math.min(640,w);const vw=w<800?420:300,vh=vw*h/w;const sh=w<800?0:pw/2*vw/w;animTo2([s.at[0]+OFF-vw/2+sh,s.at[1]+OFF-vh/2,vw,vh],550)}
function curRegion(){for(const r of ROR){if(regStops(r).some(s=>!S.done[s.id]))return r}return 'e'}
/* pan & zoom */
(function(){const st=$('#stage');let pts={},last=null,pd=0;
  const toV=(x,y)=>{const p=svg.createSVGPoint();p.x=x;p.y=y;return p.matrixTransform(svg.getScreenCTM().inverse())};
  st.addEventListener('pointerdown',e=>{pts[e.pointerId]=[e.clientX,e.clientY];moved=false;last=[e.clientX,e.clientY];if(Object.keys(pts).length===2){const a=Object.values(pts);pd=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])}});
  st.addEventListener('pointermove',e=>{if(!pts[e.pointerId])return;const n=Object.keys(pts).length;
    if(n===1){const dx=e.clientX-last[0],dy=e.clientY-last[1];if(Math.abs(dx)+Math.abs(dy)>0&&(moved||Math.hypot(e.clientX-pts[e.pointerId][0],e.clientY-pts[e.pointerId][1])>5)){moved=true;st.classList.add('drag');const k=Math.max(vb[2]/st.clientWidth,vb[3]/st.clientHeight);setVB2([vb[0]-dx*k,vb[1]-dy*k,vb[2],vb[3]])}last=[e.clientX,e.clientY]}
    else if(n===2){pts[e.pointerId]=[e.clientX,e.clientY];const a=Object.values(pts),d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);if(pd){zoomAt((a[0][0]+a[1][0])/2,(a[0][1]+a[1][1])/2,pd/d)}pd=d;moved=true}
    pts[e.pointerId]=[e.clientX,e.clientY]});
  const up=e=>{delete pts[e.pointerId];st.classList.remove('drag');pd=0;setTimeout(()=>moved=false,30)};st.addEventListener('pointerup',up);st.addEventListener('pointercancel',up);
  function zoomAt(cx,cy,f){const p=toV(cx,cy);let w=vb[2]*f;w=Math.max(120,Math.min(W*1.05,w));f=w/vb[2];setVB2([p.x-(p.x-vb[0])*f,p.y-(p.y-vb[1])*f,w,vb[3]*f])}
  st.addEventListener('wheel',e=>{e.preventDefault();zoomAt(e.clientX,e.clientY,e.deltaY>0?1.15:1/1.15)},{passive:false})})();
/* codex & help */
function openCodex(){const rows=CODEX.slice().sort((x,y)=>x[0].localeCompare(y[0]));
  card(`<h2>Codex of Functions</h2><p style="text-align:center;margin:0 0 8px;color:var(--mut)">A to Z. Green = you have used it in a correct formula.</p><input id="cxq" class="ans" style="width:100%;margin-bottom:10px;border-color:#6d4f2c;background:#1b130a;color:#ecdcb8" placeholder="Search by name or what it does (e.g. lookup, text, count)" autocomplete="off"><div class="cx" id="cxl"></div><p id="cxn" style="text-align:center;color:var(--mut);display:none">Nothing matches that search.</p>`);
  const paint=q=>{q=q.trim().toLowerCase();const m=rows.filter(c=>!q||c[0].toLowerCase().includes(q)||c[1].toLowerCase().includes(q)||c[2].toLowerCase().includes(q));
    $('#cxl').innerHTML=m.map(c=>`<div class="${S.fn[c[0]]?'u':''}"><b>${c[0]}</b><code>${esc(c[1])}</code>${c[2]}</div>`).join('');$('#cxn').style.display=m.length?'none':'block'};
  paint('');const i=$('#cxq');i.oninput=()=>paint(i.value);setTimeout(()=>i.focus(),50)}
function openScripture(only){const L=(only&&only.length?only.map(SCR_BY).filter(Boolean):SCRIPT);
  card(`<h2>The Scripture</h2><p style="text-align:center;margin:0 0 8px;color:var(--mut)">How Excel thinks. Read in any order. Open a chapter to expand it.</p><div class="cx scrl">`+L.map((c,i)=>`<details ${only&&only.length===1?'open':''}><summary>${c.t}${S.seen[c.id]?' <span style="color:var(--green)">✓ read</span>':''}</summary><div class="scr">${c.b}</div></details>`).join('')+'</div>')}
function openHelp(){card(`<h2>How to survive</h2><p>The map is the Fourth Expedition's ledger. Each numbered stop is a place where something went wrong with the numbers. Click a glowing stop, read the lesson, then solve the task in the mini-spreadsheet.</p><p><b>Formula tasks:</b> type a formula in the yellow cell's formula bar. It is checked against hidden variations of the data, so hard-coding answers will not work.<br><b>Debug / Predict / Pick:</b> fix the broken formula, say what a cell shows, or choose the correct formula.<br><b>VBA &amp; Office Scripts:</b> read the code and trace it. Nothing is executed; this is about reading logic.</p><p><b>Bosses</b> (⚔ mini, ☠ region) have several rounds, three lives and no second chances per round. The Codex lists the syntax of every function in the game.</p><div class="row" style="justify-content:center"><button class="btn g" id="sv">Save &amp; restore</button><button class="btn g" id="rs">Reset all progress</button></div>`);
  $('#sv').onclick=()=>{ovlQ.length=0;$('#ovl').classList.remove('on');openSave()};
  $('#rs').onclick=function(){if(this.dataset.s){try{localStorage.removeItem(SAVEK)}catch(e){}location.reload()}else{this.dataset.s=1;this.textContent='Really erase everything? Click again.'}}}
function intro(){card(`<h2>The Ledger of the Fourth Expedition</h2><p>Four expeditions have crossed Shahan to catalogue it. Three never came back with their books. The fourth sent four hundred people, a hundred wagons and one very ambitious spreadsheet.</p><p>You are the only one who walked out. You carry the ledger, singed at the corners, its totals wrong, its formulas gnawed. Every entry marks a place where the numbers betrayed someone.</p><p>Fix the ledger and you fix the record of what happened. Start in the <b style="color:var(--ra)">Drowned Reach</b>, where the ferrymen are cheerfully cooking the books.</p>`,()=>{S.intro=1;save();goRegion(curRegion())})}
function boot(){buildLV();render();setVB2([0,0,W,H]);drawMarks();hud();checkBadges();$('#bBad').onclick=openBadges;$('#bCdx').onclick=openCodex;$('#bScr').onclick=()=>openScripture();$('#bWis').onclick=openWisdom;$('#bHlp').onclick=openHelp;$('#bWld').onclick=()=>animTo2([0,0,W,H]);
  if(!storageOK())setTimeout(()=>toast('⚠ This page cannot save your progress. Use the downloaded game.html file instead.'),1500);
  if(!S.intro)intro();else goRegion(curRegion())}

function storageOK(){try{localStorage.setItem('_t','1');return localStorage.getItem('_t')==='1'}catch(e){return false}}
function applyNow(){hud();drawMarks();tabs();checkBadges();goRegion(curRegion())}
function openSave(){
 const opts=STOPS.map((s,i)=>`<option value="${i}">${i+1}. ${esc(s.name)} (${REGS[s.reg].n})</option>`).join('');
 card(`<h2>Save &amp; restore</h2><p>Your progress lives in this browser only. <b>Copy the code below somewhere safe</b>; paste it back here to restore it on any browser or after an update.</p>
 <textarea id="svt" rows="4" style="width:100%;font:12px var(--mono);background:#1b130a;color:#fdf3d6;border:1px solid #6b5a3c;border-radius:8px;padding:8px" spellcheck="false"></textarea>
 <div class="row" style="justify-content:center;margin:8px 0"><button class="btn g" id="svc">Show my code</button><button class="btn g" id="svi">Restore from code</button></div>
 <p style="margin-top:14px"><b>Lost your progress?</b> Choose the first stop you had <u>not</u> yet cleared. Everything before it is marked cleared and its XP is credited.</p>
 <select id="svs" style="width:100%;padding:8px;background:#1b130a;color:#fdf3d6;border:1px solid #6b5a3c;border-radius:8px">${opts}</select>
 <div class="row" style="justify-content:center;margin-top:8px"><button class="btn" id="svr">Restore up to that stop</button></div><div id="svm" style="text-align:center;margin-top:6px"></div>`);
 $('#svc').onclick=()=>{$('#svt').value=btoa(unescape(encodeURIComponent(JSON.stringify(S))));$('#svt').select()};
 $('#svi').onclick=()=>{try{const o=JSON.parse(decodeURIComponent(escape(atob($('#svt').value.trim()))));if(!o||typeof o.done!=='object')throw 0;Object.assign(S,o);save();applyNow();$('#ovl').classList.remove('on');ovlQ.length=0;toast('Restored from code.'+(storageOK()?'':' WARNING: this page cannot store saves.'))}catch(e){$('#svm').textContent='That code is not valid.'}};
 $('#svr').onclick=()=>{const k=+$('#svs').value;S.paid=S.paid||{};let g=0;STOPS.slice(0,k).forEach(s=>{if(!S.done[s.id]){S.done[s.id]=1;S.paid[s.id]=1;g+=s.xp}});S.xp+=g;S.lvl=lvlOf(S.xp);save();applyNow();const w=storageOK()?'':' WARNING: this page cannot store saves, so it will be lost on reload.';$('#ovl').classList.remove('on');ovlQ.length=0;toast(`Restored: ${k} stops cleared, +${g} XP.${w}`);if(w)card('<h2>Progress restored, but not saved</h2><p>This page cannot store saves in your browser, so reloading will lose it. Try another browser or the downloaded file.</p>')}}

function openWisdom(){let w=$('#wis');if(!w){w=document.createElement('div');w.id='wis';w.innerHTML='<div class="wh"><span>🧾 Wisdom Scroll · Excel cheat sheet</span><button class="wx" id="wisx">Close</button></div><iframe id="wisf" title="Excel cheat sheet"></iframe>';document.body.appendChild(w);$('#wisx').onclick=()=>w.classList.remove('on');document.addEventListener('keydown',e=>{if(e.key==='Escape')w.classList.remove('on')});$('#wisf').srcdoc=WISDOM}w.classList.add('on')}
