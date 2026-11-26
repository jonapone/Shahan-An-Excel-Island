/* ===== Mini Excel engine: core ===== */
const XErr=(c)=>({err:c});
const isErr=v=>v&&typeof v==='object'&&!Array.isArray(v)&&'err' in v;
const isArr=Array.isArray;
function colN(s){let n=0;for(const ch of s)n=n*26+ch.charCodeAt(0)-64;return n}
function colL(n){let s='';while(n>0){const m=(n-1)%26;s=String.fromCharCode(65+m)+s;n=(n-m-1)/26|0}return s}
function parseRef(r){const m=/^\$?([A-Z]{1,3})\$?(\d+)$/.exec(r);return m?{c:colN(m[1]),r:+m[2]}:null}

function tokenize(src){
  const t=[];let i=0;
  while(i<src.length){
    const ch=src[i];
    if(/\s/.test(ch)){i++;continue}
    if(ch==='"'){let j=i+1,s='';while(j<src.length){if(src[j]==='"'){if(src[j+1]==='"'){s+='"';j+=2;continue}break}s+=src[j++]}if(j>=src.length)throw XErr('#NAME?');t.push({t:'s',v:s});i=j+1;continue}
    let m;
    if((m=/^\d+\.?\d*(?:[eE][+-]?\d+)?|^\.\d+/.exec(src.slice(i)))){t.push({t:'n',v:parseFloat(m[0])});i+=m[0].length;continue}
    if((m=/^#(?:N\/A|DIV\/0!|VALUE!|REF!|NAME\?|NUM!|NULL!|SPILL!)/.exec(src.slice(i)))){t.push({t:'e',v:m[0]});i+=m[0].length;continue}
    if((m=/^\$?[A-Za-z]{1,3}\$?\d+(?::\$?[A-Za-z]{1,3}\$?\d+)?(?![A-Za-z0-9_.(])/.exec(src.slice(i)))){t.push({t:'ref',v:m[0].toUpperCase().replace(/\$/g,'')});i+=m[0].length;continue}
    if((m=/^[A-Za-z_][A-Za-z0-9_.]*/.exec(src.slice(i)))){t.push({t:'id',v:m[0]});i+=m[0].length;continue}
    if((m=/^(<>|<=|>=)/.exec(src.slice(i)))){t.push({t:'op',v:m[0]});i+=2;continue}
    if('+-*/^&=<>%(),:{};'.includes(ch)){t.push({t:'op',v:ch});i++;continue}
    throw XErr('#NAME?');
  }
  return t;
}
function parse(src){
  const tk=tokenize(src);let p=0;
  const pk=()=>tk[p],nx=()=>tk[p++];
  const isOp=v=>pk()&&pk().t==='op'&&pk().v===v;
  function cmp(){let l=cat();while(pk()&&pk().t==='op'&&['=','<>','<','>','<=','>='].includes(pk().v)){const o=nx().v;l={k:'bin',o,l,r:cat()}}return l}
  function cat(){let l=add();while(isOp('&')){nx();l={k:'bin',o:'&',l,r:add()}}return l}
  function add(){let l=mul();while(isOp('+')||isOp('-')){const o=nx().v;l={k:'bin',o,l,r:mul()}}return l}
  function mul(){let l=pow();while(isOp('*')||isOp('/')){const o=nx().v;l={k:'bin',o,l,r:pow()}}return l}
  function pow(){let l=un();while(isOp('^')){nx();l={k:'bin',o:'^',l,r:un()}}return l}
  function un(){if(isOp('-')){nx();return{k:'neg',x:un()}}if(isOp('+')){nx();return un()}return pct()}
  function pct(){let x=prim();while(isOp('%')){nx();x={k:'bin',o:'/',l:x,r:{k:'num',v:100}}}return x}
  function prim(){
    const t=nx();if(!t)throw XErr('#NAME?');
    if(t.t==='n')return{k:'num',v:t.v};
    if(t.t==='s')return{k:'str',v:t.v};
    if(t.t==='e')return{k:'err',v:t.v};
    if(t.t==='ref')return{k:'ref',v:t.v};
    if(t.t==='op'&&t.v==='('){const e=cmp();if(!isOp(')'))throw XErr('#NAME?');nx();return e}
    if(t.t==='op'&&t.v==='{'){const rows=[[]];while(true){rows[rows.length-1].push(cmp());if(isOp(','))nx();else if(isOp(';')){nx();rows.push([])}else break}if(!isOp('}'))throw XErr('#NAME?');nx();return{k:'arr',rows}}
    if(t.t==='id'){
      const u=t.v.toUpperCase();
      if(isOp('(')){nx();const args=[];if(isOp(')')){nx();return{k:'fn',n:u,a:args}}
        while(true){if(isOp(',')||isOp(')'))args.push({k:'blank'});else args.push(cmp());if(isOp(',')){nx();continue}if(isOp(')')){nx();break}throw XErr('#NAME?')}
        return{k:'fn',n:u,a:args}}
      if(u==='TRUE')return{k:'bool',v:true};if(u==='FALSE')return{k:'bool',v:false};
      return{k:'name',v:t.v};
    }
    throw XErr('#NAME?');
  }
  const ast=cmp();if(p<tk.length)throw XErr('#NAME?');return ast;
}
/* ---- value helpers ---- */
function toNum(v){if(isErr(v))throw v;if(v===null||v===undefined||v==='')return 0;if(typeof v==='number')return v;if(typeof v==='boolean')return v?1:0;
  if(typeof v==='string'){const s=v.trim();if(s!==''&&!isNaN(Number(s)))return Number(s);if(/^-?\d+(\.\d+)?%$/.test(s))return parseFloat(s)/100;throw XErr('#VALUE!')}
  if(isArr(v))return toNum(v[0][0]);throw XErr('#VALUE!')}
function toStr(v){if(isErr(v))throw v;if(v===null||v===undefined)return '';if(typeof v==='boolean')return v?'TRUE':'FALSE';if(typeof v==='number')return fmtNum(v);if(isArr(v))return toStr(v[0][0]);return String(v)}
function fmtNum(n){if(Number.isInteger(n))return String(n);const s=String(+n.toPrecision(12));return s}
function toBool(v){if(isErr(v))throw v;if(typeof v==='boolean')return v;if(typeof v==='number')return v!==0;if(typeof v==='string'){const u=v.toUpperCase();if(u==='TRUE')return true;if(u==='FALSE')return false;throw XErr('#VALUE!')}if(v===null||v==='')return false;throw XErr('#VALUE!')}
function flat(v){if(isArr(v)){const o=[];for(const r of v)for(const c of r)o.push(c);return o}return[v]}
function rank(v){return typeof v==='number'?0:typeof v==='string'?1:typeof v==='boolean'?2:-1}
function cmpVals(a,b){
  if(a===null||a==='')a=(typeof b==='string')?'':0;if(b===null||b==='')b=(typeof a==='string')?'':0;
  const ra=rank(a),rb=rank(b);if(ra!==rb)return ra-rb;
  if(typeof a==='string')return a.toLowerCase()<b.toLowerCase()?-1:a.toLowerCase()>b.toLowerCase()?1:0;
  return a<b?-1:a>b?1:0}
function bcast(a,b,f){
  if(!isArr(a)&&!isArr(b))return f(a,b);
  const A=isArr(a)?a:[[a]],B=isArr(b)?b:[[b]];
  const R=Math.max(A.length,B.length),C=Math.max(A[0].length,B[0].length);const out=[];
  for(let i=0;i<R;i++){const row=[];for(let j=0;j<C;j++){
    const x=A.length===1?A[0][j%A[0].length]:A[i%A.length][A[0].length===1?0:j%A[0].length];
    const y=B.length===1?B[0][j%B[0].length]:B[i%B.length][B[0].length===1?0:j%B[0].length];
    row.push(f(x,y))}out.push(row)}
  return out}
function binop(o,x,y){
  try{
    if(isErr(x))return x;if(isErr(y))return y;
    switch(o){
      case '+':return toNum(x)+toNum(y);case '-':return toNum(x)-toNum(y);case '*':return toNum(x)*toNum(y);
      case '/':{const d=toNum(y);if(d===0)return XErr('#DIV/0!');return toNum(x)/d}
      case '^':{const r=Math.pow(toNum(x),toNum(y));return isFinite(r)?r:XErr('#NUM!')}
      case '&':return toStr(x)+toStr(y);
      case '=':return cmpVals(x,y)===0;case '<>':return cmpVals(x,y)!==0;
      case '<':return cmpVals(x,y)<0;case '>':return cmpVals(x,y)>0;case '<=':return cmpVals(x,y)<=0;case '>=':return cmpVals(x,y)>=0;
    }}catch(e){if(isErr(e))return e;throw e}
}
