/* ===== PANEL: challenge UI ===== */
let cur=null;
const stopById=id=>STOPS.find(s=>s.id===id);
const regStops=r=>STOPS.filter(s=>s.reg===r);
function isOpen(s){if(s.req)return regionDone(s.req);const rs=regStops(s.reg),i=rs.indexOf(s);if(i>0)return !!S.done[rs[i-1].id];const ri=ROR.indexOf(s.reg);return ri===0||regionDone(ROR[ri-1])}
function gridDims(R){let mr=1,mc=1;const T=targets(R);for(const k of Object.keys(R.d).concat(T,R.cmp?[R.cmp.split(':')[1]]:[])){const p=parseRef(k);if(p){mr=Math.max(mr,p.r);mc=Math.max(mc,p.c)}}return{mr:Math.min(mr+(R.ty==='f'?1:0),40),mc:Math.max(mc,4)}}
function gridHTML(R,cells,formula){
  const sh=new Sheet(Object.assign({},cells)),{mr,mc}=gridDims(R),T=targets(R);let h='<table><tr><th class="rh"></th>';
  for(let c=1;c<=mc;c++)h+=`<th>${colL(c)}</th>`;h+='</tr>';
  for(let r=1;r<=mr;r++){h+=`<tr><th class="rh">${r}</th>`;for(let c=1;c<=mc;c++){const a=colL(c)+r;let v;try{v=sh.get(a)}catch(e){v=isErr(e)?e:XErr('#NAME?')}
    const raw=cells[a],isT=T.includes(a),spl=raw===undefined&&v!==null,cl=[];if(typeof v==='number')cl.push('n');if(sh.isF(raw))cl.push('fm');if(isT)cl.push('tg');if(spl)cl.push('sp');if(isErr(v))cl.push('er');
    const hide=R.ty==='pred'&&isT&&typeof cur!=='undefined'&&cur&&!cur.done;const shown=hide?'?':(typeof raw==='string'&&/^=DATE\(/.test(raw)&&typeof v==='number')?fmtDate(v,'dd mmm yyyy'):showVal(v);
    h+=`<td class="${cl.join(' ')}" ${isT?`data-t="${a}"`:''} ${sh.isF(raw)&&!isT?`title="${esc(raw)}"`:''}>${esc(shown)}</td>`}h+='</tr>'}
  return h+'</table>'}
function openStop(id){const s=stopById(id);if(!s)return;if(!isOpen(s)){toast(s.req?'🔒 Locked. Clear '+REGS[s.req].n+' first.':'🔒 Locked. Clear the previous stop first.');return}
  const un=(s.prim||[]).filter(c=>!S.seen[c]&&SCR_BY(c));
  if(!un.length)return startStop(s);
  un.forEach((c,i)=>card(`<div class="chip" style="--c:#7fe0b4">New idea · Scripture</div><h2 style="text-align:left;font-size:24px">${SCR_BY(c).t}</h2><div class="scr">${SCR_BY(c).b}</div>`,()=>{S.seen[c]=1;save();if(i===un.length-1)startStop(s)}))}
function startStop(s){
  cur={s,rd:0,lives:3,tries:0,flaw:true,fail:0,fmla:'',sel:null,done:false};renderRound();$('#panel').classList.add('open');$('#panel').scrollTop=0;focusStop(s)}
function closePanel(){$('#panel').classList.remove('open');cur=null;drawMarks()}
function renderRound(){
  const s=cur.s,R=s.rounds[cur.rd],rc=REGS[s.reg].c,boss=s.kind!=='learn',n=s.rounds.length,idx=regStops(s.reg).indexOf(s)+1;
  const kindChip=s.kind==='boss'?'<span class="chip boss">Region Boss</span>':s.kind==='mini'?'<span class="chip mini">Mini-Boss</span>':'';
  let h=`<span class="chip" style="--c:${rc}">${REGS[s.reg].tier} · Stop ${idx}/${regStops(s.reg).length}</span>${kindChip}`;
  if(boss)h+=`<span class="lives" title="Lives">${[0,1,2].map(i=>`<span class="${i<cur.lives?'':'x'}">❤️</span>`).join('')}</span>`;
  h+=`<h2 class="pt">${s.name}</h2>`;
  if(boss)h+=`<div class="rnd">${s.rounds.map((_,i)=>`<i class="${i<cur.rd?'ok':i===cur.rd?'on':''}"></i>`).join('')}</div><div style="font-size:12px;color:var(--mut)">Round ${cur.rd+1} of ${n} · three lives · no hints · a wrong answer costs a life</div>`;
  const st=(cur.rd===0?s.intro:'')||''+(R.tx||'');if(cur.rd===0&&s.intro||R.tx)h+=`<div class="story" style="--c:${rc}">${(cur.rd===0?s.intro||'':'')}${R.tx?(cur.rd===0&&s.intro?'<br><br>':'')+R.tx:''}</div>`;
  if(s.les&&cur.rd===0)h+=`<div class="lesson"><b class="h">Field lesson</b>${s.les}</div>`;
  h+=`<div class="task"><b>Task.</b> ${R.q}</div>${s.prim&&s.prim.length&&cur.rd===0?`<div style="margin:-4px 0 8px"><button class="btn g" id="scrb" style="padding:5px 10px;font-size:12px">📜 Reread the Scripture for this stop</button></div>`:''}`;
  const ty=R.ty;
  if(ty==='f'||ty==='dbg'){cur.fmla=cur.fmla||R.pre||'';const T=targets(R);h+=`<div class="grid" id="grid"></div><div class="fb"><span>${T.length>1?T[0]+'↓':T[0]} fx</span><input id="fin" spellcheck="false" autocomplete="off" placeholder="=type your formula here" value="${esc(cur.fmla)}"></div>${T.length>1?'<div style="font-size:12px;color:var(--mut)">This formula is filled down '+T[0]+'→'+T[T.length-1]+' automatically, exactly like dragging the fill handle.</div>':''}`}
  else if(ty==='pred'){h+=`<div class="grid" id="grid"></div><div style="font-family:var(--mono);font-size:13.5px;margin:4px 0">${R.show?esc(R.show):esc(R.d[R.tgt]||'')}</div><div style="font-size:12.5px;color:var(--mut);margin:6px 0 2px"><b>Predict round:</b> type the <u>result</u> the cell shows (for example <code>12</code> or <code>TRUE</code>). Do not write a formula.</div><div class="fb"><input class="ans" id="ain" placeholder="Type the displayed value, not a formula" autocomplete="off"></div>`}
  else if(ty==='pick'){h+=`<div class="grid" id="grid"></div><div class="opts" id="opts">${R.opts.map((o,i)=>`<button class="opt" data-i="${i}">${esc(o)}</button>`).join('')}</div>`}
  else if(ty==='code'||ty==='bug'){h+=`<div class="code ${ty==='bug'?'pk':''}" id="code">${R.code.map((l,i)=>`<div data-i="${i+1}"><i>${i+1}</i><span>${hl(l)}</span></div>`).join('')}</div>`;
    if(ty==='code'&&R.opts)h+=`<div class="opts" id="opts">${R.opts.map((o,i)=>`<button class="opt" data-i="${i}">${esc(o)}</button>`).join('')}</div>`;
    else if(ty==='code')h+=`<div class="fb"><input class="ans" id="ain" placeholder="Your answer" autocomplete="off"></div>`;
    else h+=`<div style="font-size:12px;color:var(--mut)">Click the line that contains the bug.</div>`}
  h+=`<div id="res"></div><div class="row"><button class="btn" id="run">${ty==='f'||ty==='dbg'?'▶ Run formula':'Submit answer'}</button>${(ty==='f'||ty==='dbg')?'<button class="btn g" id="rst">Reset cell</button>':''}</div>`;
  $('#pin').innerHTML=h+`<button id="px2" style="display:none"></button>`;
  if($('#grid'))paintGrid();
  const fin=$('#fin');if(fin){fin.oninput=()=>{cur.fmla=fin.value;paintGrid()};fin.onkeydown=e=>{if(e.key==='Enter')submit()};setTimeout(()=>fin.focus(),380)}
  const sb=$('#scrb');if(sb)sb.onclick=()=>openScripture(s.prim);
  $('#run').onclick=submit;const rst=$('#rst');if(rst)rst.onclick=()=>{cur.fmla=R.pre||'';$('#fin').value=cur.fmla;paintGrid();$('#res').innerHTML=''};
  const ain=$('#ain');if(ain)ain.onkeydown=e=>{if(e.key==='Enter')submit()};
  document.querySelectorAll('#opts .opt').forEach(b=>b.onclick=()=>{cur.sel=+b.dataset.i;document.querySelectorAll('#opts .opt').forEach(x=>x.classList.toggle('sel',x===b))});
  if(ty==='bug')document.querySelectorAll('#code div').forEach(d=>d.onclick=()=>{cur.sel=+d.dataset.i;document.querySelectorAll('#code div').forEach(x=>x.classList.toggle('sel',x===d))});
  $('#px').onclick=closePanel}
function hl(l){let x=esc(l);return x.replace(/('.*$)/,'<span class="cm">$1</span>').replace(/(\/\/.*$)/,'<span class="cm">$1</span>').replace(/(&quot;[^&]*?&quot;|"[^"]*")/g,'<span class="st">$1</span>').replace(/\b(Sub|End Sub|Dim|As|For|Next|If|Then|Else|ElseIf|End If|To|Step|Do|Loop|While|Wend|Function|End Function|Set|Exit|Each|In|Not|And|Or|function|const|let|for|if|else|return|of|main|async|await|while)\b/g,'<span class="kw">$1</span>').replace(/\b(Range|Cells|Worksheets|Sheets|MsgBox|Debug|Application|ActiveSheet|selectedSheet|getRange|getValue|setValue|getValues|setValues|getCell|getUsedRange|getRowCount|length)\b/g,'<span class="vk">$1</span>')}
function paintGrid(){const R=cur.s.rounds[cur.rd],g=$('#grid');if(!g)return;let cells=Object.assign({},R.d);
  if(R.ty==='f'||R.ty==='dbg'){const f=(cur.fmla||'').trim();const T=targets(R);if(f&&f[0]==='=')applyF(cells,R,f);else if(f)T.forEach(a=>cells[a]=f);else if(R.ty==='dbg')T.forEach(a=>cells[a]=null)}
  const sc=g.scrollTop,sl=g.scrollLeft;g.innerHTML=gridHTML(R,cells);g.scrollTop=sc;g.scrollLeft=sl;
  g.querySelectorAll('td.tg').forEach(td=>td.onclick=()=>$('#fin')&&$('#fin').focus())}
function submit(){
  if(!cur||cur.done)return;const s=cur.s,R=s.rounds[cur.rd];let r;
  if(R.ty==='f'||R.ty==='dbg')r=checkFormula(R,cur.fmla);
  else if(R.ty==='pred')r=checkPred(R,$('#ain').value);
  else if(R.ty==='pick'||(R.ty==='code'&&R.opts)){if(cur.sel==null)r={ok:false,msg:'<b>Nothing chosen.</b>Pick an option first.',soft:1};else r=cur.sel===R.ans?{ok:true,msg:'<b>Correct.</b>'}:{ok:false,msg:'<b>Wrong choice.</b>'+(R.why?R.why:'Run the options through the data in your head, one by one.')}}
  else if(R.ty==='code')r=normA($('#ain').value)===normA(R.ans)?{ok:true,msg:'<b>Correct.</b>'}:{ok:false,msg:'<b>Wrong output.</b>You answered <span class="cd">'+esc($('#ain').value)+'</span>. Trace the loop variable by variable, line by line.'};
  else if(R.ty==='bug'){if(cur.sel==null)r={ok:false,msg:'<b>No line selected.</b>Click the buggy line.',soft:1};else r=cur.sel===R.ans?{ok:true,msg:'<b>Found it.</b>'}:{ok:false,msg:`<b>Line ${cur.sel} is fine.</b>Look again at what each line actually does.`}}
  const res=$('#res');
  if(r.soft){res.innerHTML=`<div class="res bad">${r.msg}</div>`;return}
  if(!r.ok){cur.tries++;cur.flaw=false;let extra='';
    if(s.kind!=='learn'){cur.lives--;extra=` <b style="display:inline;color:#ff8a70">−1 life</b>`}
    res.innerHTML=`<div class="res bad">${r.msg}${extra}</div>`;
    if(s.kind!=='learn'){document.querySelector('.lives').innerHTML=[0,1,2].map(i=>`<span class="${i<cur.lives?'':'x'}">❤️</span>`).join('');if(cur.lives<=0)return defeat()}
    return}
  // success
  const first=!S.done[s.id];
  if(first){S.cnt[R.ty]=(S.cnt[R.ty]||0)+1;if(R.ty==='f'||R.ty==='dbg'){(cur.fmla.match(/[A-Za-z][A-Za-z0-9.]*(?=\()/g)||[]).forEach(f=>S.fn[f.toUpperCase()]=1)}}
  res.innerHTML=`<div class="res ok">${r.msg}${R.exp?'<div style="margin-top:6px">'+R.exp+'</div>':''}</div>`;
  const last=cur.rd>=s.rounds.length-1;
  if(!last){const b=document.createElement('button');b.id='nxr';b.className='btn';b.textContent='Next round →';b.onclick=()=>{cur.rd++;cur.sel=null;cur.fmla='';renderRound();$('#panel').scrollTop=0};$('#run').replaceWith(b);if($('#rst'))$('#rst').remove();lockInputs();save();return}
  cur.done=true;lockInputs();finish(first)}
function lockInputs(){document.querySelectorAll('#pin input,#pin .opt,#code div').forEach(e=>{e.disabled=true;e.style.pointerEvents='none'})}
function defeat(){cur.done=true;lockInputs();const s=cur.s;const gaunt=s.reg==='e';if(gaunt){regStops('e').forEach(x=>{S.done[x.id]=0});save()}const b=document.createElement('button');b.className='btn';b.textContent=gaunt?'Return to the first fight':'Rise and try again';b.onclick=gaunt?(()=>{closePanel();drawMarks();tabs();hud();goRegion('e')}):(()=>{cur={s,rd:0,lives:3,tries:0,flaw:true,fail:0,fmla:'',sel:null,done:false};renderRound()});$('#run').replaceWith(b);if($('#rst'))$('#rst').remove();
  $('#res').insertAdjacentHTML('beforeend',`<div class="res bad"><b>💀 ${s.name} has beaten you.</b>All three lives are gone. You wake at the camp with a headache and your notes intact. ${gaunt?'The Elite gauntlet <b style="display:inline">resets</b>: you are carried back to the first fight. Your XP stays.':'The boss starts over, with the same weaknesses.'}</div>`)}
function finish(first){const s=cur.s;let msg='';
  if(first){S.done[s.id]=1;S.paid=S.paid||{};const pd=!!S.paid[s.id];S.paid[s.id]=1;const bonus=(cur.tries===0&&!pd)?Math.round(s.xp*.25):0;if(!pd){if(cur.tries===0&&s.kind==='learn')S.fts++;if(s.kind!=='learn'){if(s.kind==='mini'&&s.reg!=='s')S.minis++;if(cur.flaw)S.flaw++}}save();
    if(!pd)addXP(s.xp+bonus,bonus?`${s.name} · flawless +${bonus}`:s.name);else toast&&toast('Gauntlet fight cleared again (no repeat XP)');
    if(s.kind!=='learn')confetti(40);
    const rs=regStops(s.reg);if(s.reg!=='s'&&regionDone(s.reg)){setTimeout(()=>regionClear(s.reg),700)}}
  else msg='<div style="color:var(--mut);margin-top:6px">Already cleared: no XP on a replay.</div>';
  const rs=regStops(s.reg),i=rs.indexOf(s),nx=rs[i+1]||(ROR[ROR.indexOf(s.reg)+1]&&regStops(ROR[ROR.indexOf(s.reg)+1])[0]);
  $('#pin').insertAdjacentHTML('beforeend',`<div class="row" style="margin-top:14px">${nx&&isOpen(nx)?`<button class="btn" id="nxt">Next: ${nx.name} →</button>`:''}<button class="btn g" id="bk">Back to map</button></div>${msg}`);
  const nb=$('#nxt');if(nb)nb.onclick=()=>openStop(nx.id);$('#bk').onclick=closePanel;drawMarks();tabs()}
function regionClear(r){const R=REGS[r],ri=ROR.indexOf(r),nx=ROR[ri+1];confetti(120);
  if(!nx)card(`<div class="big">👑</div><h2>The Ledger Is Complete</h2><p>The last page burns clean. Four regions, the Elite Four and the Champion of the Obsidian Isle, and not one of them could count past what you taught them.</p><p>The Fourth Expedition left Shahan with four hundred souls and a spreadsheet nobody understood. It returns with one survivor and the only formula that matters: you read the data before you trusted it.</p><p style="text-align:center;color:var(--gold);font-size:18px">You are the Survivor of the Fourth Expedition.</p>`);
  else card(`<div class="big">🏳️</div><h2>${R.n} Cleared</h2><p style="text-align:center;color:${R.c}">${R.tier} tier complete</p><p>${REGEND[r]}</p><p style="text-align:center">New territory open: <b style="color:${REGS[nx].c}">${REGS[nx].n}</b> (${REGS[nx].tier}).</p>`,()=>{closePanel();goRegion(nx)})}
const REGEND={a:'The archipelago exhales. Villages that hid their ledgers for years bring them out, because someone finally balanced them. The ferrymen stop overcharging. Mostly.',d:'The caravans can read their own manifests again. Out in the dunes, a mirage reflects on its choices.',m:'The gods applaud, which is worse than silence, because they never stop. Olympus notes your name in a ledger of its own.'};
