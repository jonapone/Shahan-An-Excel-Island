const fs=require('fs');
const files=process.argv.length>2?process.argv.slice(2):['c1.js','c2.js','c3.js','c4.js','c6a.js','c6b.js','c7.js','c9.js'];
const here=__dirname,rd=f=>fs.readFileSync(require('path').join(here,f),'utf8');
let code=rd('engine1.js')+rd('engine2.js')+rd('engine3.js')+rd('g2.js').replace(/function seeded[^\n]*\n/,'function seeded(str){let h=2166136261;for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}let a=h>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}\n');
code+='\n'+files.map(rd).join('\n');
code+=`
let bad=0,n=0;
for(const s of STOPS)for(const R of s.rounds){n++;const id=R.id||R.q;
 if(R.ty==='f'||R.ty==='dbg'){const r=checkFormula(R,R.sol);if(!r.ok){bad++;console.log('SOL FAIL',id,r.msg)}
   if(R.pre){const q=checkFormula(R,R.pre);if(q.ok){bad++;console.log('PRE PASSES (should be broken)',id)}}
   if(R.ty==='f'&&!R.pre){/* check hardcode fails */const P=new Sheet(applyF(Object.assign({},R.d),R,R.sol));const v=P.get(targets(R)[0]);const lit='='+(typeof v==='number'?v:JSON.stringify(v));if(targets(R).length===1){const q=checkFormula(R,lit);if(q.ok){bad++;console.log('HARDCODE PASSES',id)}}}}
 else if(R.ty==='pred'){const v=new Sheet(R.d).get(R.tgt);console.log('pred',id,'=',showVal(v))}
 else if(R.ty==='pick'||R.ty==='code'&&R.opts){if(R.ans>=R.opts.length)console.log('BAD ANS',id)}
 if(R.ty==='pick'){/* evaluate options on d */const rs=R.opts.map(o=>{try{const sh=new Sheet(Object.assign({},R.d,{[R.tgt]:o}));return showVal(sh.get(R.tgt))}catch(e){return 'ERR'}});console.log('pick',id,rs.join(' | '),'ans',R.ans)}
}
console.log('rounds',n,'bad',bad);
`;
const out=require('path').join(require('os').tmpdir(),'chk_run.js');fs.writeFileSync(out,code.replace(/const E=/,'const E_='));
const r=require('child_process').spawnSync(process.execPath,[out],{stdio:'inherit'});process.exit(r.status||0);
