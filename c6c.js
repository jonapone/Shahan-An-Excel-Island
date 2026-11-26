/* ===== ORDER + MAP PLACEMENT for new stops ===== */
(function(){
 STOPS.forEach(s=>{if(s.ord==null)s.ord=parseInt(s.id.slice(1))*10});
 const order=['a','d','m','h'];
 STOPS.sort((x,y)=>{const rx=order.indexOf(x.reg),ry=order.indexOf(y.reg);return rx-ry||x.ord-y.ord});
 for(const r of order){
  const L=STOPS.filter(s=>s.reg===r);let flip=1;
  L.forEach((s,i)=>{
   if(s.at)return;
   let p=null,n=null;
   for(let j=i-1;j>=0;j--)if(L[j].at){p=L[j];break}
   for(let j=i+1;j<L.length;j++)if(L[j].at){n=L[j];break}
   if(p&&n){const t=(s.ord-p.ord)/(n.ord-p.ord);
    const x=p.at[0]+(n.at[0]-p.at[0])*t,y=p.at[1]+(n.at[1]-p.at[1])*t;
    const dx=n.at[0]-p.at[0],dy=n.at[1]-p.at[1],d=Math.hypot(dx,dy)||1;
    s.at=[Math.round(x-dy/d*10*flip),Math.round(y+dx/d*10*flip)];flip=-flip}
   else if(n){const q=L.find(z=>z.at&&z!==n&&z.ord>n.ord)||n;
    s.at=[Math.round(n.at[0]-(q.at[0]-n.at[0])*.5),Math.round(n.at[1]-(q.at[1]-n.at[1])*.5)]}
  });
 }
})();
