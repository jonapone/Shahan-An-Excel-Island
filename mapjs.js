const MW=1200,MH=840,OFF=30,W=1260,H=900,NS='http://www.w3.org/2000/svg',LG=.3;
const svg=document.getElementById('map');
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
const mix=(a,b,t)=>'#'+hx(a).map((v,i)=>Math.round(v+(hx(b)[i]-v)*t).toString(16).padStart(2,'0')).join('');
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let T,R;
const BASE_C={trunk:'#7a5230'};
const THEMES=[{id:'aged',name:'Aged Atlas',kind:'story',seed:7,font:"'Fondamento','Palatino Linotype',Georgia,serif",
 bg:'#2a2018',sea:['#58848c','#27474f'],ink:'#1d130b',text:'#24160b',halo:'#ecdcb8',lw:1.1,cw:2.8,wob:7,route:'#4a2a14',vig:.55,
 land:{h:'#ccd3d4',a:'#78986a',m:'#c9b583',d:'#cf9550'},shallow:'#6fa59c',
 c:{pine:'#2f6b45',oak:'#b9792a',rock:'#8c96a3',snow:'#f2f4f4',roof:'#a8432a',wall:'#e8d9b4',water:'#4f9bb5',leaf:'#5d9a62',gold:'#d9a93a',dune:'#b97d3e',cliff:'#9c5a34'}}];
/* ---------------- DRAWING HELPERS ---------------- */
const L=(w=1)=>`stroke="${T.ink}" stroke-width="${(w*T.lw).toFixed(2)}" stroke-linejoin="round" stroke-linecap="round"`;
const P=(d,f,w=1,x='')=>`<path d="${d}" fill="${f}" ${L(w)} ${x}/>`;
const C=(cx,cy,r,f,w=1)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}" ${L(w)}/>`;
const E=(cx,cy,rx,ry,f,w=1)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" ${L(w)}/>`;
const Rr=(x,y,w,h,f,rx=0,lw=1)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" ${L(lw)}/>`;
const g=(x,y,s,inner,ex='')=>`<g transform="translate(${x} ${y}) scale(${s})" ${ex}>${inner}</g>`;
const gd=(x,y,s,dir,inner)=>`<g transform="translate(${x} ${y}) scale(${s*dir} ${s})">${inner}</g>`;
const tube=(d,col,w)=>`<path d="${d}" fill="none" stroke="${T.ink}" stroke-width="${w+2.4*T.lw}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const eye=(x,y,r=2.2)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${T.ink}" stroke-width=".6"/><circle cx="${x+.4}" cy="${y+.3}" r="${r*.45}" fill="${T.ink}"/>`;
const cloud=(x,y,s=1)=>g(x,y,s,`<ellipse cx="0" cy="0" rx="11" ry="4.5" fill="#fff" ${L(.6)}/><circle cx="-4" cy="-3" r="4.5" fill="#fff" ${L(.6)}/><circle cx="3" cy="-4" r="5.5" fill="#fff" ${L(.6)}/><ellipse cx="0" cy="0" rx="10" ry="3.6" fill="#fff"/>`);
const star4=(x,y,r,f)=>`<path d="M${x},${y-r}Q${x},${y} ${x+r},${y}Q${x},${y} ${x},${y+r}Q${x},${y} ${x-r},${y}Q${x},${y} ${x},${y-r}Z" fill="${f}"/>`;

/* ---------------- ICONS ---------------- */
const IC={
mount:(x,y,s=1)=>g(x,y,s,P('M-22,0L-6,-30L4,-16L12,-26L28,0Z',T.c.rock)+P('M-6,-30L-12,-20L-6,-22L-2,-16L2,-21L4,-16Z',T.c.snow,.8)+P('M12,-26L7,-17L12,-19L16,-15L19,-18Z',T.c.snow,.8)),
pine:(x,y,s=1)=>g(x,y,s,Rr(-1.2,0,2.4,5,BASE_C.trunk,0,.6)+P('M-7,1L0,-12L7,1Z',T.c.pine,.8)+P('M-6,-5L0,-17L6,-5Z',T.c.pine,.8)+P('M-2.4,-13.6L0,-17L2.4,-13.6Z',T.c.snow,.3)),
oak:(x,y,s=1)=>g(x,y,s,P('M-4,4Q-3,-4-6,-10L6,-10Q3,-4,4,4Z',BASE_C.trunk,.8)+C(-9,-14,8,T.c.oak,.8)+C(9,-14,8,T.c.oak,.8)+C(0,-22,10,T.c.oak,.8)+C(0,-12,8,T.c.oak,.8)),
tree:(x,y,s=1)=>g(x,y,s,Rr(-1,0,2,5,BASE_C.trunk,0,.5)+C(0,-4,5.5,T.c.leaf,.7)),
cactus:(x,y,s=1)=>g(x,y,s,Rr(-9,-9,4,9,T.c.leaf,2,.7)+Rr(-9,-3,8,3.4,T.c.leaf,1.6,.6)+Rr(5,-12,4,10,T.c.leaf,2,.7)+Rr(1,-5,8,3.4,T.c.leaf,1.6,.6)+Rr(-2.8,-16,5.6,20,T.c.leaf,2.8,.8)),
dune:(x,y,s=1)=>g(x,y,s,P('M-18,0Q-8,-12,2,-4Q10,-10,20,0Z',T.c.dune,.7)),
palm:(x,y,s=1)=>g(x,y,s,`<path d="M0,5Q3,-5,-1,-14" fill="none" stroke="${BASE_C.trunk}" stroke-width="2.6" stroke-linecap="round"/>`+['M-1,-14Q-9,-21,-15,-12Q-8,-15,-1,-14Z','M-1,-14Q7,-22,15,-13Q8,-15,-1,-14Z','M-1,-14Q-4,-24,-12,-24Q-6,-19,-1,-14Z','M-1,-14Q4,-24,12,-23Q6,-19,-1,-14Z'].map(d=>P(d,T.c.leaf,.6)).join('')),
cypress:(x,y,s=1)=>g(x,y,s,Rr(-.8,0,1.6,4,BASE_C.trunk,0,.4)+E(0,-8,3.4,11,T.c.pine,.8)),
olive:(x,y,s=1)=>g(x,y,s,Rr(-1,0,2,5,BASE_C.trunk,0,.5)+E(0,-4,7,5,mix(T.c.leaf,'#c9d89a',.4),.7)),
house:(x,y,s=1,w,r)=>g(x,y,s,Rr(-5,-6,10,8,w||T.c.wall,0,.8)+P('M-7,-6L0,-13L7,-6Z',r||T.c.roof,.8)+Rr(-1.2,-2,2.4,4,BASE_C.trunk,0,.5)),
willow:(x,y,s=1)=>g(x,y,s,P('M-6,8Q-5,-6,-12,-18L12,-18Q5,-6,6,8Z',BASE_C.trunk,1)+E(0,-28,28,15,T.c.leaf,1)+[-22,-11,0,11,22].map(i=>`<path d="M${i},-22Q${i+2},-10,${i-1},0" fill="none" stroke="${T.c.leaf}" stroke-width="3.2" stroke-linecap="round"/>`).join('')+IC.house(-13,-30,.8)+IC.house(10,-33,.8)+IC.house(-1,-20,.7)),
isle:(x,y,s=1)=>IC.house(x,y,s),
temple:(x,y,s=1)=>g(x,y,s,Rr(-17,2,34,3.2,T.c.wall,0,.8)+[-12,-4,4,12].map(c=>Rr(c-1.7,-8,3.4,10,T.c.wall,0,.7)).join('')+Rr(-16,-11,32,3.2,T.c.wall,0,.8)+P('M-17,-11L0,-22L17,-11Z',T.c.roof,.8)+C(0,-15,2.2,T.c.gold,.5)),
olympus:(x,y,s=1)=>g(x,y,s,P('M-44,0L-14,-50L0,-36L14,-56L46,0Z',T.c.rock)+P('M14,-56L6,-42L14,-45L20,-38L26,-45Z',T.c.snow,.8)+P('M-14,-50L-22,-36L-14,-39L-8,-33L-4,-40Z',T.c.snow,.8)+IC.temple(1,-34,.75)+cloud(-30,-28,1.1)+cloud(30,-20,1)+cloud(0,-6,1.2)),
meteora:(x,y,s=1)=>g(x,y,s,[[-20,2,7,32],[-6,6,6,42],[9,2,8,36],[22,7,5,24]].map(([cx,by,w,h])=>P(`M${cx-w},${by}Q${cx-w+1},${by-h*.7},${cx-w*.6},${by-h}H${cx+w*.6}Q${cx+w-1},${by-h*.7},${cx+w},${by}Z`,T.c.rock)+IC.house(cx,by-h-2,.7,T.c.wall,T.c.roof)).join('')+cloud(-14,-18,.8)),
athens:(x,y,s=1)=>g(x,y,s,P('M-28,5Q-20,-12,0,-12Q20,-12,28,5Z',T.c.rock)+IC.temple(0,-12,.95)+IC.house(-24,10,.55)+IC.house(-14,12,.55)+IC.house(14,12,.55)+IC.house(24,10,.55)+IC.house(0,14,.55)),
olympia:(x,y,s=1)=>g(x,y,s,E(0,0,24,11,T.c.dune,1)+E(0,0,15,5.5,T.land.m,.7)+IC.temple(20,-8,.62)+IC.temple(-20,-8,.5)),
sparta:(x,y,s=1)=>g(x,y,s,Rr(-20,-9,40,17,T.c.wall,0,1)+[-18,-10,-2,6,14].map(i=>Rr(i,-12,4,3.5,T.c.wall,0,.6)).join('')+Rr(-24,-18,10,26,T.c.wall,0,1)+Rr(14,-18,10,26,T.c.wall,0,1)+P('M-26,-18L-19,-27L-12,-18Z',T.c.roof,.8)+P('M12,-18L19,-27L26,-18Z',T.c.roof,.8)+Rr(-4,-2,8,10,BASE_C.trunk,3,.7)+`<path d="M-8,-5L8,-14M8,-5L-8,-14" stroke="${T.c.roof}" stroke-width="1.6"/>`),
elf:(x,y,s=1)=>{const lt=(a,b,k)=>g(a,b,k,Rr(-2,-10,4,10,T.c.wall,0,.7)+P('M-4.5,-10Q0,-26,4.5,-10Z',T.c.leaf,.8)+C(0,-5,1.2,T.c.gold,0));return g(x,y,s,P('M-38,3Q-33,-28,-12,-34L12,-34Q33,-28,38,3Z',T.c.rock)+P('M-6,-34L6,-34L8,0L-8,0Z',T.c.water,.8)+`<path d="M-2,-32V-2M2,-32V-2" stroke="#fff" stroke-width="1" opacity=".8"/>`+lt(-24,-8,1.1)+lt(24,-8,1.1)+lt(-12,-18,1)+lt(12,-18,1)+lt(0,-14,1.5)+`<path d="M-24,-10Q0,-24,24,-10" fill="none" ${L(.7)}/>`+E(0,3,16,4,T.c.water,.7)+cloud(-30,-36,.8)+cloud(28,-38,.7))},
fall:(x,y,s=1)=>{const tw=(a,b,k,h=14)=>g(a,b,k,Rr(-4,-h,8,h,T.c.wall,0,.8)+P(`M-5,${-h}Q0,${-h-10},5,${-h}Z`,T.c.roof,.8));return g(x,y,s,P('M-52,-2L-48,-42L-14,-50L18,-46L50,-42L54,-2Z',T.c.cliff,1.1)+P('M-52,-2L-48,-42L-34,-44L-38,-2Z',mix(T.c.cliff,'#000',.15),.6)+P('M-9,-47L9,-47L13,-3L-13,-3Z',T.c.water,.9)+`<path d="M-4,-45L-5,-5M2,-45L3,-5M6,-45L8,-5" stroke="#fff" stroke-width="1.6" opacity=".9"/>`+E(0,6,40,14,'#ffffffaa',0)+E(0,7,36,12,T.c.water,1)+E(0,7,14,5,T.c.wall,.8)+tw(0,5,.6,8)+tw(-42,-16,.9,16)+tw(-32,-22,.8,12)+tw(42,-16,.9,16)+tw(32,-22,.8,12)+tw(-30,10,.9,12)+tw(30,10,.9,12)+tw(-18,18,.8,10)+tw(18,18,.8,10)+tw(0,22,.9,12)+tw(-22,-3,.7,10)+tw(22,-3,.7,10))},
oasis:(x,y,s=1)=>g(x,y,s,E(0,1,22,11,T.c.leaf,0)+E(0,0,16,8,T.c.water,1)+IC.palm(-14,-2,.9)+IC.palm(12,-3,.8)+IC.palm(2,-9,.7)),
spa:(x,y,s=1)=>g(x,y,s,E(0,0,15,7,T.c.water,1)+E(0,-1,9,3.4,'#fff',.4)+[-5,3].map(i=>`<path d="M${i},-6Q${i-4},-12,${i},-16Q${i+4},-20,${i},-24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".9"/>`).join('')+IC.pine(-18,3,.7)+IC.pine(18,4,.7)),
peak:(x,y,s=1)=>g(x,y,s,P('M-34,0L-8,-58L6,-40L18,-62L44,0Z',T.c.rock)+P('M18,-62L10,-46L18,-49L24,-42L30,-48Z',T.c.snow,.9)+P('M-8,-58L-16,-42L-8,-45L-2,-38L2,-46Z',T.c.snow,.9)),
grove:(x,y,s=1)=>g(x,y,s,IC.oak(-18,2,1)+IC.oak(18,2,1)+IC.oak(0,8,1.4)),
turtle:(x,y,s=1,dir=1)=>gd(x,y,s,dir,Rr(-14,0,6,7,'#f1ead6',2,.8)+Rr(8,0,6,7,'#f1ead6',2,.8)+E(21,-3,6.5,4.6,'#f1ead6',.8)+eye(23,-4.5,1.4)+P('M-18,3Q-18,-15,0,-15Q18,-15,18,3Z','#ffffff',1)+`<path d="M-9,-13L-5,-4L5,-4L9,-13M-5,-4L-10,3M5,-4L10,3" fill="none" stroke="${T.c.water}" stroke-width="1" />`+C(0,-26,3,'#ffd6b0',.7)+Rr(-9,-21,18,7,T.c.roof,2,.8)+P('M-13,-21Q0,-36,13,-21Z',T.c.gold,.8)+`<path d="M-11,-21V-15M11,-21V-15" ${L(.6)}/>`),
fishi:(col,rider=true,dir=1)=>P('M-13,0L-23,-8Q-19,0,-23,8Z',col,.8)+P('M-14,0Q-4,-10,10,-3Q15,0,10,3Q-4,10,-14,0Z',col,.9)+P('M-3,-6Q2,-13,7,-5Z',mix(col,'#fff',.3),.7)+`<path d="M-6,-2Q-3,0,-6,3M-1,-4Q2,0,-1,4" fill="none" stroke="${T.ink}" stroke-width=".6" opacity=".6"/>`+eye(9,-1,1.6)+(rider?C(-1,-14,3,'#ffd6b0',.7)+P('M-4.5,-10Q-1,-14,3,-10L2,-5H-3Z',T.c.roof,.7):''),
fish:(x,y,s=1,dir=1,col='#ff9f43')=>gd(x,y,s,dir,IC.fishi(col)),
pike:(x,y,s=1)=>gd(x,y,s,1,IC.fishi('#4b8f5c',false)+P('M12,-1L15,-4L13,1Z','#fff',.4)+P('M12,2L15,3L11,0Z','#fff',.4)),
ship:(x,y,s=1,dir=1)=>gd(x,y,s,dir,P('M-11,0L11,0L7,5H-7Z','#8a5a3a',.8)+`<path d="M0,0V-18" ${L(.9)}/>`+P('M1,-17L1,-2L11,-3Z','#fff',.7)+P('M-1,-14L-1,-2L-8,-3Z',T.c.roof,.7)),
pegasus:(x,y,s=1)=>g(x,y,s,P('M-6,-3Q-18,-22,-4,-16Q-8,-8,2,-3Z','#fff',.7)+E(0,0,10,5,'#fff',.8)+P('M7,-2L13,-10L17,-8L13,0Z','#fff',.8)+`<path d="M-9,0Q-15,4,-13,9M-3,4V10M4,4V10" fill="none" ${L(.8)}/>`+P('M-8,-12Q-2,-20,6,-10Q0,-12,-8,-12Z','#fff',.6)+eye(14,-7,1)),
satyr:(x,y,s=1)=>g(x,y,s,`<path d="M-2,2L-3,8M2,2L3,8" ${L(1)} fill="none"/>`+E(0,-2,4.2,5.5,'#c99060',.7)+C(0,-10,3.4,'#e0ac7e',.7)+`<path d="M-2.4,-12.5Q-5,-16,-2,-17M2.4,-12.5Q5,-16,2,-17" fill="none" ${L(.8)}/>`+`<path d="M3,-4L8,-9" ${L(.8)} fill="none"/>`),
nymph:(x,y,s=1)=>g(x,y,s,P('M-3.4,2L0,-8L3.4,2Z',T.c.water,.7)+C(0,-11,3,'#ffd6b0',.7)+P('M-3,-12Q0,-17,3,-12Q0,-14,-3,-12Z',T.c.leaf,.6)),
};

