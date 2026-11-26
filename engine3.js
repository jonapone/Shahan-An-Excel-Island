/* ===== Mini Excel engine: text, lookup, aggregation, arrays, dates ===== */
/* conditional aggregation */
def('SUMIF',(r,c,s)=>{const R=flat(r),S=s===undefined?R:flat(s),f=crit(c);let t=0;R.forEach((v,i)=>{if(f(v)&&typeof S[i]==='number')t+=S[i]});return t});
def('COUNTIF',(r,c)=>{const f=crit(c);return flat(r).filter(v=>f(v)).length});
def('AVERAGEIF',(r,c,s)=>{const R=flat(r),S=s===undefined?R:flat(s),f=crit(c);let t=0,n=0;R.forEach((v,i)=>{if(f(v)&&typeof S[i]==='number'){t+=S[i];n++}});if(!n)XE('#DIV/0!');return t/n});
def('SUMIFS',(s,...p)=>{const m=ifsMask(p),S=flat(s);let t=0;m.forEach((x,i)=>{if(x&&typeof S[i]==='number')t+=S[i]});return t});
def('COUNTIFS',(...p)=>ifsMask(p).filter(x=>x).length);
def('AVERAGEIFS',(s,...p)=>{const m=ifsMask(p),S=flat(s);let t=0,n=0;m.forEach((x,i)=>{if(x&&typeof S[i]==='number'){t+=S[i];n++}});if(!n)XE('#DIV/0!');return t/n});
def('MAXIFS',(s,...p)=>{const m=ifsMask(p),S=flat(s);const v=S.filter((x,i)=>m[i]&&typeof x==='number');return v.length?Math.max(...v):0});
def('MINIFS',(s,...p)=>{const m=ifsMask(p),S=flat(s);const v=S.filter((x,i)=>m[i]&&typeof x==='number');return v.length?Math.min(...v):0});
/* lookup */
def('MATCH',(x,r,t)=>{t=t==null?1:toNum(t);const i=lookupMatch(x,r,t===0?0:t,1,true);if(i<0)XE('#N/A');return i+1});
def('XMATCH',(x,r,m,s)=>{m=m==null?0:toNum(m);const i=lookupMatch(x,r,m===2?0:-m,s==null?1:toNum(s),m===2);if(i<0)XE('#N/A');return i+1});
def('INDEX',(a,r,c)=>{a=col(a);r=r==null?0:toNum(r);c=c==null?0:toNum(c);
  if(a.length===1&&c===0&&r>0){c=r;r=1}
  if(r<0||c<0||r>a.length||c>a[0].length)XE('#REF!');
  if(r===0&&c===0)return a;if(r===0)return a.map(x=>[x[c-1]]);if(c===0)return[a[r-1]];
  const v=a[r-1][c-1];return v===null?0:v});
def('VLOOKUP',(x,t,ci,ap)=>{t=col(t);ci=toNum(ci);if(ci<1||ci>t[0].length)XE('#REF!');const exact=ap!=null&&!toBool(ap);
  const i=lookupMatch(x,t.map(r=>[r[0]]),exact?0:1,1,true);if(i<0)XE('#N/A');const v=t[i][ci-1];return v===null?0:v});
def('HLOOKUP',(x,t,ri,ap)=>{t=col(t);ri=toNum(ri);const exact=ap!=null&&!toBool(ap);
  const i=lookupMatch(x,t[0],exact?0:1,1,true);if(i<0)XE('#N/A');const v=t[ri-1][i];return v===null?0:v});
def('XLOOKUP',(x,L,R,nf,mm,sm)=>{L=col(L);R=col(R);const vert=L[0].length===1;
  mm=mm==null?0:toNum(mm);const i=lookupMatch(x,L,mm===2?0:-mm,sm==null?1:toNum(sm),mm===2);
  if(i<0){if(nf!==undefined&&nf!==null)return nf;XE('#N/A')}
  if(vert){return[R[i]]}return R.map(r=>[r[i]])});
