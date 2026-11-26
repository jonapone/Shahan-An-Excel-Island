/* ===== Mini Excel engine: sheet + evaluator ===== */
class Sheet{
  constructor(cells){this.raw={};this.cache={};this.sp={};this.busy={};this.all=false;
    for(const k in cells){this.raw[k.toUpperCase()]=cells[k]}}
  set(a,v){this.raw[a]=v;this.reset()}
  reset(){this.cache={};this.sp={};this.busy={};this.all=false}
  isF(v){return typeof v==='string'&&v[0]==='='&&v.length>1}
  get(a){
    const r=this.raw[a];
    if(this.isF(r))return this.evalCell(a);
    if(r!==undefined&&r!==null)return r;
    if(!this.all){this.all=true;for(const k in this.raw)if(this.isF(this.raw[k]))this.evalCell(k)}
    return this.sp[a]!==undefined?this.sp[a]:null}
  evalCell(a){
    if(a in this.cache)return this.cache[a];
    if(this.busy[a])return XErr('#REF!');
    this.busy[a]=1;let v;
    try{const ast=parse(this.raw[a].slice(1));v=this.ev(ast,{})}catch(e){if(isErr(e))v=e;else throw e}
    delete this.busy[a];
    if(isArr(v)){const p=parseRef(a);const R=v.length,C=v[0].length;
      for(let i=0;i<R;i++)for(let j=0;j<C;j++){if(i||j){const k=colL(p.c+j)+(p.r+i);if(this.raw[k]!==undefined&&this.raw[k]!==null){this.cache[a]=XErr('#SPILL!');return this.cache[a]}}}
      for(let i=0;i<R;i++)for(let j=0;j<C;j++){if(i||j)this.sp[colL(p.c+j)+(p.r+i)]=v[i][j]}
      v=v[0][0]===undefined?null:v[0][0]}
    this.cache[a]=v;return v}
  range(ref){
    const [a,b]=ref.split(':');const p=parseRef(a),q=b?parseRef(b):p;
    if(!p||!q)throw XErr('#REF!');
    const out=[];for(let r=Math.min(p.r,q.r);r<=Math.max(p.r,q.r);r++){const row=[];for(let c=Math.min(p.c,q.c);c<=Math.max(p.c,q.c);c++)row.push(this.get(colL(c)+r));out.push(row)}
    return out}
  ev(n,env){
    switch(n.k){
      case 'num':case 'str':case 'bool':return n.v;
      case 'blank':return null;
      case 'err':return XErr(n.v);
      case 'ref':{if(n.v.includes(':'))return this.range(n.v);return this.get(n.v)}
      case 'name':{const u=n.v;if(u in env)return env[u];throw XErr('#NAME?')}
      case 'neg':{const x=this.ev(n.x,env);return bcast(x,0,(a,b)=>binop('-',0,a))}
      case 'bin':{const l=this.ev(n.l,env),r=this.ev(n.r,env);return bcast(l,r,(a,b)=>binop(n.o,a,b))}
      case 'arr':return n.rows.map(r=>r.map(c=>this.ev(c,env)));
      case 'fn':return this.call(n,env)}
  }
  call(n,env){
    const F=FN[n.n];if(!F)throw XErr('#NAME?');
    if(F.lazy)return F.f.call(this,n.a,env);
    const args=n.a.map(a=>this.ev(a,env));
    if(LIFT.has(n.n)&&args.some(isArr))return liftCall(F,this,args);
    return F.f.call(this,...args);
  }
}
/* ---- helpers for functions ---- */
const nums=(args,strict)=>{const o=[];for(const a of args){if(isArr(a)){for(const v of flat(a)){if(isErr(v))throw v;if(typeof v==='number')o.push(v)}}else{if(isErr(a))throw a;if(a!==null)o.push(toNum(a))}}return o};
function crit(c){
  if(typeof c==='number'||typeof c==='boolean')return v=>typeof v===typeof c&&v===c||(typeof c==='number'&&typeof v==='string'&&v!==''&&Number(v)===c);
  const s=String(c==null?'':c);const m=/^(<>|<=|>=|=|<|>)?(.*)$/s.exec(s);const op=m[1]||'=',rhs=m[2];
  const isn=rhs.trim()!==''&&!isNaN(Number(rhs));
  return v=>{
    if(isn){if(typeof v!=='number')return op==='<>';const x=Number(rhs);return op==='='?v===x:op==='<>'?v!==x:op==='<'?v<x:op==='>'?v>x:op==='<='?v<=x:v>=x}
    if(op==='='||op==='<>'){let re=null;if(/[*?]/.test(rhs))re=new RegExp('^'+rhs.replace(/[.+^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*').replace(/\?/g,'.')+'$','i');
      const t=v===null?'':String(typeof v==='boolean'?(v?'TRUE':'FALSE'):v);
      const hit=re?re.test(t):t.toLowerCase()===rhs.toLowerCase();return op==='='?hit:!hit}
    if(typeof v!=='string')return false;const a=v.toLowerCase(),b=rhs.toLowerCase();
    return op==='<'?a<b:op==='>'?a>b:op==='<='?a<=b:a>=b}}
function ifsMask(pairs){ // [range,crit,...]
  let mask=null;for(let i=0;i<pairs.length;i+=2){const r=flat(pairs[i]),f=crit(pairs[i+1]);
    const m=r.map(v=>f(v));mask=mask?mask.map((x,j)=>x&&m[j]):m}return mask}
const col=v=>isArr(v)?v:[[v]];
function lookupMatch(x,arr,mode,srch,wild){ // mode 0 exact, 1 <= (largest not above), -1 >= (smallest not below); returns idx or -1
  const a=flat(arr);
  if(mode===0){let re=null;if(wild&&typeof x==='string'&&/[*?]/.test(x))re=new RegExp('^'+x.replace(/[.+^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*').replace(/\?/g,'.')+'$','i');
    const idx=[...a.keys()];if(srch===-1)idx.reverse();
    for(const i of idx){const v=a[i];if(re?(typeof v==='string'&&re.test(v)):(v!==null&&rank(v)===rank(x)&&cmpVals(v,x)===0))return i}return -1}
  let best=-1;for(let i=0;i<a.length;i++){const v=a[i];if(v===null||rank(v)!==rank(x))continue;const c=cmpVals(v,x);
    if(mode===1&&c<=0&&(best<0||cmpVals(v,a[best])>=0))best=i;
    if(mode===-1&&c>=0&&(best<0||cmpVals(v,a[best])<=0))best=i}
  return best}
const LIFT=new Set('ABS INT SQRT POWER MOD ROUND ROUNDUP ROUNDDOWN LEN LEFT RIGHT MID TRIM CLEAN UPPER LOWER PROPER NOT ISNUMBER ISTEXT ISBLANK ISERROR ISNA ISEVEN ISODD VALUE TEXT FIND SEARCH SUBSTITUTE EXACT YEAR MONTH DAY WEEKDAY REPT'.split(' '));
function liftCall(F,self,args){const arrs=args.map(a=>isArr(a)?a:null);const R=Math.max(...arrs.map(a=>a?a.length:1)),C=Math.max(...arrs.map(a=>a?a[0].length:1));const out=[];
  for(let i=0;i<R;i++){const row=[];for(let j=0;j<C;j++){const sc=args.map((a,k)=>{const m=arrs[k];if(!m)return a;return m[m.length===1?0:i%m.length][m[0].length===1?0:j%m[0].length]});
    let v;try{v=F.f.call(self,...sc)}catch(e){v=isErr(e)?e:XErr('#VALUE!')}row.push(v)}out.push(row)}return out}
const FN={};
const def=(names,f,lazy)=>{for(const n of names.split(' '))FN[n]={f,lazy}};
const XE=c=>{throw XErr(c)};
/* math */
def('SUM',(...a)=>nums(a).reduce((x,y)=>x+y,0));
def('AVERAGE',(...a)=>{const n=nums(a);if(!n.length)XE('#DIV/0!');return n.reduce((x,y)=>x+y,0)/n.length});
def('MIN',(...a)=>{const n=nums(a);return n.length?Math.min(...n):0});
def('MAX',(...a)=>{const n=nums(a);return n.length?Math.max(...n):0});
def('MEDIAN',(...a)=>{const n=nums(a).sort((x,y)=>x-y);if(!n.length)XE('#NUM!');const m=n.length>>1;return n.length%2?n[m]:(n[m-1]+n[m])/2});
def('COUNT',(...a)=>{let c=0;for(const x of a)for(const v of flat(x))if(typeof v==='number')c++;return c});
def('COUNTA',(...a)=>{let c=0;for(const x of a)for(const v of flat(x))if(v!==null&&v!=='')c++;return c});
def('COUNTBLANK',(r)=>flat(r).filter(v=>v===null||v==='').length);
def('ABS',x=>Math.abs(toNum(x)));
def('INT',x=>Math.floor(toNum(x)));
def('SQRT',x=>{const n=toNum(x);if(n<0)XE('#NUM!');return Math.sqrt(n)});
def('POWER',(x,y)=>Math.pow(toNum(x),toNum(y)));
def('MOD',(x,y)=>{const a=toNum(x),b=toNum(y);if(b===0)XE('#DIV/0!');return a-b*Math.floor(a/b)});
const rnd=(x,d,f)=>{x=toNum(x);d=d==null?0:toNum(d);const m=Math.pow(10,d);return f(x*m+(f===Math.round?Math.sign(x)*1e-9:0))/m};
def('ROUND',(x,d)=>{x=toNum(x);d=toNum(d);const m=Math.pow(10,d);return Math.sign(x)*Math.round(Math.abs(x)*m+1e-9)/m});
def('ROUNDUP',(x,d)=>{x=toNum(x);d=toNum(d);const m=Math.pow(10,d);return Math.sign(x)*Math.ceil(Math.abs(x)*m-1e-9)/m});
def('ROUNDDOWN',(x,d)=>{x=toNum(x);d=toNum(d);const m=Math.pow(10,d);return Math.sign(x)*Math.floor(Math.abs(x)*m+1e-9)/m});
def('LARGE',(r,k)=>{const n=nums([r]).sort((a,b)=>b-a);k=toNum(k);if(k<1||k>n.length)XE('#NUM!');return n[k-1]});
def('SMALL',(r,k)=>{const n=nums([r]).sort((a,b)=>a-b);k=toNum(k);if(k<1||k>n.length)XE('#NUM!');return n[k-1]});
def('RANK',(x,r,o)=>{const n=nums([r]);x=toNum(x);if(!n.includes(x))XE('#N/A');const asc=o!=null&&toNum(o)!==0;return 1+n.filter(v=>asc?v<x:v>x).length});
def('SUMPRODUCT',(...a)=>{const A=a.map(x=>flat(x));const L=A[0].length;let s=0;for(let i=0;i<L;i++){let p=1;for(const x of A){const v=x[i];if(isErr(v))throw v;p*=typeof v==='number'?v:(typeof v==='boolean'?0:0)}s+=p}return s});
def('SEQUENCE',(r,c,s,st)=>{r=toNum(r);c=c==null?1:toNum(c);s=s==null?1:toNum(s);st=st==null?1:toNum(st);const o=[];let v=s;for(let i=0;i<r;i++){const row=[];for(let j=0;j<c;j++){row.push(v);v+=st}o.push(row)}return o});
/* logic */
def('IF',function(a,env){const c=this.ev(a[0],env);
  if(isArr(c)){const tv=this.ev(a[1],env),fv=a[2]?this.ev(a[2],env):false;
    const w=bcast(c,tv,(x,y)=>({c:x,t:y}));return bcast(w,fv,(o,f)=>{if(isErr(o.c))return o.c;try{return toBool(o.c)?o.t:f}catch(e){return isErr(e)?e:XErr('#VALUE!')}})}
  return toBool(c)?this.ev(a[1],env):(a[2]?this.ev(a[2],env):false)},true);
def('IFS',function(a,env){for(let i=0;i<a.length;i+=2){if(toBool(this.ev(a[i],env)))return this.ev(a[i+1],env)}XE('#N/A')},true);
def('IFERROR',function(a,env){try{const v=this.ev(a[0],env);if(isErr(v))return this.ev(a[1],env);return v}catch(e){if(isErr(e))return this.ev(a[1],env);throw e}},true);
def('IFNA',function(a,env){try{const v=this.ev(a[0],env);if(isErr(v)&&v.err==='#N/A')return this.ev(a[1],env);return v}catch(e){if(isErr(e)&&e.err==='#N/A')return this.ev(a[1],env);throw e}},true);
def('SWITCH',function(a,env){const x=this.ev(a[0],env);let i=1;for(;i+1<a.length;i+=2){if(cmpVals(x,this.ev(a[i],env))===0)return this.ev(a[i+1],env)}if(i<a.length)return this.ev(a[i],env);XE('#N/A')},true);
def('CHOOSE',function(a,env){const i=toNum(this.ev(a[0],env));if(i<1||i>=a.length)XE('#VALUE!');return this.ev(a[i],env)},true);
def('LET',function(a,env){const e=Object.assign({},env);for(let i=0;i+1<a.length;i+=2){const nm=a[i];if(nm.k!=='name')XE('#NAME?');e[nm.v]=this.ev(a[i+1],e)}return this.ev(a[a.length-1],e)},true);
def('AND',(...a)=>a.flatMap(flat).filter(v=>v!==null&&v!=='').every(v=>toBool(v)));
def('OR',(...a)=>a.flatMap(flat).filter(v=>v!==null&&v!=='').some(v=>toBool(v)));
def('XOR',(...a)=>a.flatMap(flat).filter(v=>v!==null).reduce((x,v)=>x!==toBool(v),false));
def('NOT',x=>!toBool(x));
def('TRUE',()=>true);def('FALSE',()=>false);
def('ISNUMBER',x=>typeof x==='number');def('ISTEXT',x=>typeof x==='string');
def('ISBLANK',x=>x===null);def('ISERROR',x=>isErr(x));def('ISNA',x=>isErr(x)&&x.err==='#N/A');
def('ISEVEN',x=>toNum(x)%2===0);def('ISODD',x=>Math.abs(toNum(x))%2===1);