/* monsters (centered around 0,0) */
const MON={
kraken:()=>`<g opacity=".55"><ellipse cx="0" cy="19" rx="31" ry="9" fill="#0a0414"/></g>`+['M-8,2Q-20,4,-16,14Q-13,22,-22,24','M-4,4Q-10,14,-4,19Q1,24,-6,29','M2,4Q4,15,1,20Q-1,26,6,29','M7,3Q14,12,10,19Q7,24,15,27','M11,0Q23,3,19,13Q16,20,24,22','M-11,-1Q-26,-4,-27,6Q-27,12,-31,13'].map((d,i)=>tube(d,i%2?'#3d2266':'#4a2a7a',4.2)).join('')+[[-17,10],[-10,16],[-3,20],[4,21],[11,17],[18,12],[-20,3]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".9" fill="#c9b6ee"/>`).join('')+E(0,-8,14.5,13,'#34195c',1.3)+`<path d="M-9,-16Q0,-22,9,-16M-12,-10Q0,-17,12,-10" fill="none" stroke="#1a0a30" stroke-width="1" opacity=".7"/><ellipse cx="-5.5" cy="-7" rx="3.6" ry="3" fill="#ff3d2e" stroke="${T.ink}" stroke-width=".7"/><ellipse cx="5.5" cy="-7" rx="3.6" ry="3" fill="#ff3d2e" stroke="${T.ink}" stroke-width=".7"/><ellipse cx="-5.5" cy="-7" rx=".9" ry="2.6" fill="#120008"/><ellipse cx="5.5" cy="-7" rx=".9" ry="2.6" fill="#120008"/><path d="M-10,-12L-2,-8M10,-12L2,-8" stroke="${T.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M-5,0L-3,4L-1,0L1,4L3,0L5,4L6,0Z" fill="#efe6cc" stroke="${T.ink}" stroke-width=".7" stroke-linejoin="round"/>`,
serpent:()=>tube('M-24,6Q-20,-10,-14,2Q-8,-12,-2,2Q4,-12,10,0Q14,-14,21,-9','#3fcf8e',5)+C(23,-10,5,'#3fcf8e',1)+eye(24,-12,1.8)+P('M27,-10l5,-2l-3,4z','#ff5d73',.6),
whirl:()=>`<ellipse cx="0" cy="2" rx="35" ry="19" fill="#04101a" opacity=".5"/><g class="spin">`+[19,14,9,5].map((r,i)=>`<ellipse cx="0" cy="0" rx="${r*1.7}" ry="${r*.85}" fill="${i==3?'#02060b':'none'}" stroke="${i%2?'#6cc7d6':T.ink}" stroke-width="2.6" stroke-dasharray="${i*6+14} 6"/>`).join('')+`</g>`+Array.from({length:14},(_,k)=>{const a=k/14*Math.PI*2,x=Math.cos(a)*30,y=Math.sin(a)*15,tx=Math.cos(a)*22,ty=Math.sin(a)*11,nx=-Math.sin(a)*2.6,ny=Math.cos(a)*1.4;return `<path d="M${(x+nx).toFixed(1)},${(y+ny).toFixed(1)}L${tx.toFixed(1)},${ty.toFixed(1)}L${(x-nx).toFixed(1)},${(y-ny).toFixed(1)}Z" fill="#efe6cc" stroke="${T.ink}" stroke-width=".8" stroke-linejoin="round"/>`}).join('')+`<ellipse cx="0" cy="0" rx="6" ry="3" fill="#000"/><ellipse cx="0" cy="0" rx="1.6" ry="1" fill="#ff3d2e"/><path d="M24,-8l9,-14M27,-6l12,-8" stroke="#6b4a2a" stroke-width="2" stroke-linecap="round"/>`,
yeti:()=>E(-12,-2,4,8,'#f4fbff',1)+E(12,-2,4,8,'#f4fbff',1)+E(0,-4,11,13,'#f4fbff',1)+E(0,-9,7,6,'#bfe6ff',.6)+eye(-3,-9.5,2)+eye(3,-9.5,2)+`<path d="M-3,-5Q0,-2,3,-5" fill="none" stroke="${T.ink}" stroke-width=".9"/>`,
wyrm:()=>tube('M-22,8Q-14,-8,-6,4Q2,-12,10,2Q14,-6,20,-8','#7fd3ff',5)+P('M-4,0L-10,-18L2,-9L8,-20L10,-3Z','#e4f6ff',.8)+C(22,-9,5.2,'#7fd3ff',1)+eye(24,-11,1.8)+P('M26,-8l5,0l-3,3z','#fff',.4),
sandworm:()=>tube('M-14,8Q-14,-14,2,-12Q18,-10,18,8','#e0764a',9)+`<path d="M-8,-8L-2,-4M0,-12L4,-6M8,-10L12,-4" stroke="${T.ink}" stroke-width="1" opacity=".5"/>`+C(-14,6,8,'#e0764a',1)+C(-14,6,4.6,'#5a1f1a',.6)+[0,1,2,3].map(i=>P(`M${-17+i*2.4},2l1.4,4l1.4,-4z`,'#fff',.3)).join(''),
mimic:()=>E(0,2,18,9,T.c.water,1.1)+`<path d="M-6,-4L-7,-14M6,-4L7,-14" ${L(1)} fill="none"/>`+eye(-7,-15,3.2)+eye(7,-15,3.2)+P('M-8,3Q0,12,8,3Z','#ff6b81',.6)+[-3,-2,-1,0,1,2,3].map(i=>P(`M${i*4.6-2},-5L${i*4.6},0L${i*4.6+2},-5Z`,'#fff',.4)).join(''),
troll:()=>`<path d="M14,-18L10,6" stroke="${BASE_C.trunk}" stroke-width="4" stroke-linecap="round"/>`+E(0,-2,10,10,'#7bc96f',1)+C(0,-14,7,'#7bc96f',1)+eye(-3,-15,2)+eye(3,-15,2)+P('M-3,-10l-1,4l3,-2z','#fff',.4)+P('M3,-10l1,4l-3,-2z','#fff',.4),
pikeD:()=>IC.pike(0,0,1.5),
hydra:()=>[['M-6,4Q-18,-6,-14,-18',-14,-19],['M0,4Q0,-10,2,-24',2,-25],['M6,4Q18,-6,14,-18',14,-19]].map(([d,x,y])=>tube(d,'#58b86b',4)+C(x,y,4.2,'#58b86b',.9)+eye(x-1.5,y-1,1.3)+eye(x+1.5,y-1,1.3)).join('')+E(0,5,13,7,'#58b86b',1),
siren:()=>`<ellipse cx="0" cy="6" rx="26" ry="13" fill="#7af0c8" opacity=".22"/>`+P('M-19,11L-14,-1L-10,5L-6,-10L-1,3L4,-8L9,5L13,-3L19,11Z','#40455c',1.1)+P('M-6,-10L-4,-4L-8,-3Z','#6b7190',.5)+P('M-8,-5Q-14,6,-6,12L-2,2Z','#10091c',.7)+P('M8,-5Q14,6,6,12L2,2Z','#10091c',.7)+P('M-4,-5Q0,-9,4,-5L5,3Q0,7,-5,3Z','#cfe0da',.8)+C(0,-13,4.4,'#dbe9e3',.8)+P('M-5.5,-15Q-11,-6,-6,3Q-9,-4,-4,-10Z','#10091c',.5)+P('M5.5,-15Q11,-6,6,3Q9,-4,4,-10Z','#10091c',.5)+`<ellipse cx="-1.8" cy="-13.4" rx="1.1" ry="1.5" fill="#05020a"/><ellipse cx="1.8" cy="-13.4" rx="1.1" ry="1.5" fill="#05020a"/><circle cx="-1.8" cy="-13.6" r=".4" fill="#7af0c8"/><circle cx="1.8" cy="-13.6" r=".4" fill="#7af0c8"/><ellipse cx="0" cy="-10.3" rx="1.5" ry="1.9" fill="#240510"/><path d="M-1,-11.4l.5,1.2M1,-11.4l-.5,1.2" stroke="#f5efe0" stroke-width=".5"/><circle cx="-14" cy="9" r="2.4" fill="#e9e1cc" stroke="${T.ink}" stroke-width=".6"/><circle cx="-14.8" cy="8.6" r=".6" fill="#000"/><circle cx="-13.2" cy="8.6" r=".6" fill="#000"/><circle cx="15" cy="10" r="2.2" fill="#e9e1cc" stroke="${T.ink}" stroke-width=".6"/><circle cx="14.2" cy="9.6" r=".55" fill="#000"/><circle cx="15.8" cy="9.6" r=".55" fill="#000"/><text x="9" y="-14" font-size="11" fill="#8fe9d0" stroke="${T.ink}" stroke-width=".6" opacity=".85">♪</text><text x="-18" y="-10" font-size="10" fill="#8fe9d0" stroke="${T.ink}" stroke-width=".6" opacity=".6">♫</text>`
};

const MT=[[400,60],[520,34],[680,40],[800,70],[850,140],[790,205],[680,228],[560,218],[450,202],[380,140]];
const MED=[[760,290],[900,278],[1020,318],[1085,400],[1050,475],[1010,545],[940,590],[890,570],[850,540],[810,500],[775,445],[742,380]];
const DES=[[310,640],[420,615],[560,625],[700,640],[800,680],[770,745],[650,775],[500,780],[370,765],[300,710]];
const ISL=[[110,300,48,34],[210,285,40,28],[300,320,44,30],[80,392,40,32],[170,380,56,40],[275,420,42,30],[120,482,46,32],[215,490,38,26],[310,520,40,28],[60,548,30,22],[160,562,34,22],[345,405,22,16],[35,312,22,16]];
const BRIDGES=[[0,1],[1,2],[0,4],[1,4],[2,5],[3,4],[4,5],[4,6],[6,7],[5,8],[7,8],[6,9],[3,6],[7,10],[2,11]];

const CONS=[
 {pts:[[385,170],[460,200],[440,245],[410,290],[390,340],[330,310],[345,255],[360,200]],a:'h',b:'a',g:[430,190,350,320]},
 {pts:[[760,170],[820,190],[835,250],[810,300],[770,300],[780,240]],a:'h',b:'m',g:[790,190,800,300]},
 {pts:[[330,520],[390,540],[400,600],[420,640],[330,660],[305,610]],a:'a',b:'d',g:[340,520,360,650]},
 {pts:[[840,540],[900,560],[860,620],[820,690],[770,690],[790,630]],a:'m',b:'d',g:[880,550,800,690]}
];
const PLACES=[
{id:'elderglen',c:'h',x:610,y:140,icon:'elf',s:1.1,r:46,name:'Elderglen',type:'Last elven refuge',text:'Leaf-roofed towers and silver falls, beautiful the way a held breath is beautiful. The elves ran out of allies a century ago and kept the hospitality. Guests are welcome. Guests who stay past a season are asked questions.'},
{id:'snoring',c:'h',x:722,y:100,icon:'peak',s:.95,r:40,name:'Greyfang Peak',type:'Killer mountain',text:'The tallest summit in Shahan and its deadliest. Guides charge double for the descent, which tells you what they expect from the climb. The mountain rumbles at night. Nobody has asked what is down there.'},
{id:'oaks',c:'h',x:500,y:155,icon:'grove',s:1.2,r:44,name:'The Elder Oaks',type:'Ancient grove',text:'Trees older than the kingdoms that mapped them. They speak, slowly and without warmth, and they remember every axe. Take only fallen branches.'},
{id:'yetispa',c:'h',x:742,y:176,icon:'spa',s:1.1,r:34,name:'Boiling Springs',type:'Hot springs',text:'Volcanic pools tended by a yeti clan. The water cures frostbite, and the staff collects a toll in teeth. Surprisingly good massages, if you survive the check-in.'},
{id:'wyrm',c:'h',x:808,y:118,k:'danger',m:'wyrm',s:1.1,r:34,lvl:4,name:'Frieda the Frostwyrm',type:'Danger',text:'An ice dragon with a long memory and a short temper. She has razed two elven watchtowers and sent a polite letter about the third.'},
{id:'yetigang',c:'h',x:438,y:172,k:'danger',m:'yeti',s:1.2,r:30,lvl:2,name:'Rimefang Pack',type:'Danger',text:'Yeti raiders who strip travellers of everything, and occasionally of the travellers.'},
{id:'qart',c:'d',x:565,y:700,icon:'fall',s:1.25,r:62,name:'Qart-Mayim, City of Falls',type:'Merchant oligarchy',text:'A Carthage-style city built around a thundering waterfall and a circular harbor-pool at its heart. Water is currency here, and the Council of Hundred counts every drop. Rivals tend to vanish into the harbor.'},
{id:'sipsip',c:'d',x:722,y:702,icon:'oasis',s:1.1,r:34,name:'Well of Whispers',type:'Oasis',text:'A calm oasis where the water carries rumors. Drink, and you may learn who is plotting against you. Everyone drinks.'},
{id:'turtlerest',c:'d',x:440,y:742,icon:'oasis',s:1,r:32,name:'Shellrest Inn',type:'Oasis & inn',text:'Caravans rest here in the shade of their own turtles. Rooms are cheap. Do not ask what happened to the last innkeeper.'},
{id:'palmpocket',c:'d',x:372,y:690,icon:'oasis',s:.9,r:30,name:'Seven Palms',type:'Tiny oasis',text:'Seven palms, one spring and an unwritten rule: no one draws steel here. The rule has held because the last man to test it is buried under the sixth palm.'},
{id:'mimic',c:'d',x:470,y:655,k:'danger',m:'mimic',s:1.2,r:34,lvl:3,name:'Mirage Pond',type:'Danger',text:'A lovely oasis that is, in fact, a mimic. The sign saying FREE WATER is the lure. Dozens of travellers have taken the bait and stayed.'},
{id:'gerald',c:'d',x:660,y:752,k:'danger',m:'sandworm',s:1.2,r:34,lvl:4,name:'Gerald the Sandworm',type:'Danger',text:'The Devourer of Caravans. Locals call him Gerald because a worse name made it feel too real. Punctual, enormous, and always hungry at noon.'},
{id:'willowmoor',c:'a',x:172,y:392,icon:'willow',s:1.05,r:48,name:'Willowmoor',type:'Capital village',text:'Huts hung from an enormous weeping willow, tied by woven branch-bridges to every islet in the reach. The fish-riders gossip here. Gossip is the local currency, and the only one that does not sink.'},
{id:'nettlewick',c:'a',x:112,y:302,icon:'house',s:1.3,r:26,name:'Nettlewick',type:'Village',text:'Famous for nettle wine and for healers who know exactly how much is too much.'},
{id:'bobbin',c:'a',x:210,y:287,icon:'house',s:1.3,r:26,name:'Knotwater',type:"Weavers' village",text:'Every bridge in the reach was knotted here. The weavers hold that a bridge is a promise. They also hold grudges.'},
{id:'gillhaven',c:'a',x:276,y:424,icon:'house',s:1.3,r:26,name:'Gillhaven',type:'Fish stables',text:'Fish-riders train and race their mounts here. They bet on everything, including each other\'s survival.'},
{id:'splashbury',c:'a',x:80,y:395,icon:'house',s:1.3,r:26,name:'Drownwick',type:'Flooded village',text:'Half the village is underwater. The residents say it keeps the tax collectors away.'},
{id:'mossy',c:'a',x:312,y:522,icon:'house',s:1.3,r:26,name:'Mossgrave',type:'Hamlet',text:'A hamlet built over a sunken graveyard. The moss grows thick on the oldest stones, and sometimes the stones move.'},
{id:'kelp',c:'a',x:122,y:484,icon:'house',s:1.3,r:26,name:'Kelp & Knife',type:'Seaweed market',text:'A seaweed and blade market under rope awnings. Smells of salt and bargains made under duress.'},
{id:'trolls',c:'a',x:258,y:306,k:'danger',m:'troll',s:1.2,r:28,lvl:2,name:'Bridge Wardens',type:'Danger',text:'Trolls who toll the bridges: three coins, or a riddle, or an arm. They prefer the arm.'},
{id:'pike',c:'a',x:100,y:440,k:'danger',m:'pikeD',s:1,r:30,lvl:3,name:'Old Longjaw',type:'Danger',text:'A pike the size of a rowboat that has outlived three fishing fleets. He only bites the rude, which covers most travellers.'},
{id:'olympus',c:'m',x:892,y:336,icon:'olympus',s:1.25,r:56,name:'Mount Olympus',type:'Seat of the gods',text:'The gods feast above the clouds and quarrel like spoiled kings. Thunder is usually someone\'s temper. Mortals are not forbidden here. They are simply not left alone.'},
{id:'meteora',c:'m',x:816,y:386,icon:'meteora',s:1.05,r:44,name:'Meteora',type:'Sky libraries',text:'Libraries on stone pillars, tended by cloud nymphs. The elevator is a basket pulled by a satyr who has opinions about his pay.'},
{id:'athens',c:'m',x:986,y:470,icon:'athens',s:1.1,r:50,name:'Athens',type:'City of gods',text:'Immortals who debate everything and settle nothing. The Acropolis is where they judge the lesser divine, usually to exile.'},
{id:'olympia',c:'m',x:838,y:494,icon:'olympia',s:1.1,r:46,name:'Olympia',type:'Games arena',text:'The Games here run eternal: javelin, discus, and a footrace where the loser forfeits something precious. The nymphs bet on the losers.'},
{id:'sparta',c:'m',x:900,y:540,icon:'sparta',s:1.1,r:44,name:'Sparta',type:"War gods' fortress",text:'Walls older than mercy. Every question is answered with one word, usually No.'},
{id:'hydra',c:'m',x:992,y:540,k:'danger',m:'hydra',s:1,r:32,lvl:4,name:'Lernaean Hydra',type:'Danger',text:'Nine heads, nine opinions, zero agreement. Cut one off and two more start arguing about it. Bring fire and a very good reason.'},
{id:'sirens',c:'s',x:1118,y:440,k:'danger',m:'siren',s:1.3,r:34,lvl:3,name:'Siren Rocks',type:'Danger',text:'Beautiful voices, terrible intentions. Ships come for the song and stay for the wreck.'},
{id:'kraken',c:'s',x:620,y:440,k:'danger',m:'kraken',s:1.5,r:44,lvl:5,name:'Kevin the Kraken',type:'Danger',text:'The deepest thing in the Gravewater. His name is Kevin and he would prefer you not say it. His hugs sink ships. His grudges sink fleets.'},
{id:'serpent',c:'s',x:560,y:540,k:'danger',m:'serpent',s:1.4,r:44,lvl:3,name:'The Lamenting Serpent',type:'Danger',text:'Long, loopy and lonely, she follows ships for company and wrecks them with enthusiasm. Her wailing carries for miles.'},
{id:'gurgle',c:'s',x:612,y:322,k:'danger',m:'whirl',s:1.5,r:40,lvl:3,name:'The Gullet',type:'Danger',text:'A whirlpool that swallows ships whole and, rarely, spits up what is left centuries later.'}
];
const ROUTES=[
{id:'r_turtle',c:'d',name:'Great White Caravan Trail',st:'turtle',pts:[[330,702],[372,694],[410,722],[440,740],[500,726],[540,712],[600,728],[660,708],[722,704],[790,694]],carry:[{f:.12,k:'turtle',d:1},{f:.3,k:'turtle',d:1},{f:.62,k:'turtle',d:1},{f:.8,k:'turtle',d:1}]},
{id:'r_fishA',c:'a',name:'Silverfin Current',st:'fish',pts:[[40,445],[130,436],[200,446],[258,458],[340,466],[385,472]],carry:[{f:.18,k:'fish',d:1,col:'#d9822b'},{f:.5,k:'fish',d:1,col:'#4a82c4'},{f:.82,k:'fish',d:1,col:'#c4465c'}]},
{id:'r_fishB',c:'a',name:'Lazy Loop',st:'fish',pts:[[34,342],[100,347],[160,336],[215,334],[262,355],[330,362],[382,346]],carry:[{f:.28,k:'fish',d:1,col:'#2fa58a'},{f:.7,k:'fish',d:1,col:'#d4a62a'}]},
{id:'r_pass',c:'h',name:'Frostbite Pass',st:'trail',pts:[[455,205],[490,182],[540,172],[590,152],[640,142],[690,122],[735,102],[790,92]],carry:[]},
{id:'r_sacred',c:'m',name:'The Sacred Way',st:'sacred',pts:[[838,494],[870,525],[900,540],[950,512],[986,470],[950,404],[915,368],[892,336]],carry:[]},
{id:'r_climb',c:'m',name:'Meteora Climb',st:'sacred',pts:[[892,336],[850,360],[816,388]],carry:[]},
{id:'rd1',c:'h',name:'Widow\'s Road',st:'trail',pts:[[425,205],[405,255],[375,305]],carry:[]},
{id:'rd2',c:'h',name:'The Ashen Road',st:'trail',pts:[[780,195],[800,245],[805,295]],carry:[]},
{id:'rd3',c:'a',name:'Salt Road',st:'trail',pts:[[345,545],[360,600],[375,640]],carry:[]},
{id:'rd4',c:'m',name:'Pilgrim\'s Descent',st:'trail',pts:[[870,555],[835,620],[795,682]],carry:[]},
{id:'l_inner',c:'s',name:'The Gravewater Crossing',st:'lane',pts:[[540,238],[520,320],[508,420],[518,520],[540,612]],carry:[{f:.5,k:'ship',d:1}]},
{id:'l_outer',c:'s',name:"Reaver's Run",st:'lane',pts:[[1100,330],[1132,430],[1115,540],[1060,650],[950,704]],carry:[{f:.72,k:'ship',d:-1}]}
];
const CONT=[
{id:'h',name:'The Hoarfrost Spine',tag:'Mountains · old trees & snow',blurb:'Elven Elderglen, killer peaks, ancient oaks and a very patient dragon.',view:[360,20,520,235],lx:560,ly:262},
{id:'a',name:'The Drowned Reach',tag:'Riverland · archipelagos',blurb:'Branch-bridge villages, fish-riders and things that live below the weave.',view:[0,240,410,370],lx:195,ly:626},
{id:'m',name:'Elysion',tag:'Mediterranean · only gods & divine creatures',blurb:'Athens, Olympia, Olympus, Sparta and Meteora. No mortals. Many grudges.',view:[720,255,400,380],lx:930,ly:634},
{id:'d',name:'The Sunscar',tag:'Desert · oases & the city of falls',blurb:'White turtle caravans, a waterfall oligarchy and a very punctual sandworm.',view:[270,585,560,250],lx:545,ly:820}
];

/* ---------------- EXTRA ICONS ---------------- */
Object.assign(IC,{
tower:(x,y,s=1)=>g(x,y,s,Rr(-5,-24,10,26,T.c.rock,0,.9)+Rr(-6.5,-27,13,4,T.c.rock,0,.8)+P('M-7,-27L0,-38L7,-27Z',T.c.roof,.8)+Rr(-1.4,-18,2.8,5,T.c.gold,1,.5)+Rr(-1.4,-9,2.8,5,'#222',1,.4)),
mine:(x,y,s=1)=>g(x,y,s,P('M-18,3Q-16,-20,0,-22Q16,-20,18,3Z',T.c.rock)+P('M-7,3V-8Q0,-14,7,-8V3Z','#14100c',.8)+`<path d="M-8,-7H8M-6,-1H6" stroke="${BASE_C.trunk}" stroke-width="1.6"/>`+Rr(-9,-9,2,12,BASE_C.trunk,0,.4)+Rr(7,-9,2,12,BASE_C.trunk,0,.4)),
ruin:(x,y,s=1)=>g(x,y,s,Rr(-16,2,32,3,T.c.wall,0,.7)+Rr(-12,-9,4.4,11,T.c.wall,0,.7)+Rr(-3,-16,4.4,18,T.c.wall,0,.7)+Rr(6,-6,4.4,8,T.c.wall,0,.7)+P('M-3.4,-16L-1,-18L1,-16Z',T.c.wall,.5)+C(12,3,2.2,T.c.wall,.5)+C(-17,4,1.6,T.c.wall,.4)),
lighthouse:(x,y,s=1)=>g(x,y,s,`<path d="M4,-28L24,-35M4,-28L24,-21" stroke="${T.c.gold}" stroke-width="2.2" opacity=".55"/>`+P('M-6,3L-3.4,-26L3.4,-26L6,3Z',T.c.wall)+P('M-5,-8L5,-8L4.4,-14L-4.4,-14Z',T.c.roof,.5)+Rr(-4,-31,8,5,T.c.gold,0,.7)+P('M-5,-31L0,-38L5,-31Z',T.c.roof,.7)),
port:(x,y,s=1)=>g(x,y,s,Rr(-20,0,40,3,BASE_C.trunk,0,.7)+[-16,-6,6,16].map(i=>Rr(i-1,-1,2,8,BASE_C.trunk,0,.4)).join('')+IC.ship(-2,-4,.8,1)+Rr(10,-6,6,6,'#9a6a3c',0,.5)+Rr(14,-10,5,5,'#9a6a3c',0,.5)+IC.house(-15,-2,.6)),
oracle:(x,y,s=1)=>g(x,y,s,E(0,2,14,4,T.c.wall,.7)+[-10,-5,0,5,10].map(i=>Rr(i-1,-10,2,12,T.c.wall,0,.5)).join('')+P('M-13,-10Q0,-26,13,-10Z',T.c.gold,.8)+star4(0,-28,6,T.c.gold)),
fort:(x,y,s=1)=>g(x,y,s,Rr(-14,-14,28,16,T.c.rock,0,.9)+[-12,-5,2,9].map(i=>Rr(i,-18,4,4,T.c.rock,0,.6)).join('')+Rr(-4,-8,8,10,'#14100c',3,.6)+`<path d="M12,-18V-31" ${L(.8)}/>`+P('M12,-31L22,-28L12,-25Z',T.c.roof,.6)),
gate:(x,y,s=1)=>g(x,y,s,Rr(-16,-16,9,19,T.c.rock,0,.9)+Rr(7,-16,9,19,T.c.rock,0,.9)+Rr(-8,-10,16,4,T.c.rock,0,.8)+P('M-18,-16L-11.5,-25L-5,-16Z',T.c.roof,.7)+P('M5,-16L11.5,-25L18,-16Z',T.c.roof,.7)),
inn:(x,y,s=1)=>g(x,y,s,IC.house(0,0,1.3)+`<path d="M8,-10V-4" ${L(.6)}/>`+C(8,-3,2.4,T.c.gold,.5)),
camp:(x,y,s=1)=>g(x,y,s,P('M-11,3L-2,-12L7,3Z',T.c.roof,.8)+P('M-2,-12V3',T.c.roof,.5)+P('M10,3Q8,-3,11,-8Q14,-2,13,3Z','#ff9a2a',.5)),
hut:(x,y,s=1)=>g(x,y,s,Rr(-5,-6,10,8,'#6f8f6a',0,.8)+P('M-7,-6Q0,-18,7,-6Z','#3f5d3a',.8)+Rr(-1.5,-4,3,3,T.c.gold,0,.3)+`<path d="M4,-14Q8,-20,3,-24" fill="none" stroke="#d8d2c4" stroke-width="2" opacity=".7"/>`),
reeds:(x,y,s=1)=>g(x,y,s,[-6,-2,2,6].map((i,k)=>`<path d="M${i},3Q${i+2},-6,${i+(k-1.5)*2},-13" fill="none" stroke="${T.c.leaf}" stroke-width="1.5"/><ellipse cx="${i+(k-1.5)*2}" cy="-14" rx="1.2" ry="2.8" fill="${BASE_C.trunk}"/>`).join('')),
ribs:(x,y,s=1)=>g(x,y,s,`<path d="M-18,0H18" stroke="${T.ink}" stroke-width="3.6"/><path d="M-18,0H18" stroke="#efe6d0" stroke-width="2"/>`+[-12,-6,0,6,12].map(i=>tube(`M${i},0Q${i+(i<0?-5:5)},-14,${i*.4},-21`,'#efe6d0',2)).join('')+C(-23,0,3.2,'#efe6d0',.6)),
zig:(x,y,s=1)=>g(x,y,s,P('M-20,3L-15,-5H15L20,3Z',T.c.cliff,.9)+P('M-14,-5L-10,-12H10L14,-5Z',mix(T.c.cliff,'#fff',.15),.9)+P('M-9,-12L-6,-19H6L9,-12Z',mix(T.c.cliff,'#fff',.3),.9)+Rr(-3,-6,6,9,'#14100c',0,.5)),
obelisk:(x,y,s=1)=>g(x,y,s,P('M-3.4,3L-2.2,-26L0,-33L2.2,-26L3.4,3Z','#2a2a33',.8)+`<path d="M-1,-20H1M-1,-14H1M-1,-8H1" stroke="${T.c.gold}" stroke-width="1"/>`+Rr(-6,2,12,3,'#2a2a33',0,.6)),
wreck:(x,y,s=1)=>g(x,y,s,P('M-14,0L14,-3L9,6H-9Z','#6b4a2c',.8)+`<path d="M-2,0L-4,-16" ${L(.9)} fill="none"/>`+P('M-4,-15L-12,-6L-4,-4Z','#d9d2bd',.5)+`<path d="M-16,6Q-8,3,0,7M2,7Q9,4,17,7" stroke="#fff" stroke-width="1" fill="none" opacity=".8"/>`),
hill:(x,y,s=1)=>g(x,y,s,P('M-14,0Q-6,-10,0,-8Q8,-12,16,0Z',mix(T.land.m,'#8a9a5a',.45),.6)),
vine:(x,y,s=1)=>g(x,y,s,[0,1,2,3].map(i=>`<path d="M${-16+i*3},${2+i*3}Q${-6+i*3},${-6+i*3},${6+i*3},${-3+i*3}" fill="none" stroke="#6a8a4a" stroke-width="2.6" stroke-linecap="round"/><path d="M${-14+i*3},${2+i*3}Q${-4+i*3},${-6+i*3},${8+i*3},${-3+i*3}" fill="none" stroke="#7a3a6a" stroke-width="1.2" stroke-dasharray="1.2 2.4"/>`).join('')+IC.olive(14,-4,.8)),
lake:(x,y,s=1)=>g(x,y,s,E(0,0,24,10,'#ffffff',0)+E(0,0,22,9,T.c.water,1.1)+`<path d="M-10,-1q3,-3,6,0t6,0M-4,3q3,-3,6,0t6,0" fill="none" stroke="#fff" stroke-width="1" opacity=".8"/>`+IC.reeds(-22,2,.7)+IC.reeds(22,3,.6)),
saltflat:(x,y,s=1)=>g(x,y,s,P('M-24,2Q-26,-6,-10,-8Q8,-12,22,-5Q28,2,14,7Q-6,10,-24,2Z','#f3ecda',.9)+`<path d="M-12,-3L-4,2L4,-4L12,2M-4,2L-6,6M4,-4L6,-8" stroke="${T.ink}" stroke-width=".6" fill="none" opacity=".5"/>`),
whale:(x,y,s=1,dir=1)=>gd(x,y,s,dir,P('M20,0L33,-9L31,0L33,9Z','#3f5560',.9)+E(0,0,24,9,'#3f5560',1)+E(2,3,18,4,'#9db3ba',0)+eye(-15,-2,1.3)+`<path d="M-8,-9Q-10,-17,-14,-20M-8,-9Q-6,-17,-2,-20" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>`),
});
Object.assign(MON,{
ghost:()=>`<ellipse cx="0" cy="-6" rx="22" ry="20" fill="#a8f0ff" opacity=".22"/>`+IC.wreck(0,2,1.4)+C(-5,-14,1.8,'#a8f0ff',.3)+C(4,-12,1.8,'#a8f0ff',.3),
harpy:()=>P('M0,-2Q-17,-6,-24,-18Q-10,-14,0,-8Z','#6b5a7a',.9)+P('M0,-2Q17,-6,24,-18Q10,-14,0,-8Z','#6b5a7a',.9)+E(0,0,5,9,'#8a7a9a',.9)+C(0,-11,4.2,'#e8c9a0',.8)+eye(-1.5,-12,1.2)+eye(1.5,-12,1.2)+P('M-3,8L-5,15M3,8L5,15',"none",.9)
});

/* ---------------- EXTRA WORLD DATA ---------------- */
const ISLETS=[[690,520,24,14],[440,470,20,12]];
PLACES.push(
{id:'hearthwatch',c:'h',x:680,y:202,icon:'tower',s:1,r:26,t:1,name:'Hearthwatch Tower',type:'Ranger post',text:'The last watchtower on Frostbite Pass, kept by three rangers and a stove that has not gone out in two hundred years. They count travellers in and count them out. The numbers rarely match.',ru:'The rangers have stopped logging what comes down from the peak at night.'},
{id:'grimholt',c:'h',x:438,y:98,icon:'mine',s:1,r:26,t:1,lvl:3,name:'Grimholt Mine',type:'Sealed dwarven mine',text:'A dwarven silver mine sealed from the inside. The knocking stopped some decades ago, which nobody finds reassuring.',ru:'Silver still reaches the markets of Qart-Mayim. No one will say who is mining it.'},
{id:'mirrortarn',c:'h',x:645,y:64,icon:'lake',s:1,r:26,t:1,name:'Mirror Tarn',type:'Mountain lake',text:'A black lake so still it shows the sky better than the sky does. The reflection sometimes moves a moment before you do.'},
{id:'hollowthrone',c:'h',x:565,y:72,icon:'ruin',s:1.2,r:28,t:1,name:'The Hollow Throne',type:'Frost-giant ruin',text:'A seat carved for something three times human height, facing a valley it can no longer rule. Frost has taken the crown. Something polishes the armrests.',ru:'Sit in it and you will dream of the throne room as it once was.'},
{id:'tidewitch',c:'a',x:215,y:494,icon:'hut',s:1.4,r:26,t:1,name:"Tidewitch's Rookery",type:'Hedge-witch hut',text:'A hag who trades in fair winds, bad news and other people\'s names. Her prices are fair. Her terms are not.',ru:'She is always home, and always expecting you.'},
{id:'drownedlight',c:'a',x:60,y:548,icon:'lighthouse',s:1.1,r:26,t:1,name:'The Drowned Light',type:'Ruined lighthouse',text:'The lamp burns on nights without a keeper. Ships that follow it do not always reach the shore.',ru:'The last keeper was seen climbing to the lamp room seven years after he drowned.'},
{id:'rotfen',c:'a',x:160,y:566,icon:'reeds',s:1.6,r:26,t:1,lvl:3,name:'Rotfen Mire',type:'Poison fen',text:'A sunken island of black water and bright flowers. The fish-riders swim round it. The fish insist.'},
{id:'eelmouth',c:'a',x:345,y:405,icon:'port',s:1,r:30,t:1,name:'Eelmouth Harbor',type:'Port',text:'The only deepwater port in the Reach, where Gravewater ferries dock and ask no questions. Eel pie is the local dish. Nobody asks what the eels eat.'},
{id:'cairn',c:'a',x:35,y:312,icon:'obelisk',s:.9,r:22,t:1,name:"Wrecker's Cairn",type:'False beacon',text:'A stone cairn where wreckers light a lantern on stormy nights. Its false glow has drawn forty ships onto the western rocks.'},
{id:'heronspire',c:'a',x:300,y:322,icon:'house',s:1.3,r:24,t:1,name:'Heronspire',type:'Stilt hamlet',text:'A stilt-hamlet where herons are sacred and fishermen are tolerated.'},
{id:'delphi',c:'m',x:960,y:380,icon:'oracle',s:1.2,r:30,name:"The Oracle's Navel",type:'Oracle',text:'A circular shrine where a god in a trance speaks in riddles for a price. The answers are always true. The questions are rarely the ones you thought you were asking.',ru:'Last season the oracle was silent for nine days, then answered a question nobody had asked.'},
{id:'titan',c:'m',x:1034,y:392,icon:'ruin',s:1.3,r:30,t:1,lvl:3,name:"Titan's Ruin",type:'Fallen temple',text:'The toppled temple of a titan who lost a war with the gods. Bones the size of columns litter the hillside, and the columns are not all stone.'},
{id:'labyrinth',c:'m',x:805,y:438,icon:'mine',s:1.1,r:28,lvl:4,name:'Labyrinth of Asterion',type:'Dungeon',text:'A maze beneath the western hills. Its architect was punished with it. Its resident has never been seen to leave, only to wait.',ru:'The maze rearranges itself on nights without a moon.'},
{id:'bacchanal',c:'m',x:925,y:418,icon:'vine',s:1.3,r:28,t:1,name:'Bacchanal Vineyards',type:'Divine vineyards',text:'Terraces where the wine god keeps his harvest and the satyrs keep the party going. Entry is free. Leaving is a matter of stamina.'},
{id:'lethe',c:'m',x:868,y:438,icon:'lake',s:1,r:26,t:1,name:'Lake Lethe',type:'Lake of forgetting',text:'A calm lake whose water erases a day for every sip. The nymphs call it merciful. Those who have forgotten why they came agree.'},
{id:'poseidon',c:'m',x:1042,y:436,icon:'oracle',s:.9,r:26,t:1,name:"Poseidon's Cape",type:'Sea-god shrine',text:'A cliff temple that rumbles when the sea god is displeased, which is often. Sailors leave offerings. Some leave sailors.'},
{id:'harpies',c:'m',x:788,y:340,k:'danger',m:'harpy',s:1.2,r:30,lvl:2,name:'Harpy Roost',type:'Danger',text:'Cliff-nesting scavengers with a taste for shiny things and unwary pilgrims.'},
{id:'ribs',c:'d',x:685,y:654,icon:'ribs',s:1.3,r:30,t:1,name:'The Sky-Whale Ribs',type:'Wonder',text:'The skeleton of a creature that swam through the sky when the desert was an ocean. Caravans shelter in its ribs and tell stories about its death. The stories disagree.'},
{id:'saltking',c:'d',x:382,y:746,icon:'zig',s:1.2,r:28,t:1,lvl:4,name:'Tomb of the Salt King',type:'Buried ziggurat',text:'A stepped tomb half swallowed by dunes. The Salt King was buried with his court, his treasures and his temper.',ru:'The sands shift every full moon, and the entrance moves.'},
{id:'dustgate',c:'d',x:335,y:702,icon:'gate',s:1,r:26,t:1,name:'Dust Gate',type:'West customs',text:'The western gate where turtles are counted, loads weighed and bribes graded by size.'},
{id:'sungate',c:'d',x:778,y:690,icon:'gate',s:1,r:26,t:1,name:'Sun Gate',type:'East customs',text:'The eastern gate. Its tolls fund the Council of Hundred, whose members are not known for modesty.'},
{id:'saltflats',c:'d',x:738,y:754,icon:'saltflat',s:1,r:30,t:1,name:'The Bleached Flats',type:'Salt flat',text:'A white plain that holds the heat and throws the sun into travellers\' eyes. Mirages here are generous and malicious.'},
{id:'obelisk',c:'d',x:525,y:640,icon:'obelisk',s:1.2,r:24,t:1,name:'Obelisk of Echoes',type:'Standing stone',text:'A black stone that repeats every word spoken near it, a day later. Lovers meet here. So do blackmailers.'},
{id:'widowrest',c:'h',x:416,y:266,icon:'inn',s:1,r:24,t:1,name:"Widow's Rest",type:'Roadside inn',text:'A warm inn at the foot of the Frostmelt, run by a widow who has buried three husbands and is considering the fourth.'},
{id:'ashentoll',c:'h',x:802,y:246,icon:'fort',s:1,r:26,t:1,name:'Ashen Toll Keep',type:'Toll fort',text:'Gatehouse of the Ashen Road. The tolls are steep and the garrison is bored.'},
{id:'saltwells',c:'a',x:360,y:600,icon:'camp',s:1.2,r:24,t:1,name:'Saltroad Wells',type:'Caravan camp',text:'A walled camp where caravans from the Sunscar wait for guards, and guards wait for caravans.'},
{id:'pilgrimshrine',c:'m',x:836,y:624,icon:'oracle',s:.9,r:24,t:1,name:"Pilgrim's Shrine",type:'Roadside shrine',text:'A small shrine to whichever god is most likely to be listening. Pilgrims leave votive figs.'},
{id:'fleet',c:'s',x:455,y:522,k:'danger',m:'ghost',s:1.3,r:36,lvl:4,name:'The Sunken Fleet',type:'Danger',text:'A war fleet that sank in a single night and has not noticed. Their pennants still stream beneath the water. Their cannons still fire.'},
{id:'ashisle',c:'s',x:690,y:522,icon:'camp',s:1.1,r:22,t:1,name:'Ash Isle',type:'Hermit islet',text:'A bare islet where a hermit has lived for forty years, waiting for something. He is polite and refuses all cargo.'},
{id:'hanged',c:'s',x:440,y:472,icon:'obelisk',s:1,r:20,t:1,name:'The Hanged Isle',type:'Islet',text:'A bare islet with a single gallows tree. Travellers say the tree is always in fruit.'}
);
const RU={elderglen:'The elves have sealed the east wing since the wyrm came calling.',qart:'The Council has doubled the guard at the harbor pool. No one will say why.',olympus:'Three of the gods have not been seen in a century. The others have stopped mentioning them.',kraken:'Fleets that sail the Crossing at midnight are said to hear him humming.',mimic:'There is a second mimic. The first one trained it.',gerald:'Gerald has never missed a caravan. He has, once, missed a turtle.',willowmoor:'The willow is older than the Reach. The Reach is not sure it likes being held up.',meteora:'One of the libraries holds a book no one is allowed to finish.',hydra:'Her ninth head has stopped arguing. This is considered worse.',wyrm:'Frieda is collecting something. Nobody has been brave enough to ask what.',athens:'A trial is in session on the Acropolis. The defendant has been waiting for a verdict since before the last winter.'};
PLACES.forEach(p=>{if(RU[p.id])p.ru=RU[p.id]});
ROUTES.push(
{id:'r_oracle',c:'m',name:"The Oracle's Path",st:'sacred',pts:[[986,470],[972,430],[960,385]],carry:[]}
);
const RIVERS=[
{id:'rv1',name:'Silverfall Run',w:3.4,pts:[[612,160],[606,186],[598,214],[590,238]]},
{id:'rv2',name:'The Frostmelt',w:3.8,pts:[[482,168],[446,212],[414,262],[380,312],[340,344]]},
{id:'rv3',name:'The Ambrosia',w:3.6,pts:[[892,362],[900,408],[926,440],[962,454],[1012,462],[1052,470]]},
{id:'rv4',name:'Qart Outflow',w:3,pts:[[565,722],[568,748],[572,780]]}
];
const HAZ=[
{x:795,y:100,rx:62,ry:36,name:'Wyrm-breath Blizzard'},
{x:600,y:764,rx:96,ry:16,name:'The Dune Storm Belt'},
{x:610,y:430,rx:112,ry:92,name:'The Maw'},
{x:1112,y:520,rx:42,ry:130,name:'Reaver Waters'},
{x:112,y:556,rx:122,ry:32,name:'Rotfen Miasma'},
{x:888,y:312,rx:84,ry:34,name:'Thunderfield'}
];
const SEANAMES=[['THE PALE SEA',1000,225,-6],['THE REAVER SEA',1168,430,-90],['THE ASHEN DEEP',1000,775,0],['THE WESTERN REACHES',150,200,-4]];
CONT.forEach(c=>{});
CONT[0].info={climate:'Bitter cold and thin air. Blizzards from first frost to last thaw.',fac:['The Elderglen Conclave (elves, fading)','Rimefang Pack (yeti raiders)','The Frostwyrm Court (Frieda and her hoard)']};
CONT[1].info={climate:'Humid and misty, with permanent drizzle. Fog rolls in at dusk.',fac:["The Weavers' Guild of Knotwater",'The Fish-Riders\' Syndicate of Gillhaven','The Bridge Wardens (trolls)']};
CONT[2].info={climate:'Warm, bright and capricious. The weather follows divine mood.',fac:['The Olympian Court (Zeus and kin)','The Cloud Nymphs of Meteora',"Sparta's War Conclave"]};
CONT[3].info={climate:'Brutal heat by day, freezing by night. Sandstorms in the Dune Storm Belt.',fac:['The Council of Hundred (Qart-Mayim)','Caravan Guild of the White Turtle',"The Salt King's cult"]};
/* ---------------- GEOMETRY ---------------- */
function jag(poly,amp,iters){let p=poly.slice();for(let k=0;k<iters;k++){const q=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];q.push(a);const dx=b[0]-a[0],dy=b[1]-a[1],Ln=Math.hypot(dx,dy)||1,o=(R()-.5)*amp*Ln;q.push([(a[0]+b[0])/2-dy/Ln*o,(a[1]+b[1])/2+dx/Ln*o])}p=q;amp*=.62}return p}
function spline(p){const n=p.length;let d=`M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;for(let i=0;i<n;i++){const p0=p[(i-1+n)%n],p1=p[i],p2=p[(i+1)%n],p3=p[(i+2)%n];d+=`C${(p1[0]+(p2[0]-p0[0])/6).toFixed(1)},${(p1[1]+(p2[1]-p0[1])/6).toFixed(1)} ${(p2[0]-(p3[0]-p1[0])/6).toFixed(1)},${(p2[1]-(p3[1]-p1[1])/6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`}return d+'Z'}
function openSpline(p){let d=`M${p[0][0]},${p[0][1]}`;for(let i=0;i<p.length-1;i++){const p0=p[Math.max(0,i-1)],p1=p[i],p2=p[i+1],p3=p[Math.min(p.length-1,i+2)];d+=`C${p1[0]+(p2[0]-p0[0])/6},${p1[1]+(p2[1]-p0[1])/6} ${p2[0]-(p3[0]-p1[0])/6},${p2[1]-(p3[1]-p1[1])/6} ${p2[0]},${p2[1]}`}return d}
function inPoly(p,x,y){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!=(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c}
function blob(cx,cy,rx,ry,n=11){const p=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2,k=.82+R()*.3;p.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k])}return p}
const meas=document.createElementNS(NS,'path');
function along(pts,f){const d=openSpline(pts);meas.setAttribute('d',d);const t=meas.getTotalLength(),a=meas.getPointAtLength(t*f),b=meas.getPointAtLength(Math.min(t,t*f+2));return{x:a.x,y:a.y,dir:b.x>=a.x?1:-1,ang:Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI}}
function bbox(p){const xs=p.map(a=>a[0]),ys=p.map(a=>a[1]);return[Math.min(...xs),Math.max(...xs),Math.min(...ys),Math.max(...ys)]}