def('ROWS',a=>col(a).length);def('COLUMNS',a=>col(a)[0].length);
def('TRANSPOSE',a=>{a=col(a);return a[0].map((_,j)=>a.map(r=>r[j]))});
/* arrays */
def('FILTER',(a,inc,ife)=>{a=col(a);inc=col(inc);const rowsMode=inc[0].length===1&&a.length===inc.length;let out;
  if(rowsMode)out=a.filter((_,i)=>{const v=inc[i][0];if(isErr(v))throw v;return toBool(v)});
  else out=(()=>{const keep=inc[0].map(v=>toBool(v));return a.map(r=>r.filter((_,j)=>keep[j]))})();
  if(!out.length||!out[0].length){if(ife!==undefined)return ife;XE('#CALC!')}return out});
def('SORT',(a,si,so,bc)=>{a=col(a);si=si==null?1:toNum(si);so=so==null?1:toNum(so);const k=si-1;
  return a.map(r=>r).sort((x,y)=>so*cmpVals(x[k],y[k]))});
def('SORTBY',(a,k,o)=>{a=col(a);k=flat(k);o=o==null?1:toNum(o);const idx=a.map((_,i)=>i).sort((x,y)=>o*cmpVals(k[x],k[y]));return idx.map(i=>a[i])});
def('UNIQUE',(a)=>{a=col(a);const seen=new Set(),out=[];for(const r of a){const key=r.map(v=>typeof v+':'+String(v).toLowerCase()).join('|');if(!seen.has(key)){seen.add(key);out.push(r)}}return out});
def('TAKE',(a,n)=>{a=col(a);n=toNum(n);return n>=0?a.slice(0,n):a.slice(n)});
def('HSTACK',(...a)=>{a=a.map(col);return a[0].map((_,i)=>a.flatMap(x=>x[i]))});
def('VSTACK',(...a)=>a.map(col).flat(1));
/* text */
def('LEN',x=>toStr(x).length);
def('LEFT',(x,n)=>toStr(x).slice(0,n==null?1:toNum(n)));
def('RIGHT',(x,n)=>{const s=toStr(x);n=n==null?1:toNum(n);return n===0?'':s.slice(-n)});
def('MID',(x,s,n)=>{s=toNum(s);n=toNum(n);if(s<1)XE('#VALUE!');return toStr(x).substr(s-1,n)});
def('TRIM',x=>toStr(x).trim().replace(/ +/g,' '));
def('CLEAN',x=>toStr(x).replace(/[\x00-\x1f]/g,''));
def('UPPER',x=>toStr(x).toUpperCase());def('LOWER',x=>toStr(x).toLowerCase());
def('PROPER',x=>toStr(x).toLowerCase().replace(/(^|[^a-zà-ÿ])([a-zà-ÿ])/g,(m,a,b)=>a+b.toUpperCase()));
def('CONCAT',(...a)=>a.flatMap(flat).map(toStr).join(''));
def('CONCATENATE',(...a)=>a.flatMap(flat).map(toStr).join(''));
def('TEXTJOIN',(d,ie,...a)=>{let v=a.flatMap(flat);if(toBool(ie))v=v.filter(x=>x!==null&&x!=='');return v.map(toStr).join(toStr(d))});
def('SUBSTITUTE',(t,o,n,k)=>{t=toStr(t);o=toStr(o);n=toStr(n);if(!o)return t;if(k==null)return t.split(o).join(n);k=toNum(k);let c=0,i=-1,out='',pos=0;
  while((i=t.indexOf(o,pos))>=0){c++;out+=t.slice(pos,i)+(c===k?n:o);pos=i+o.length}return out+t.slice(pos)});
