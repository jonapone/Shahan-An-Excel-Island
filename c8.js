/* ===== THE OBSIDIAN ISLE: wiring, island art, pin ===== */
const IDX=55,IDY=42; /* island offset from its first draft, to sit farther out at sea */
REGS.e={n:'The Obsidian Isle',tier:'Elite',c:'#e0556a',view:[895,60,215,160]};
ROR.push('e');
REGEND.h='The ice stops cracking. Far out past the last ridge, a black shape rises from the sea where there was only fog this morning. Somebody has lit a beacon on it. It is not for you. It is about you.';
STOPS.filter(s=>s.reg==='e').forEach(s=>{s.at=[s.at[0]+IDX,s.at[1]+IDY]});
/* spread the Hoarfrost stops along a winding path over the whole island */
(function(){
 const H=STOPS.filter(s=>s.reg==='h');
 const ctrl=[[418,140],[462,82],[520,172],[576,72],[632,188],[688,72],[744,188],[792,98],[818,150]];
 const seg=[];let tot=0;for(let i=0;i<ctrl.length-1;i++){const d=Math.hypot(ctrl[i+1][0]-ctrl[i][0],ctrl[i+1][1]-ctrl[i][1]);seg.push(d);tot+=d}
 const at=t=>{let d=t*tot;for(let i=0;i<seg.length;i++){if(d<=seg[i]||i===seg.length-1){const f=Math.min(1,d/seg[i]);return[ctrl[i][0]+(ctrl[i+1][0]-ctrl[i][0])*f,ctrl[i][1]+(ctrl[i+1][1]-ctrl[i][1])*f]}d-=seg[i]}};
 const inside=(x,y)=>[[0,0],[12,0],[-12,0],[0,12],[0,-12]].every(([a,b])=>inPoly(MT,x+a,y+b));
 H.forEach((s,i)=>{let p=at(H.length>1?i/(H.length-1):0),k=0;while(!inside(p[0],p[1])&&k<60){p=[p[0]+(620-p[0])*.06,p[1]+(130-p[1])*.06];k++}s.at=[Math.round(p[0]),Math.round(p[1])]});
})();
function isleSvg(){
 const P0=[[872,95],[885,62],[915,45],[955,38],[995,50],[1015,80],[1008,118],[985,148],[945,158],[905,150],[880,128]].map(p=>[p[0]+IDX+OFF,p[1]+IDY+OFF]);
 const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2],n=P0.length;
 let d='M'+mid(P0[n-1],P0[0]).join(',');for(let i=0;i<n;i++){const m=mid(P0[i],P0[(i+1)%n]);d+=`Q${P0[i].join(',')} ${m.join(',')}`}d+='Z';
 const open=isOpen(STOPS.find(s=>s.id==='e1')),op=open?1:.62,c=REGS.e.c;
 const h10=STOPS.find(s=>s.id==='h10');const cx=945+IDX+OFF,cy=98+IDY+OFF;
 let o=`<g pointer-events="none" opacity="${op}">`;
 o+=`<path d="M${h10.at[0]+OFF},${h10.at[1]+OFF} Q${(h10.at[0]+cx-OFF)/2+OFF-20},${(h10.at[1]+cy-OFF)/2+OFF-34} ${cx-52},${cy-18}" fill="none" stroke="#bfe6f5" stroke-width="2.6" stroke-dasharray="3 7" stroke-linecap="round" opacity=".7"/>`;
 o+=`<path d="${d}" fill="none" stroke="#fff" stroke-width="12" opacity=".35"/>`;
 o+=`<path d="${d}" fill="#2c2230" stroke="#1d130b" stroke-width="3" stroke-linejoin="round"/>`;
 [[900,70],[1000,100],[920,148],[975,150],[890,115]].forEach(([x,y])=>{x+=IDX+OFF;y+=IDY+OFF;o+=`<path d="M${x-14},${y+8}L${x-3},${y-16}L${x+3},${y-6}L${x+9},${y-14}L${x+16},${y+8}Z" fill="#4a3b52" stroke="#1d130b" stroke-width="1.2"/><path d="M${x-3},${y-16}L${x-6},${y-9}L${x},${y-10}L${x+3},${y-6}Z" fill="${c}" opacity=".85"/>`});
 /* castle */
 const fx=cx,fy=cy+14,st='#6b5a73',ln='#1d130b';
 const tw=(x,w,h)=>`<rect x="${x}" y="${fy-h}" width="${w}" height="${h+10}" fill="${st}" stroke="${ln}" stroke-width="1.5"/>`+[0,1,2].map(k=>`<rect x="${x+k*(w/3)+.5}" y="${fy-h-5}" width="${w/3-1.5}" height="5" fill="${st}" stroke="${ln}" stroke-width="1"/>`).join('');
 o+=`<rect x="${fx-24}" y="${fy-6}" width="48" height="20" fill="${st}" stroke="${ln}" stroke-width="1.6"/>`+tw(fx-30,13,26)+tw(fx+17,13,26)+tw(fx-9,18,40)+`<path d="M${fx-9},${fy-45}L${fx},${fy-62}L${fx+9},${fy-45}Z" fill="${c}" stroke="${ln}" stroke-width="1.5" stroke-linejoin="round"/><path d="M${fx},${fy-62}v-9l8,3l-8,3" fill="${c}" stroke="${ln}" stroke-width="1.2"/><path d="M${fx-5},${fy+14}v-9a5,5 0 0 1 10,0v9z" fill="${ln}"/><rect x="${fx-4}" y="${fy-30}" width="3" height="6" fill="#ffcf5a"/><rect x="${fx+2}" y="${fy-30}" width="3" height="6" fill="#ffcf5a"/><rect x="${fx-26}" y="${fy-14}" width="3" height="5" fill="#ffcf5a"/><rect x="${fx+23}" y="${fy-14}" width="3" height="5" fill="#ffcf5a"/>`;
 o+=`<text x="${cx}" y="${cy+68}" text-anchor="middle" font-size="15" font-style="italic" font-family="Georgia,serif" fill="#fdf3d6" stroke="#1d130b" stroke-width="3.4" paint-order="stroke">The Obsidian Isle</text>`;
 return o+'</g>';
}
function ipinSvg(){
 const e1=STOPS.find(s=>s.id==='e1'),open=isOpen(e1),n=['e1','e2','e3','e4','e5'].filter(i=>S.done[i]).length,all=n===5;
 const x=945+IDX+OFF,y=98+IDY+OFF-16,R0=17,c=REGS.e.c,fill=all?'#58b368':open?'#f0c75a':'#6b6558';
 return `<g class="mk ipin o" data-id="isle" data-x="${x}" data-y="${y}" transform="translate(${x},${y})">`+
  (open&&!all?`<circle class="gpulse" r="19" fill="none" stroke="#ff6a4a" stroke-width="3"/>`:'')+
  `<ellipse cx="4" cy="${R0+7}" rx="${R0+5}" ry="${(R0+3)*.38}" fill="url(#mksh)"/><circle cy="6" r="${R0+3}" fill="#1d130b"/><circle cy="3" r="${R0+3}" fill="${mix(c,'#000000',.45)}" stroke="#1d130b" stroke-width="1.5"/>`+
  `<g class="top" transform="translate(0 -3)"><circle r="${R0+3}" fill="${c}" stroke="#1d130b" stroke-width="1.5"/><circle r="${R0}" fill="${fill}" stroke="#1d130b" stroke-width="2"/><circle r="${R0}" fill="url(#mkshine)" pointer-events="none"/><path d="M-9,-${R0+3} l3,-7 l3,5 l3,-7 l3,7 l3,-5 l3,7z" fill="#e6b43c" stroke="#1d130b" stroke-width="1.2" transform="scale(.9)"/><text y="5.5" text-anchor="middle" font-size="${all?16:14}" font-weight="700" fill="${open?'#1d130b':'#d6cdb8'}" font-family="Georgia,serif" pointer-events="none">${all?'✓':open?n+'/5':'🔒'}</text></g></g>`;
}
/* badges */
BADGES.splice(BADGES.length-1,0,
 ['re','🏝','Isle Reacher','Open The Obsidian Isle (clear all four regions)',s=>regionDone('h')],
 ['e4','🔥','Elite Breaker','Defeat the four Elite masters',s=>['e1','e2','e3','e4'].every(i=>s.done[i])],
 ['rc','🏆','Champion','Defeat Vael, Champion of the Obsidian Isle',s=>!!s.done.e5]);

/* sea monsters wiring */
REGS.s={n:'The Monster Deeps',tier:'Sea Monster',c:'#8a6ae0',view:[480,260,700,330]};
REGEND.s='The deep goes quiet.';
BADGES.splice(BADGES.length-1,0,['mh','🦑','Monster Hunter','Defeat the Gullet, the Siren Rocks and Kevin the Kraken',s=>['sg','ss','sk'].every(i=>s.done[i])]);
