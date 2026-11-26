#!/bin/bash
cd "$(dirname "$0")"
cat engine1.js engine2.js engine3.js > engine.js
node -e "const fs=require('fs');fs.writeFileSync('wisdom.js','const WISDOM='+JSON.stringify(fs.readFileSync('wisdom.html','utf8')).replace(/<\\/script/gi,'<\\\\/script')+';\\n')"
{ cat head.html; cat mapjs.js; echo; cat engine.js g1.js g2.js g3.js; for f in c1.js c2.js c3.js c4.js c6a.js c6b.js c6c.js c7.js c8.js c9.js; do [ -f $f ] && cat $f; done; cat c5.js s1.js s2.js wisdom.js; [ -f prim.js ] && cat prim.js; cat g4.js; echo "boot();"; echo "</script></body></html>"; } > ../index.html
ls -la ../index.html
