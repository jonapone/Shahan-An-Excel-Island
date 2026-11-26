const PRIM={a1:['cells'],a2:['refs'],a3:['fn','ops'],a5:['dbg'],a6:['tf'],a7:['cond'],a8:['text'],d1:['look'],d7:['date'],d9:['code'],m2:['arr'],m8:['think']};
for(const k in PRIM){const s=stopById(k);if(s)s.prim=PRIM[k]}
