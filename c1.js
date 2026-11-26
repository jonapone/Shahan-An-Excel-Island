/* ===== CONTENT: The Drowned Reach (Beginner) ===== */
const STOPS=[];
function G(rows,o='A1'){const p=parseRef(o),r={};rows.forEach((row,i)=>row.forEach((v,j)=>{if(v!==null&&v!==undefined)r[colL(p.c+j)+(p.r+i)]=v}));return r}
const M=(...g)=>Object.assign({},...g);
const ST=o=>{STOPS.push(o);return o};
let _rid=0;const RD=(id,o)=>Object.assign({id},o);
/* ---- A1 ---- */
ST({id:'a1',reg:'a',at:[80,395],name:'Splashbury Landing',kind:'learn',xp:50,
 intro:'A ferryman with eleven fingers (you counted twice) hands you the fish-barrel tally. "Total\'s blank. Last accountant slipped off the pier. Gently. Mostly."',
 les:'Every formula starts with <code>=</code>. A range like <code>B2:B7</code> means "every cell from B2 down to B7". <code>=SUM(B2:B7)</code> adds them all. Never type the answer, point at the cells, so the result updates when the numbers do.',
 rounds:[RD('a1r',{ty:'f',q:'In <code>B8</code>, total the barrels landed Monday to Saturday.',d:G([['Day','Barrels'],['Mon',14],['Tue',9],['Wed',22],['Thu',17],['Fri',11],['Sat',9],['Total',null]]),tgt:'B8',sol:'=SUM(B2:B7)',vary:'B2:B7'})]});
/* ---- A2 ---- */
ST({id:'a2',reg:'a',at:[122,484],name:'Kelp Ferry',kind:'learn',xp:50,
 intro:'The Kelp Ferry charges per head and per bag, and swears the arithmetic is "traditional". You would like to check the tradition.',
 les:'Formulas can do maths with cell references: <code>+ - * /</code>. Write the formula once in the first row and Excel <b>fills it down</b>, shifting the row numbers for you. <code>=B2*C2</code> becomes <code>=B3*C3</code> in the next row.',
 rounds:[RD('a2r',{ty:'f',q:'Fill <code>D2:D5</code> with fare × tickets for each party. Write one formula in <code>D2</code>; it will be filled down.',d:G([['Party','Fare','Tickets','Total'],['Salt guild',12,4],['Net menders',9,7],['Lone pilgrim',15,1],['Eel choir',8,11]]),tgt:'D2',tgtR:['D2','D5'],sol:'=B2*C2',vary:['B2:B5','C2:C5']})]});
/* ---- A3 ---- */
ST({id:'a3',reg:'a',at:[312,522],name:'Mossy Landing',kind:'learn',xp:55,
 intro:'The tide-keeper has written down the water level every three hours since the flood of the Third Expedition. He wants to know "how dramatic it gets".',
 les:'<code>AVERAGE(range)</code>, <code>MIN(range)</code>, <code>MAX(range)</code> and <code>COUNT(range)</code> summarise a list of numbers. You can combine functions: <code>=MAX(A1:A9)-MIN(A1:A9)</code> is the spread between highest and lowest.',
 rounds:[RD('a3r',{ty:'f',q:'In <code>E2</code>, return the spread: the highest tide minus the lowest tide.',d:G([['Hour','Tide (cm)'],['00:00',140],['03:00',95],['06:00',60],['09:00',120],['12:00',210],['15:00',185],['18:00',90],['21:00',130]]),tgt:'E2',sol:'=MAX(B2:B9)-MIN(B2:B9)',vary:'B2:B9'})]});
/* ---- A4 ---- */
ST({id:'a4',reg:'a',at:[276,424],name:'Gillhaven Toll House',kind:'learn',xp:60,
 intro:'The toll house taxes everything at one rate, kept in a single cell. A clerk "improved" the sheet by typing the rate into every row. Then the rate changed.',
 les:'When a formula is filled down, references shift. To pin a cell, anchor it with dollar signs: <code>$E$2</code> never moves. <code>=A2*$E$2</code> filled down becomes <code>=A3*$E$2</code>. Change the rate once, every row follows.',
 rounds:[RD('a4r',{ty:'f',q:'Fill <code>B2:B6</code> with the tax on each toll, using the rate in <code>E2</code>. Anchor the rate so it survives filling down.',d:G([['Toll','Tax'],[120],[80],[45],[300],[65]]),tgt:'B2',tgtR:['B2','B6'],sol:'=A2*$E$2',vary:['A2:A6','E2']})]});