/* ---------------- RENDER ---------------- */
let sel=null,vb=[0,0,W,H],mpts=[],measuring=false;
const compass=(x,y,sc)=>g(x,y,sc,`<circle r="60" fill="${T.halo}" opacity=".5" stroke="${T.ink}" stroke-width="1.4"/><circle r="52" fill="none" stroke="${T.ink}" stroke-width=".8" stroke-dasharray="2 3"/>`+[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map(a=>`<path d="M0,-44L4,-5L0,0L-4,-5Z" transform="rotate(${a})" fill="${T.c.wall}" ${L(.7)}/>`).join('')+[45,135,225,315].map(a=>`<path d="M0,-52L6,-6L0,0L-6,-6Z" transform="rotate(${a})" fill="${T.c.gold}" ${L(.9)}/>`).join('')+[0,90,180,270].map(a=>`<path d="M0,-64L8,-8L0,0L-8,-8Z" transform="rotate(${a})" fill="${a==0?T.c.roof:T.c.gold}" ${L(1)}/>`).join('')+C(0,0,3,T.c.roof,.8)+`<text y="-70" text-anchor="middle" font-size="16" font-weight="700" font-family="${T.font}" fill="${T.text}" stroke="${T.halo}" stroke-width="3" paint-order="stroke">N</text>`);

function render(){
  const W=MW,H=MH;
  T=THEMES[0];R=rng(T.seed);sel=null;
  const polys={h:jag(MT,.28,3),m:jag(MED,.26,3),d:jag(DES,.28,3)};
  const conP=CONS.map(c=>jag(c.pts,.2,2));
  const lag=jag(blob(195,420,188,172,14),.16,3);
  const lagD=spline(lag);
  const islP=ISL.map(([cx,cy,rx,ry])=>jag(blob(cx,cy,rx,ry,9),.18,2));
  const isletP=ISLETS.map(([cx,cy,rx,ry])=>jag(blob(cx,cy,rx,ry,8),.15,2));
  const occupied=PLACES.map(p=>({x:p.x,y:p.y,r:p.r||30}));
  ROUTES.filter(r=>['turtle','trail','sacred'].includes(r.st)).forEach(r=>{for(let f=0;f<=1;f+=.05){const a=along(r.pts,f);occupied.push({x:a.x,y:a.y,r:14})}});
  RIVERS.forEach(r=>{for(let f=0;f<=1;f+=.08){const a=along(r.pts,f);occupied.push({x:a.x,y:a.y,r:10})}});
  const landPolys=[polys.h,polys.m,polys.d,...conP,...isletP];
  const inLand=(x,y)=>landPolys.some(p=>inPoly(p,x,y))||inPoly(lag,x,y);
  const items=[];
  /* ---- defs ---- */
  let defs='';
  const lg=(id,c)=>`<radialGradient id="${id}" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="${mix(c,'#ffffff',.38)}"/><stop offset=".65" stop-color="${c}"/><stop offset="1" stop-color="${mix(c,'#000000',.16)}"/></radialGradient>`;
  defs+=lg('gh',T.land.h)+lg('gm',T.land.m)+lg('gd',T.land.d)+lg('ga',T.land.a);
  CONS.forEach((c,i)=>{defs+=`<linearGradient id="cg${i}" gradientUnits="userSpaceOnUse" x1="${c.g[0]}" y1="${c.g[1]}" x2="${c.g[2]}" y2="${c.g[3]}"><stop offset="0" stop-color="${T.land[c.a]}"/><stop offset="1" stop-color="${T.land[c.b]}"/></linearGradient>`});
  defs+=`<linearGradient id="gs" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="${T.sea[0]}"/><stop offset="1" stop-color="${T.sea[1]}"/></linearGradient>`;
  defs+=`<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${T.vig}"/></radialGradient>`;
  defs+=`<radialGradient id="burn" cx=".5" cy=".5" r=".72"><stop offset=".6" stop-color="#3a1d08" stop-opacity="0"/><stop offset="1" stop-color="#2a1204" stop-opacity=".75"/></radialGradient>`;
  defs+=`<filter id="wob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="${T.seed}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${T.wob}"/></filter>`;
  defs+=`<filter id="rel" x="-3%" y="-3%" width="106%" height="106%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="${T.seed}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${T.wob}" result="d"/><feGaussianBlur in="d" stdDeviation="7" result="b1"/><feGaussianBlur in="d" stdDeviation="24" result="b2"/><feComposite in="b1" in2="b2" operator="arithmetic" k1="0" k2=".55" k3=".45" k4="0" result="b"/><feTurbulence type="fractalNoise" baseFrequency=".022" numOctaves="3" seed="7" result="t"/><feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="ta"/><feComposite in="b" in2="ta" operator="arithmetic" k1="0" k2="1" k3=".5" k4="0" result="h"/><feDiffuseLighting in="h" surfaceScale="11" diffuseConstant="1.15" lighting-color="#fff" result="lit"><feDistantLight azimuth="235" elevation="48"/></feDiffuseLighting><feComponentTransfer in="lit" result="l2"><feFuncR type="linear" slope="1.1" intercept="-.43"/><feFuncG type="linear" slope="1.1" intercept="-.43"/><feFuncB type="linear" slope="1.1" intercept="-.43"/></feComponentTransfer><feComposite in="l2" in2="d" operator="in"/></filter>`;
  defs+=`<filter id="bl" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="4"/></filter>`;
  defs+=`<filter id="bl2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="16"/></filter>`;
  defs+=`<filter id="gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 .55 0"/></filter>`;
  defs+=`<filter id="gr2" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="3" seed="11"/><feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0 0.08  0 0 0 .9 0"/></filter>`;
  defs+=`<pattern id="hz" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#8a1f14" stroke-width="2.2" opacity=".55"/></pattern>`;
  defs+=`<clipPath id="mclip"><rect x="0" y="0" width="${MW}" height="${MH}"/></clipPath>`;
  let s=`<defs>${defs}</defs>`;
  /* ---- parchment ---- */
  s+=`<rect width="1260" height="900" fill="#d9c394"/><rect width="1260" height="900" filter="url(#gr2)" opacity=".45"/>`;
  for(let k=0;k<16;k++)s+=`<ellipse cx="${(R()*1260).toFixed(0)}" cy="${(R()*900).toFixed(0)}" rx="${40+R()*110}" ry="${30+R()*80}" fill="#7a4a1c" opacity="${(.05+R()*.08).toFixed(2)}" filter="url(#bl2)"/>`;
  s+=`<path d="M630,0V900M0,450H1260" stroke="#5a3a18" stroke-width="1.3" opacity=".28"/><path d="M631.5,0V900M0,451.5H1260" stroke="#fff6dc" stroke-width="1" opacity=".25"/>`;
  s+=`<g transform="translate(${OFF} ${OFF})"><g clip-path="url(#mclip)">`;
  const shapes=[[spline(polys.h),'url(#gh)'],[spline(polys.m),'url(#gm)'],[spline(polys.d),'url(#gd)'],...conP.map((p,i)=>[spline(p),`url(#cg${i})`]),...isletP.map(p=>[spline(p),'url(#ga)'])];
  /* ---- sea ---- */
  s+=`<rect width="${W}" height="${H}" fill="url(#gs)"/><rect width="${W}" height="${H}" filter="url(#gr)" opacity=".35"/>`;
  s+=`<mask id="deepm" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/><g filter="url(#bl2)">${shapes.map(([d])=>`<path d="${d}" fill="#000" stroke="#000" stroke-width="150" stroke-linejoin="round"/>`).join("")}</g></mask><rect width="${W}" height="${H}" fill="#04213d" opacity=".36" mask="url(#deepm)"/>`;
  /* graticule + rhumb lines */
  let gl='';
  for(let x=150;x<1200;x+=150)gl+=`<path d="M${x},0V${MH}" stroke="#fff" stroke-width="1" stroke-dasharray="3 6" opacity=".17"/>`;
  for(let y=140;y<840;y+=140)gl+=`<path d="M0,${y}H${MW}" stroke="#fff" stroke-width="1" stroke-dasharray="3 6" opacity=".17"/>`;
  [[100,742],[1140,100]].forEach(([cx,cy])=>{for(let a=0;a<360;a+=22.5){const r=a*Math.PI/180;gl+=`<path d="M${cx},${cy}L${(cx+Math.sin(r)*1500).toFixed(0)},${(cy-Math.cos(r)*1500).toFixed(0)}" stroke="#fff" stroke-width=".8" opacity=".1"/>`}});
  s+=gl;
  /* sea waves */
  const seaPts=[];
  for(let k=0;k<500&&seaPts.length<80;k++){const x=20+R()*(W-40),y=20+R()*(H-40);if(inLand(x,y)||landPolys.some(pp=>{const b=bbox(pp);return x>b[0]-26&&x<b[1]+26&&y>b[2]-26&&y<b[3]+26&&inPoly(pp,x,y)}))continue;if(x<390&&y>230&&y<610&&Math.hypot(x-195,(y-420)*1.05)<210)continue;if(PLACES.some(p=>p.c==='s'&&Math.hypot(p.x-x,p.y-y)<46))continue;seaPts.push([x,y])}
  seaPts.forEach(([x,y])=>{s+=`<path class="sw" style="animation-delay:${(((x*7+y*3)|0)%40)/10}s" d="M${x},${y}q4,-5,8,0t8,0" fill="none" stroke="#fff" stroke-width="1.5" opacity=".6" stroke-linecap="round"/>`});
  /* sea names */
  SEANAMES.forEach(([t,x,y,r])=>{s+=`<text x="${x}" y="${y}" transform="rotate(${r} ${x} ${y})" text-anchor="middle" font-size="22" letter-spacing="10" font-style="italic" font-family="${T.font}" fill="#fff" opacity=".32">${t}</text>`});
  /* decorative sea life */
  s+=IC.whale(1100,742,1,-1)+g(1150,262,1.3,MON.serpent())+IC.wreck(900,764,1.1)+IC.wreck(1138,628,1)+IC.ship(160,150,1.8,1)+IC.ship(1070,792,1.6,-1)+IC.ship(60,640,1.4,1)+IC.whale(60,820,.8,1);
  /* ---- the supercontinent ---- */
  s+=`<g filter="url(#bl2)" opacity=".16">${shapes.map(([d])=>`<path d="${d}" fill="none" stroke="#6fd0cf" stroke-width="70" stroke-linejoin="round"/>`).join("")}</g><g filter="url(#bl)" opacity=".26">${shapes.map(([d])=>`<path d="${d}" fill="none" stroke="#8fe3dc" stroke-width="30" stroke-linejoin="round"/>`).join("")}</g>`;
  shapes.forEach(([d])=>{s+=`<path d="${d}" fill="none" stroke="#fff" stroke-width="40" stroke-linejoin="round" opacity=".05"/><path d="${d}" fill="none" stroke="#fff" stroke-width="26" stroke-linejoin="round" opacity=".06"/><path d="${d}" fill="none" stroke="#fff" stroke-width="13" stroke-linejoin="round" opacity=".09"/>`});
  s+=`<g filter="url(#bl)" opacity=".3" transform="translate(5 8)">${shapes.map(([d])=>`<path d="${d}" fill="#000"/>`).join("")}</g>`;
  s+=`<g filter="url(#bl)">${shapes.map(([d])=>`<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="15"/>`).join("")}</g>`;
  shapes.forEach(([d])=>{s+=`<path d="${d}" fill="#3b2713" opacity=".75" transform="translate(2.5 5)" filter="url(#wob)"/>`});
  shapes.forEach(([d])=>{s+=`<path d="${d}" fill="none" stroke="${T.ink}" stroke-width="${T.cw*2}" stroke-linejoin="round" filter="url(#wob)"/>`});
  shapes.forEach(([d,f])=>{s+=`<path d="${d}" fill="${f}" stroke="none" filter="url(#wob)"/>`});
  shapes.forEach(([d])=>{s+=`<path d="${d}" fill="#808080" filter="url(#rel)" style="mix-blend-mode:soft-light" opacity=".95"/>`});
  /* contour hatching on coasts (inner dotted line) */
  shapes.slice(0,3).forEach(([d])=>{s+=`<path d="${d}" fill="none" stroke="${T.ink}" stroke-width="1" stroke-dasharray="1 5" opacity=".28" transform="translate(600 420) scale(.965) translate(-600 -420)"/>`});
  /* lagoon */
  s+=`<path d="${lagD}" fill="#000" opacity=".14" transform="translate(4 6)" filter="url(#bl)"/><path d="${lagD}" fill="${T.shallow}" stroke="#fff" stroke-width="3" stroke-opacity=".7" stroke-dasharray="2 6" stroke-linecap="round"/>`;
  for(let k=0;k<30;k++){const x=40+R()*320,y=260+R()*320;if(inPoly(lag,x,y)&&!islP.some(p=>inPoly(p,x,y)))s+=`<path d="M${x},${y}q4,-4,8,0t8,0" fill="none" stroke="#fff" stroke-width="1.3" opacity=".75" stroke-linecap="round"/>`}
  /* islands */
  islP.forEach((p,k)=>{const d=spline(p);const b=bbox(p);const cx=(b[0]+b[1])/2,cy=(b[2]+b[3])/2;
    s+=`<path d="${d}" fill="none" stroke="#fff" stroke-width="9" opacity=".6" filter="url(#bl)"/>`;
    s+=`<path d="${d}" fill="url(#ga)" stroke="${T.ink}" stroke-width="${T.cw*.7}" stroke-linejoin="round" filter="url(#wob)"/>`;
    s+=`<path d="${d}" transform="translate(${cx} ${cy}) scale(.68) translate(${-cx} ${-cy})" fill="${mix(T.land.a,'#ffffff',.35)}" opacity=".7"/>`});
  /* bridges */
  let br='';
  BRIDGES.forEach(([a,b])=>{const A=ISL[a],B=ISL[b];const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2+10;const dx=B[0]-A[0],dy=B[1]-A[1],Ln=Math.hypot(dx,dy);const sx=A[0]+dx/Ln*A[2]*.7,sy=A[1]+dy/Ln*A[3]*.7,ex=B[0]-dx/Ln*B[2]*.7,ey=B[1]-dy/Ln*B[3]*.7;const d=`M${sx.toFixed(1)},${sy.toFixed(1)}Q${mx.toFixed(1)},${(my+8).toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`;
    br+=tube(d,'#9a6a3c',3.4)+`<path d="${d}" fill="none" stroke="#e8c48a" stroke-width="1.4" stroke-dasharray="2 2.4"/>`;
    meas.setAttribute('d',d);const tl=meas.getTotalLength();for(let q=1;q<4;q++){const pt=meas.getPointAtLength(tl*q/4);br+=`<circle cx="${pt.x.toFixed(1)}" cy="${(pt.y-2).toFixed(1)}" r="2.2" fill="${T.c.leaf}" ${L(.4)}/>`}});
  s+=`<g>${br}</g>`;
  /* rivers */
  let rv='',rvl='';
  RIVERS.forEach(r=>{const d=openSpline(r.pts);rv+=`<path d="${d}" fill="none" stroke="${T.ink}" stroke-width="${r.w+2}" stroke-linecap="round" opacity=".5"/><path id="${r.id}" d="${d}" fill="none" stroke="${T.c.water}" stroke-width="${r.w}" stroke-linecap="round"/>`;
    rvl+=`<text font-size="10" font-style="italic" font-family="${T.font}" fill="${T.text}" stroke="${T.halo}" stroke-width="3" paint-order="stroke"><textPath href="#${r.id}" startOffset="50%" text-anchor="middle"><tspan dy="-4">${r.name}</tspan></textPath></text>`});
  s+=rv;
  /* hex grid + hazards */
  let hx_='';const hs=34,hw=hs*Math.sqrt(3);
  for(let r=0;r*hs*1.5<MH+hs;r++)for(let c=0;c*hw<MW+hw;c++){const cx=c*hw+(r%2?hw/2:0),cy=r*hs*1.5;let d='';for(let k=0;k<6;k++){const a=(60*k-30)*Math.PI/180;d+=(k?'L':'M')+(cx+hs*Math.cos(a)).toFixed(1)+','+(cy+hs*Math.sin(a)).toFixed(1)}hx_+=d+'Z'}
  s+=`<path class="hexg" d="${hx_}" fill="none" stroke="#fff" stroke-width=".9" opacity=".3"/>`;
  let hz='';
  HAZ.forEach(h=>{hz+=`<ellipse cx="${h.x}" cy="${h.y}" rx="${h.rx}" ry="${h.ry}" fill="url(#hz)" stroke="#8a1f14" stroke-width="1.6" stroke-dasharray="6 4" opacity=".85"/><text x="${h.x}" y="${h.y+h.ry+13}" text-anchor="middle" font-size="10.5" font-style="italic" font-family="${T.font}" fill="#ffd9c8" stroke="#3a0d08" stroke-width="3" paint-order="stroke" letter-spacing="1">${h.name}</text>`});
  s+=`<g class="haz">${hz}</g>`;
  /* routes */
  let ro='',rl='';
  ROUTES.forEach(r=>{const d=openSpline(r.pts);const rc=T.route;let st='';
    if(r.st==='turtle')st=`stroke="${rc}" stroke-width="3" stroke-dasharray="1 7" opacity=".85"`;
    else if(r.st==='fish')st=`stroke="#fff" stroke-width="3.4" stroke-dasharray="9 7" opacity=".85"`;
    else if(r.st==='trail')st=`stroke="${rc}" stroke-width="2.6" stroke-dasharray="7 5" opacity=".9"`;
    else if(r.st==='sacred')st=`stroke="${T.c.gold}" stroke-width="3" stroke-dasharray="10 4" opacity=".95"`;
    else st=`stroke="#fff" stroke-width="2.4" stroke-dasharray="2 6" opacity=".95"`;
    ro+=`<g>`+(r.st==='sacred'||r.st==='trail'?`<path d="${d}" fill="none" stroke="${T.ink}" stroke-width="5.4" opacity=".35" stroke-linecap="round"/>`:'')+`<path id="${r.id}" d="${d}" fill="none" stroke-linecap="round" ${st}><title>${r.name}</title></path></g>`;
    rl+=`<text font-size="11.5" font-style="italic" font-family="${T.font}" fill="${T.text}" stroke="${T.halo}" stroke-width="3.4" paint-order="stroke" stroke-linejoin="round"><textPath href="#${r.id}" startOffset="50%" text-anchor="middle"><tspan dy="-5">${r.name}</tspan></textPath></text>`;
    r.carry.forEach(c=>{const a=along(r.pts,c.f);
      if(c.k==='turtle')items.push({y:a.y+4,s:IC.turtle(a.x,a.y,.95,a.dir)});
      if(c.k==='fish')items.push({y:a.y+4,s:IC.fish(a.x,a.y,1,a.dir,c.col)});
      if(c.k==='ship')items.push({y:a.y+4,s:IC.ship(a.x,a.y,1.1,c.d)})})});
  s+=`<g class="routes">${ro}</g>`;
  /* ---- decor ---- */
  const scatter=(poly,n,minD,fn,margin=11)=>{const b=bbox(poly);let c=0;for(let t=0;t<n*70&&c<n;t++){const x=b[0]+R()*(b[1]-b[0]),y=b[2]+R()*(b[3]-b[2]);if(!inPoly(poly,x,y)||!inPoly(poly,x-margin,y)||!inPoly(poly,x+margin,y)||!inPoly(poly,x,y+margin*.8)||!inPoly(poly,x,y-margin*.8))continue;if(occupied.some(o=>Math.hypot(o.x-x,(o.y-y)*1.1)<Math.max(o.r,minD)))continue;occupied.push({x,y,r:minD});items.push({y,s:fn(x,y)});c++}};
  scatter(polys.h,17,26,(x,y)=>IC.mount(x,y,.8+R()*.55));
  scatter(polys.h,38,15,(x,y)=>IC.pine(x,y,.85+R()*.5));
  scatter(polys.h,6,30,(x,y)=>IC.oak(x,y,.8));
  scatter(polys.d,14,28,(x,y)=>IC.dune(x,y,.9+R()*.8));
  scatter(polys.d,10,24,(x,y)=>IC.cactus(x,y,.8+R()*.4));
  scatter(polys.d,3,26,(x,y)=>IC.palm(x,y,.8));
  scatter(conP[0],7,18,(x,y)=>IC.pine(x,y,.9+R()*.4));scatter(conP[1],5,20,(x,y)=>IC.mount(x,y,.7+R()*.4));scatter(conP[1],5,16,(x,y)=>IC.pine(x,y,.9));scatter(conP[2],4,24,(x,y)=>IC.dune(x,y,.9));scatter(conP[2],3,22,(x,y)=>IC.cactus(x,y,.9));scatter(conP[3],5,18,(x,y)=>IC.cypress(x,y,1));scatter(conP[3],3,24,(x,y)=>IC.dune(x,y,.8));
  scatter(polys.m,22,17,(x,y)=>IC.cypress(x,y,.9+R()*.4));
  scatter(polys.m,12,19,(x,y)=>IC.olive(x,y,.9+R()*.3));
  scatter(polys.m,9,22,(x,y)=>IC.hill(x,y,1+R()*.5));
  scatter(polys.m,3,26,(x,y)=>IC.pegasus(x,y-10,1.1));
  scatter(polys.m,4,24,(x,y)=>IC.satyr(x,y,1.2));
  scatter(polys.m,3,24,(x,y)=>IC.nymph(x,y,1.2));
  scatter(conP[0],3,22,(x,y)=>IC.hill(x,y,1));scatter(conP[3],3,22,(x,y)=>IC.hill(x,y,1));
  islP.forEach((p,k)=>{const cnt=Math.max(1,Math.round(ISL[k][2]*ISL[k][3]/420));scatter(p,cnt,10,(x,y)=>IC.tree(x,y,.9+R()*.5),6);if(k===9||k===10)scatter(p,2,12,(x,y)=>IC.reeds(x,y,1.2),6)});
  isletP.forEach(p=>scatter(p,1,8,(x,y)=>IC.palm(x,y,.7),3));
  /* ---- places ---- */
  PLACES.forEach(p=>{const rr=p.r||30;const inner=p.k==='danger'?
      `<g class="dg"><g class="pl" data-id="${p.id}"><circle r="${rr*.7}" fill="rgba(255,255,255,0)"/><circle class="pulse" r="${rr*.72}" fill="none" stroke="#ff3b4e" stroke-width="2.4" stroke-dasharray="5 4"/>${g(0,0,p.s,MON[p.m]())}<circle cx="${rr*.55}" cy="${-rr*.55}" r="7" fill="#ff3b4e" stroke="${T.ink}" stroke-width="${1.2*T.lw}"/><text x="${rr*.55}" y="${-rr*.55+4}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="sans-serif">!</text></g></g>`
      :`<g class="pl" data-id="${p.id}"><circle r="${rr*.6}" cy="-6" fill="rgba(255,255,255,0)"/>${IC[p.icon](0,0,p.s)}</g>`;
    items.push({y:p.y+(p.k==='danger'?30:2),s:`<g transform="translate(${p.x} ${p.y})">${inner}</g>`})});
  items.sort((a,b)=>a.y-b.y);
  s+=items.map(i=>i.s).join('');
  s+=`<rect width="${W}" height="${H}" fill="url(#vig)" pointer-events="none"/>`;
  /* ---- labels ---- */
  const OFFS={fall:30,olympus:14,peak:14,willow:16,house:14,lake:12,tower:10,mine:10,ruin:10,reeds:10,saltflat:12,ribs:10,zig:10,obelisk:10,gate:10,oracle:10,vine:12,hut:10,camp:10,port:12,lighthouse:10,fort:10,inn:12};
  let lb='';
  PLACES.forEach(p=>{const off=p.k==='danger'?(p.r||30)*.75+10:(OFFS[p.icon]??20);const big=['qart','elderglen','olympus','athens','willowmoor'].includes(p.id);
    lb+=`<text ${p.t?'class="minor"':''} x="${p.x}" y="${p.y+off}" text-anchor="middle" font-size="${big?14:(p.t?10.2:11.5)}" font-family="${T.font}" font-weight="${big?700:500}" fill="${p.k==='danger'?'#b0182b':T.text}" stroke="${T.halo}" stroke-width="3.6" paint-order="stroke" stroke-linejoin="round" pointer-events="none">${p.name}</text>`});
  CONT.forEach(c=>{lb+=`<text x="${c.lx}" y="${c.ly}" text-anchor="middle" font-size="26" font-family="${T.font}" font-weight="700" letter-spacing="3" fill="${T.text}" stroke="${T.halo}" stroke-width="5" paint-order="stroke" stroke-linejoin="round" pointer-events="none">${c.name}</text>`});
  lb+=`<text x="575" y="385" text-anchor="middle" font-size="21" font-style="italic" letter-spacing="7" font-family="${T.font}" fill="#f3efe4" opacity=".75" stroke="${T.ink}" stroke-width="3" paint-order="stroke" pointer-events="none">The Gravewater</text>`;
  s+=`<g class="lbl routes">${rl}${rvl}</g><g class="lbl">${lb}</g>`;
  /* ---- compasses, title, scale ---- */
  s+=compass(100,742,1.15)+compass(1140,100,.8);
  s+=`<rect x="28" y="26" width="320" height="90" rx="6" fill="#ecdcb8" stroke="${T.ink}" stroke-width="2.6"/><rect x="34" y="32" width="308" height="78" rx="4" fill="none" stroke="${T.ink}" stroke-width="1" stroke-dasharray="3 3"/><text x="188" y="78" text-anchor="middle" font-size="46" letter-spacing="12" font-family="${T.font}" fill="${T.text}" font-weight="700">SHAHAN</text><text x="188" y="102" text-anchor="middle" font-size="13" font-family="${T.font}" fill="#4a2a14" font-style="italic">the known world, and what hunts in it</text>`;
  const sbx=900,sby=798,u=25/LG;
  s+=`<rect x="${sbx}" y="${sby}" width="${u}" height="7" fill="${T.ink}" stroke="${T.ink}"/><rect x="${sbx+u}" y="${sby}" width="${u}" height="7" fill="#ecdcb8" stroke="${T.ink}"/><text x="${sbx}" y="${sby-4}" font-size="10" font-family="${T.font}" fill="#f3efe4" text-anchor="middle">0</text><text x="${sbx+u}" y="${sby-4}" font-size="10" font-family="${T.font}" fill="#f3efe4" text-anchor="middle">25</text><text x="${sbx+2*u}" y="${sby-4}" font-size="10" font-family="${T.font}" fill="#f3efe4" text-anchor="middle">50 leagues</text>`;
  s+=`<text x="1185" y="828" text-anchor="end" font-size="10" font-style="italic" font-family="${T.font}" fill="#f3efe4" opacity=".8">Drawn by survivors of the Fourth Expedition. Corrections welcome. Retractions impossible.</text>`;
  s+=`</g>`; /* end clip */
  /* ---- frame ---- */
  let ck='';
  for(let x=0;x<MW;x+=40){const on=(x/40)%2===0;ck+=`<rect x="${x}" y="-9" width="40" height="9" fill="${on?T.ink:'#e9d8b0'}"/><rect x="${x}" y="${MH}" width="40" height="9" fill="${on?'#e9d8b0':T.ink}"/>`}
  for(let y=0;y<MH;y+=40){const on=(y/40)%2===0;ck+=`<rect x="-9" y="${y}" width="9" height="40" fill="${on?T.ink:'#e9d8b0'}"/><rect x="${MW}" y="${y}" width="9" height="40" fill="${on?'#e9d8b0':T.ink}"/>`}
  s+=ck+`<rect x="-9" y="-9" width="${MW+18}" height="${MH+18}" fill="none" stroke="${T.ink}" stroke-width="2.4"/><rect x="0" y="0" width="${MW}" height="${MH}" fill="none" stroke="${T.ink}" stroke-width="1.4"/>`;
  for(let x=150;x<1200;x+=150)s+=`<text x="${x}" y="-15" text-anchor="middle" font-size="9.5" font-family="${T.font}" fill="${T.ink}" opacity=".7">${(12+x/10).toFixed(0)}°E</text>`;
  for(let y=140;y<840;y+=140)s+=`<text x="-15" y="${y}" transform="rotate(-90 -15 ${y})" text-anchor="middle" font-size="9.5" font-family="${T.font}" fill="${T.ink}" opacity=".7">${(60-y/14).toFixed(0)}°N</text>`;
  s+=`<g id="selring" pointer-events="none"></g><g id="measure" pointer-events="none"></g></g>`;
  s+=`<rect width="${PW=1260}" height="900" fill="url(#burn)" pointer-events="none"/>`;
  svg.innerHTML=s;
  svg.setAttribute('viewBox',vb.join(' '));
  svg.classList.toggle('far',vb[2]>760);
  drawMeasure();
}
var PW;

