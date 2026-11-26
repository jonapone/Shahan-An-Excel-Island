/* ===== CHALLENGE CHECKING ===== */
function shiftFormula(f,dr){ // shift relative rows only
  return f.split(/("(?:[^"]|"")*")/).map((p,i)=>i%2?p:p.replace(/(\$?[A-Z]{1,3})(\$?)(\d+)(?![\d(A-Za-z_])/g,(m,c,d,r)=>c+(d?'$'+r:String(+r+dr)))).join('')}
function targets(R){if(R.tgtR){const a=parseRef(R.tgtR[0]),b=parseRef(R.tgtR[1]);const o=[];for(let r=a.r;r<=b.r;r++)o.push(colL(a.c)+r);return o}return[R.tgt]}
const cmpAddrs=R=>R.cmp?rangeAddrs(R.cmp):targets(R);
function applyF(cells,R,f){const T=targets(R),r0=parseRef(T[0]).r;T.forEach(a=>{cells[a]=shiftFormula(f,parseRef(a).r-r0)});return cells}
function seeded(str){let h=2166136261;for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return rng(h>>>0)}
function rangeAddrs(rg){const[a,b]=rg.split(':');const p=parseRef(a),q=parseRef(b||a);const o=[];for(let r=p.r;r<=q.r;r++)for(let c=p.c;c<=q.c;c++)o.push(colL(c)+r);return o}
function altData(R,k){const rnd=seeded((R.id||R.q)+k);const d=Object.assign({},R.d);
  for(const rg of [].concat(R.vary||[]))for(const a of rangeAddrs(rg)){const v=d[a];const isS=typeof v==='string'&&v.trim()!==''&&!isNaN(Number(v));if(typeof v==='number'||isS){const x=Number(v),nv=x*(0.4+rnd()*1.4);const o=Number.isInteger(x)?Math.max(1,Math.round(nv)):Math.round(nv*100)/100;d[a]=isS?String(o):o}}
  for(const [rg,vs,rand] of (R.pool||[])){const ad=rangeAddrs(rg);const vals=ad.map((a,i)=>(!rand&&i<vs.length)?vs[i]:vs[Math.floor(rnd()*vs.length)]);for(let i=vals.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[vals[i],vals[j]]=[vals[j],vals[i]]}ad.forEach((a,i)=>d[a]=vals[i])}
  for(const rg of [].concat(R.shuf||[])){const ad=rangeAddrs(rg);const vals=ad.map(a=>d[a]);for(let i=vals.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[vals[i],vals[j]]=[vals[j],vals[i]]}ad.forEach((a,i)=>d[a]=vals[i])}
  return d}
const ERRX={'#N/A':'A lookup came back empty: the value was not found. Check the lookup value, the lookup range, and the match type (exact = 0 / FALSE).','#VALUE!':'The wrong kind of value went into the formula (text where a number is needed, or the other way round).','#DIV/0!':'You divided by zero or by an empty cell.','#REF!':'A reference points somewhere that does not exist (or the formula refers to itself).','#NAME?':'Excel does not recognise something: a misspelled function, or text missing its "quotes".','#NUM!':'A number is impossible for this function.','#SPILL!':'A dynamic array wants to spill into cells that are not empty.','#CALC!':'A dynamic array came back empty. Use the if_empty argument.'};
function checkFormula(R,f){
  f=(f||'').trim();if(!f)return{ok:false,msg:'<b>Nothing entered.</b>Type a formula in the formula bar. It must start with =.'};
  if(f[0]!=='=')return{ok:false,msg:'<b>Not a formula.</b>Every Excel formula starts with <code>=</code>.'};
  const sets=[R.d,altData(R,1),altData(R,2),altData(R,3),altData(R,4),altData(R,5)];
  for(let i=0;i<sets.length;i++){
    const P=new Sheet(applyF(Object.assign({},sets[i]),R,f)),Q=new Sheet(applyF(Object.assign({},sets[i]),R,R.sol));
    for(const a of cmpAddrs(R)){let pv,qv;
      try{pv=P.get(a)}catch(e){pv=isErr(e)?e:XErr('#NAME?')}try{qv=Q.get(a)}catch(e){qv=XErr('#VALUE!')}
      if(isErr(pv)){const x=ERRX[pv.err]||'';return{ok:false,msg:`<b>Excel returned ${pv.err}${i?' when the data changed':''}.</b>${x}`}}
      if(!valEq(pv,qv))return i===0?{ok:false,msg:`<b>Wrong result${R.tgtR?' in '+a:''}.</b>Your formula returned <span class="cd">${esc(showVal(pv))}</span>. The ledger needs <span class="cd">${esc(showVal(qv))}</span>.${(typeof pv!==typeof qv&&String(showVal(pv)).toLowerCase()===String(showVal(qv)).toLowerCase())?` <b style="display:inline">They look identical but differ in type:</b> yours is ${typeof pv==='string'?'<b style="display:inline">text</b> (anything inside quotes is text)':typeof pv} and the ledger needs a real ${typeof qv==='boolean'?'logical value':typeof qv==='number'?'number':typeof qv}. Remove the quotes around it.`:''}`}
        :{ok:false,msg:`<b>Right today, wrong tomorrow.</b>Your formula matched on this ledger, but when I changed the numbers it returned <span class="cd">${esc(showVal(pv))}</span> where <span class="cd">${esc(showVal(qv))}</span> was needed. Reference cells instead of typing values, and make sure the logic covers every case.`}}}
  return{ok:true,msg:'<b>Correct.</b>It holds up even when the data changes.'}}
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function normA(s){return String(s).trim().replace(/^"|"$/g,'').toLowerCase().replace(/\s+/g,' ')}
function checkPred(R,v){const exp=R.ans!==undefined?R.ans:new Sheet(R.d).get(R.tgt);const e=showVal(exp);const g=String(v).trim();
  if(g==='')return{ok:false,msg:'<b>No answer.</b>Type what you think the cell shows.'};
  const ok=(!isNaN(Number(g))&&typeof exp==='number')?Math.abs(Number(g)-exp)<1e-6:normA(g)===normA(e);
  return ok?{ok:true,msg:`<b>Correct.</b>The cell shows <span class="cd">${esc(e)}</span>.`}:{ok:false,msg:`<b>Not what Excel shows.</b>You said <span class="cd">${esc(g)}</span>. Trace the formula step by step, evaluating the inside first.`}}