STOPS[3].rounds[0].d=M(STOPS[3].rounds[0].d,G([['Rate'],[0.2]],'E1'));
/* ---- A5 mini ---- */
ST({id:'a5',reg:'a',at:[258,306],name:'Bridge Troll Audit',kind:'mini',xp:130,
 intro:'Three trolls under a bridge hold your ledger hostage. "Answer our questions three," they say, and the largest adds, "we have only ever asked two, so this is exciting for us."',
 rounds:[
  RD('a5r1',{ty:'f',tx:'<b>Question one.</b> Weighing.',q:'In <code>D4</code>, compute the total toll: the combined weight of all carts (B2:B6) multiplied by the rate in <code>D2</code>.',d:G([['Cart','Weight','','Rate'],['Cheese',4,'',3],['Barrels',9],['Pilgrims',7],['Bones',2],['Lamps',5]]),tgt:'D4',sol:'=SUM(B2:B6)*D2',vary:['B2:B6','D2']}),
  RD('a5r2',{ty:'pred',tx:'<b>Question two.</b> Order of operations.',q:'What number will <code>A4</code> display? Excel multiplies before it adds.',d:G([[3],[8],[5],['=A1+A2*A3']]),tgt:'A4',show:'A4:  =A1+A2*A3'}),
  RD('a5r3',{ty:'dbg',tx:'<b>Question three.</b> A formula with a flaw.',q:'<code>D8</code> should show the <b>average</b> toll per cart (B2:B6). The formula that is there divides by the wrong thing. Fix it.',d:G([['Cart','Toll'],['Cheese',4],['Barrels',9],['Pilgrims',7],['Bones',2],['Lamps',5],[],[],['Average',null]]),tgt:'D8',pre:'=SUM(B2:B5)/COUNT(B2:B6)',sol:'=AVERAGE(B2:B6)',vary:'B2:B6'})]});
/* ---- A6 ---- */
ST({id:'a6',reg:'a',at:[210,287],name:'Bobbin Looms',kind:'learn',xp:60,
 intro:'Bobbin weaves sails for ships that mostly sink. Each loom needs a minimum number of thread spools, and nobody notices a shortage until the sail is half a sail.',
 les:'<code>=IF(test, if_true, if_false)</code> makes a decision. The test uses <code>= &lt; &gt; &gt;= &lt;= &lt;&gt;</code>. Text results go in "quotes": <code>=IF(B2&gt;=C2,"OK","Reorder")</code>.',
 rounds:[RD('a6r',{ty:'f',q:'Fill <code>D2:D6</code>: show <b>OK</b> if the loom has at least as many spools as it needs, otherwise <b>Reorder</b>.',d:G([['Loom','Spools','Needed','Status'],['Mainsail',12,10],['Jib',3,6],['Banner',8,8],['Shroud',2,9],['Pennant',15,4]]),tgt:'D2',tgtR:['D2','D6'],sol:'=IF(B2>=C2,"OK","Reorder")',vary:['B2:B6','C2:C6']})]});
/* ---- A7 ---- */
ST({id:'a7',reg:'a',at:[112,302],name:'Nettlewick Nets',kind:'learn',xp:65,
 intro:'The net-menders log every catch by species. A regulation says too many eels draws attention. Nobody remembers whose attention, which is the worrying part.',
 les:'<code>COUNTIF(range, criteria)</code> counts matching cells; <code>SUMIF(range, criteria, sum_range)</code> adds the matching ones from another column. Criteria can be text <code>"Eel"</code> or a test like <code>"&gt;10"</code>.',
 rounds:[RD('a7r',{ty:'f',q:'In <code>E2</code>, count how many catches in column A are <b>Eel</b>.',d:G([['Catch','Weight'],['Pike',12],['Eel',4],['Carp',9],['Eel',6],['Pike',15],['Eel',3],['Carp',8],['Eel',5]]),tgt:'E2',sol:'=COUNTIF(A2:A9,"Eel")',pool:[['A2:A9',['Pike','Eel','Carp']]],vary:'B2:B9'})]});
/* ---- A8 ---- */
ST({id:'a8',reg:'a',at:[172,392],name:'Willowmoor Name Tags',kind:'learn',xp:65,
 intro:'Willowmoor holds a festival where everyone wears a name tag in the form "J. Smith". The festival is tomorrow. The names are in two columns. You can see where this is going.',
 les:'Join text with <code>&amp;</code>. Slice it with <code>LEFT(text, n)</code>, <code>RIGHT(text, n)</code> and <code>MID(text, start, n)</code>. <code>LEN(text)</code> counts characters. Literal text goes in quotes: <code>=LEFT(A2,1)&amp;". "&amp;B2</code>.',
 rounds:[RD('a8r',{ty:'f',q:'Fill <code>C2:C5</code> with tags like <b>J. Smith</b>: the first letter of the first name, a full stop and a space, then the last name.',d:G([['First','Last','Tag'],['Jonas','Brook'],['Marta','Vance'],['Odo','Finch'],['Ilse','Raven']]),tgt:'C2',tgtR:['C2','C5'],sol:'=LEFT(A2,1)&". "&B2'})]});