def('REPLACE',(t,s,n,x)=>{t=toStr(t);s=toNum(s)-1;return t.slice(0,s)+toStr(x)+t.slice(s+toNum(n))});
def('FIND',(f,t,s)=>{const i=toStr(t).indexOf(toStr(f),s==null?0:toNum(s)-1);if(i<0)XE('#VALUE!');return i+1});
def('SEARCH',(f,t,s)=>{const re=new RegExp(toStr(f).replace(/[.+^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*').replace(/\?/g,'.'),'i');const T=toStr(t),st=s==null?0:toNum(s)-1;const m=re.exec(T.slice(st));if(!m)XE('#VALUE!');return m.index+st+1});
def('EXACT',(a,b)=>toStr(a)===toStr(b));
def('REPT',(x,n)=>toStr(x).repeat(Math.max(0,toNum(n))));
def('VALUE',x=>toNum(x));
def('TEXTBEFORE',(t,d,n,mc,me,ine)=>{t=toStr(t);d=toStr(d);n=n==null?1:toNum(n);let p=-1,from=0;for(let k=0;k<n;k++){p=t.indexOf(d,from);if(p<0){if(ine!==undefined&&ine!==null)return ine;XE('#N/A')}from=p+d.length}return t.slice(0,p)});
def('TEXTAFTER',(t,d,n,mc,me,ine)=>{t=toStr(t);d=toStr(d);n=n==null?1:toNum(n);let p=-1,from=0;for(let k=0;k<n;k++){p=t.indexOf(d,from);if(p<0){if(ine!==undefined&&ine!==null)return ine;XE('#N/A')}from=p+d.length}return t.slice(p+d.length)});
def('TEXTSPLIT',(t,cd,rd)=>{t=toStr(t);const rows=rd!=null?t.split(toStr(rd)):[t];return rows.map(r=>cd!=null?r.split(toStr(cd)):[r])});
def('TEXT',(x,f)=>{f=toStr(f);const n=toNum(x);
  if(/^0+$/.test(f))return String(Math.round(n)).padStart(f.length,'0');
  let m=/^(#,##)?0(\.(0+))?(%)?$/.exec(f);if(m){let v=m[4]?n*100:n;const d=m[3]?m[3].length:0;let s=Math.abs(v).toFixed(d);if(m[1])s=s.replace(/\B(?=(\d{3})+(?!\d))/g,',');return(v<0?'-':'')+s+(m[4]?'%':'')}
  if(/^[dmy\-\/. ]+$/i.test(f))return fmtDate(n,f);return toStr(x)});
/* dates */
const D0=Date.UTC(1899,11,30);
const ser=(y,m,d)=>Math.round((Date.UTC(y,m-1,d)-D0)/864e5);
const dt=n=>new Date(D0+Math.floor(toNum(n))*864e5);
function fmtDate(n,f){const d=dt(n);const Y=d.getUTCFullYear(),M=d.getUTCMonth()+1,D=d.getUTCDate();const mn=['January','February','March','April','May','June','July','August','September','October','November','December'];
  return f.replace(/yyyy|yy|mmmm|mmm|mm|m|dd|d/gi,t=>{t=t.toLowerCase();return t==='yyyy'?Y:t==='yy'?String(Y).slice(2):t==='mmmm'?mn[M-1]:t==='mmm'?mn[M-1].slice(0,3):t==='mm'?String(M).padStart(2,'0'):t==='m'?M:t==='dd'?String(D).padStart(2,'0'):D})}
def('DATE',(y,m,d)=>ser(toNum(y),toNum(m),toNum(d)));
def('YEAR',x=>dt(x).getUTCFullYear());def('MONTH',x=>dt(x).getUTCMonth()+1);def('DAY',x=>dt(x).getUTCDate());
def('WEEKDAY',(x,t)=>{const w=dt(x).getUTCDay();return t!=null&&toNum(t)===2?(w===0?7:w):w+1});
def('EDATE',(x,m)=>{const d=dt(x);return ser(d.getUTCFullYear(),d.getUTCMonth()+1+toNum(m),d.getUTCDate())});
def('DATEDIF',(a,b,u)=>{const x=dt(a),y=dt(b);u=toStr(u).toUpperCase();if(u==='D')return toNum(b)-toNum(a);
  let m=(y.getUTCFullYear()-x.getUTCFullYear())*12+y.getUTCMonth()-x.getUTCMonth();if(y.getUTCDate()<x.getUTCDate())m--;return u==='M'?m:Math.floor(m/12)});
def('ROW',()=>1);def('COLUMN',()=>1);
/* ---- public API ---- */
function runFormula(cells,addr){const s=new Sheet(cells);return s.get(addr)}
function showVal(v){if(v===null||v===undefined)return '';if(isErr(v))return v.err;if(typeof v==='number')return fmtNum(v);if(typeof v==='boolean')return v?'TRUE':'FALSE';return String(v)}
function valEq(a,b){if(isErr(a)||isErr(b))return isErr(a)&&isErr(b)&&a.err===b.err;if(a===null)a='';if(b===null)b='';
  if(typeof a==='number'&&typeof b==='number')return Math.abs(a-b)<1e-6*Math.max(1,Math.abs(b));return typeof a===typeof b&&String(a)===String(b)}