/* ---- A9 mini ---- */
ST({id:'a9',reg:'a',at:[100,440],name:'Pike the Tax Collector',kind:'mini',xp:140,
 intro:'A pike the size of a rowing boat surfaces and clears its throat. It has an accountant\'s eyes and a fish\'s patience. "I will ask three things. You will answer in formulas."',
 rounds:[
  RD('a9r1',{ty:'f',tx:'<b>One.</b> Heavy loads.',q:'In <code>E2</code>, add up only the weights <b>above 50</b> (those are the loads that get taxed).',d:G([['Load','Weight'],['A',42],['B',68],['C',55],['D',31],['E',90],['F',50],['G',73]]),tgt:'E2',sol:'=SUMIF(B2:B8,">50")',vary:'B2:B8'}),
  RD('a9r2',{ty:'pick',tx:'<b>Two.</b> Four formulas, one is correct.',q:'<code>E2</code> must show the total weight of loads marked <b>Wet</b> in column A. Which formula does it?',d:G([['Type','Weight'],['Wet',10],['Dry',20],['Wet',30],['Dry',40]]),tgt:'E2',opts:['=SUMIF(B2:B5,"Wet",A2:A5)','=SUMIF(A2:A5,"Wet",B2:B5)','=COUNTIF(A2:A5,"Wet")','=SUM(A2:A5,"Wet")'],ans:1,why:'Remember the order: <code>SUMIF(range to test, criteria, range to add)</code>.'}),
  RD('a9r3',{ty:'f',tx:'<b>Three.</b> A decision with text.',q:'Fill <code>C2:C6</code>: show <b>Taxed</b> if the weight is more than 50, otherwise <b>Free</b>.',d:G([['Load','Weight','Ruling'],['A',42],['B',68],['C',55],['D',31],['E',90]]),tgt:'C2',tgtR:['C2','C6'],sol:'=IF(B2>50,"Taxed","Free")',vary:'B2:B6'})]});
/* ---- A10 boss ---- */
ST({id:'a10',reg:'a',at:[165,455],name:'Kevin the Kraken',kind:'boss',xp:300,
 intro:'Kevin the Kraken rises beside the ferry and unrolls an invoice long enough to wrap a mast. He has been billing the Drowned Reach for "ambient tide". "I am very good at this," he says. "You are about to find out how good."',
 rounds:[
  RD('a10r1',{ty:'f',tx:'<b>Invoice line one.</b> Tentacle surcharge.',q:'Fill <code>D2:D5</code> with <code>price × quantity × (1 + tax)</code>. The tax rate sits in <code>F2</code>; anchor it.',d:M(G([['Item','Price','Qty','Total'],['Ink',6,12],['Rope',14,5],['Lamp oil',9,8],['Sails',40,2]]),G([['Tax'],[0.1]],'F1')),tgt:'D2',tgtR:['D2','D5'],sol:'=B2*C2*(1+$F$2)',vary:['B2:B5','C2:C5','F2']}),
  RD('a10r2',{ty:'pred',tx:'<b>Invoice line two.</b> Kevin hides a nested decision.',q:'What does <code>C2</code> display? Work from the inside out.',d:G([[7,4,'=IF(A2>5,IF(B2>5,"Both","First"),"None")']],'A2'),tgt:'C2',show:'C2:  =IF(A2>5,IF(B2>5,"Both","First"),"None")   with A2 = 7 and B2 = 4'}),
  RD('a10r3',{ty:'dbg',tx:'<b>Invoice line three.</b> The $ went missing.',q:'<code>B2:B5</code> should apply the discount in <code>E2</code> to each price in A. After filling down, only the first row is right. Fix the formula (it is filled down automatically).',d:M(G([['Price','After discount'],[100],[250],[80],[40]]),G([['Discount'],[0.15]],'E1')),tgt:'B2',tgtR:['B2','B5'],pre:'=A2*(1-E2)',sol:'=A2*(1-$E$2)',vary:['A2:A5','E2']}),
  RD('a10r4',{ty:'f',tx:'<b>Invoice line four.</b> Average eel.',q:'In <code>E2</code>, give the <b>average weight of the Eel catches only</b>. Use SUMIF divided by COUNTIF (or AVERAGEIF, if you know it).',d:G([['Catch','Weight'],['Pike',12],['Eel',4],['Carp',9],['Eel',6],['Pike',15],['Eel',3],['Carp',8],['Eel',5]]),tgt:'E2',sol:'=AVERAGEIF(A2:A9,"Eel",B2:B9)',pool:[['A2:A9',['Pike','Eel','Carp']]],vary:'B2:B9'}),
  RD('a10r5',{ty:'f',tx:'<b>Final line.</b> Kevin demands a verdict.',q:'Fill <code>D2:D6</code>: show <b>Pay</b> if the amount is at least 100 <b>and</b> the status is "Overdue", otherwise <b>Wait</b>. Use <code>AND(test1, test2)</code> inside IF.',d:G([['Client','Amount','Status','Verdict'],['Ferrywick',120,'Overdue'],['Gillhaven',80,'Overdue'],['Pike',200,'Paid'],['Moss',150,'Overdue'],['Trolls',100,'Overdue']]),tgt:'D2',tgtR:['D2','D6'],sol:'=IF(AND(B2>=100,C2="Overdue"),"Pay","Wait")',vary:'B2:B6'})]});
