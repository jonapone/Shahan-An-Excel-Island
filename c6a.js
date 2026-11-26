/* ===== BRIDGE STOPS + GATEKEEPERS: Drowned Reach (a) and Sunscar (d) ===== */
STOPS.forEach(s=>{s.ord=parseInt(s.id.slice(1))*10});
const NW=(o)=>ST(Object.assign({kind:'learn',mid:1},o));
/* ---- REACH ---- */
NW({id:'a1b',reg:'a',ord:15,name:'The Ferryman\'s Slate',xp:45,
 intro:'The ferryman scratches cell names on a slate: "B3", "C2". He asks you to read them aloud like a captain reads a chart.',
 les:'A formula with cell references does not use the <i>address</i>, it uses the <b>value sitting in it</b>. If <code>A2</code> holds 5 and <code>B2</code> holds 8, then <code>=A2+B2</code> shows 13. Change A2 and the answer follows.',
 rounds:[
  RD('a1br1',{ty:'pred',q:'What number does <code>C2</code> show?',d:{A2:5,B2:8,C2:'=A2+B2'},tgt:'C2',show:'C2:  =A2+B2   with A2 = 5 and B2 = 8'}),
  RD('a1br2',{ty:'f',q:'In <code>C3</code> write a formula that adds <code>A3</code> and <code>B3</code>. Use the cell references, not the numbers.',d:G([[12,30]],'A3'),tgt:'C3',sol:'=A3+B3',vary:['A3:B3']})]});
NW({id:'a2b',reg:'a',ord:25,name:'Brackets at the Kelp Quay',xp:50,
 intro:'The quay-master insists "multiplication before addition" is a rumour. You are about to prove it is not.',
 les:'Excel multiplies and divides <b>before</b> it adds and subtracts. <code>=2+3*4</code> is 14 (3×4 first). To change the order, use brackets: <code>=(2+3)*4</code> is 20. Work inside the brackets first.',
 rounds:[
  RD('a2br1',{ty:'pred',q:'What number does <code>A1</code> show?',d:{A1:'=2+3*4'},tgt:'A1',show:'A1:  =2+3*4'}),
  RD('a2br2',{ty:'f',q:'In <code>D2</code> compute <b>(B2 + C2) × A2</b>: add the two crews, then multiply by the days. You need brackets.',d:G([[3,10,6]],'A2'),tgt:'D2',sol:'=(B2+C2)*A2',vary:['A2:C2']})]});
NW({id:'a3b',reg:'a',ord:35,name:'The Tally Counter',xp:55,
 intro:'The counter-clerk keeps a tally of boat visits. Some days say "n/a" because the boat sank. She wants to know how many days were actually recorded.',
 les:'<code>COUNT(range)</code> counts only cells that contain <b>numbers</b>. <code>COUNTA(range)</code> counts every cell that is <b>not empty</b>, text included. Pick the one that matches the question.',
 rounds:[
  RD('a3br1',{ty:'f',q:'In <code>D2</code>, count how many days have a <b>number</b> recorded in <code>B2:B8</code> (ignore "n/a" and blanks).',d:G([['Day','Visits'],['Mon',14],['Tue','n/a'],['Wed',9],['Thu'],['Fri',22],['Sat','n/a'],['Sun',17]]),tgt:'D2',sol:'=COUNT(B2:B8)',pool:[['B2:B8',[14,'n/a',9,null,22,17,5,'n/a'],1]]}),
  RD('a3br2',{ty:'f',q:'In <code>D3</code>, count how many cells in <code>B2:B8</code> are <b>not empty</b> (the "n/a" entries count too).',d:G([['Day','Visits'],['Mon',14],['Tue','n/a'],['Wed',9],['Thu'],['Fri',22],['Sat','n/a'],['Sun',17]]),tgt:'D3',sol:'=COUNTA(B2:B8)',pool:[['B2:B8',[14,'n/a',9,null,22,17,5,'n/a'],1]]})]});
NW({id:'a4b',reg:'a',ord:45,name:'The Pinned Rate',xp:60,
 intro:'The toll-house clerk keeps losing his place in the rate table. "I pin one thing and the rest slides away," he says, which is the exact opposite of what you want.',
 les:'When you fill a formula down, every normal reference <b>slides</b> with it. A reference with <code>$</code> <b>stays put</b>. Ask of each reference: "should this change in the next row, or stay the same?" Slides: <code>A2</code>. Stays: <code>$E$1</code>.',
 rounds:[
  RD('a4br1',{ty:'pick',q:'<code>C2</code> must be <code>A2 × the rate in E1</code>. The formula will be filled down to C6. Which one is correct?',d:{A1:'Price',C1:'Total',D1:'Rate:',E1:1.2,A2:10,A3:20,A4:15},tgt:'C2',opts:['=A2*E1','=A2*$E$1','=$A$2*E1','=$A$2*$E$1'],ans:1,why:'The price must move to A3, A4… (no dollars). The rate must stay on E1 (dollars). Check what each option would become in row 3.'}),
  RD('a4br2',{ty:'f',q:'Fill <code>C2:C5</code> with the price converted using the exchange rate in <code>F1</code>: <code>price × rate</code>. Anchor the rate.',d:M(G([['Gold','','Local'],[40],[15],[75],[22]],'A1'),{E1:'Rate:',F1:1.5}),tgt:'C2',tgtR:['C2','C5'],sol:'=A2*$F$1',vary:['A2:A5','F1']})]});
NW({id:'ag',reg:'a',ord:37,kind:'mini',name:'Warden Pellet of the Tally Gate',xp:140,
 intro:'Warden Pellet guards the tally gate with a ledger and a very flat expression. "Before you go on, show me you understand what you have been doing. Three entries. Do not smudge."',
 rounds:[
  RD('agr1',{ty:'f',tx:'<b>Entry one.</b> Average, the long way.',q:'In <code>E2</code> compute the average of <code>B2:B7</code> using <b>SUM divided by COUNT</b> (do not use AVERAGE).',d:G([['Boat','Crew'],['Eel',8],['Kelp',12],['Salt',5],['Reed',9],['Pike',14],['Moss',7]]),tgt:'E2',sol:'=SUM(B2:B7)/COUNT(B2:B7)',vary:'B2:B7'}),
  RD('agr2',{ty:'f',tx:'<b>Entry two.</b> A pinned rate.',q:'Fill <code>C2:C5</code> with each toll in A times the rate in <code>F1</code>. Anchor the rate.',d:M(G([['Toll','','Total'],[30],[12],[45],[8]],'A1'),{E1:'Rate:',F1:3}),tgt:'C2',tgtR:['C2','C5'],sol:'=A2*$F$1',vary:['A2:A5','F1']}),
  RD('agr3',{ty:'pred',tx:'<b>Entry three.</b> Brackets matter.',q:'What number does <code>D1</code> show?',d:{A1:6,B1:4,C1:3,D1:'=A1+B1*C1-(A1-B1)'},tgt:'D1',show:'D1:  =A1+B1*C1-(A1-B1)   with A1 = 6, B1 = 4, C1 = 3'})]});
NW({id:'a6b',reg:'a',ord:65,name:'Is It Bigger?',xp:60,
 intro:'Bobbin\'s apprentice cannot yet tell whether a loom beat its target. "I just feel it," he says. Excel does not feel. It tests.',
 les:'A comparison like <code>B2&gt;C2</code> is a question. Excel answers with <b>TRUE</b> or <b>FALSE</b>. That answer is what IF reads. <code>=B2&gt;=C2</code> is TRUE when B2 is bigger <i>or equal</i>. Practise asking the question before wrapping it in IF.',
 rounds:[
  RD('a6br1',{ty:'pred',q:'What does <code>C1</code> display?',d:{A1:7,B1:7,C1:'=A1>B1'},tgt:'C1',show:'C1:  =A1>B1   with A1 = 7 and B1 = 7'}),
  RD('a6br2',{ty:'f',q:'Fill <code>D2:D5</code> with <b>TRUE</b> if the sales in B beat the target in C (strictly more), otherwise FALSE.',d:G([['Loom','Sales','Target','Beat?'],['A',12,10],['B',8,8],['C',5,9],['D',20,15]]),tgt:'D2',tgtR:['D2','D5'],sol:'=B2>C2',vary:['B2:C5']})]});
/* ---- SUNSCAR ---- */
NW({id:'d1b',reg:'d',ord:15,name:'The Phone-Book Stall',xp:60,
 intro:'A stall-keeper hands you a battered price list and a question: "If I say Salt, what do you say back?" He has asked this of four hundred customers and trusts none of them.',
 les:'A VLOOKUP is a chain of three actions: <b>find</b> the key in the first column, <b>move across</b> the number of columns you ask for, <b>read</b> the cell. Count columns from the table\'s own first column (1 = the key column, 2 = the next one).',
 rounds:[
  RD('d1br1',{ty:'pred',q:'What does <code>F2</code> display?',d:M(G([['Goods','Price'],['Saffron',48],['Salt',6],['Dates',12]]),{E2:'Salt',F2:'=VLOOKUP(E2,A2:B4,2,FALSE)'}),tgt:'F2',show:'F2:  =VLOOKUP(E2,A2:B4,2,FALSE)   with E2 = "Salt"'}),
  RD('d1br2',{ty:'pick',q:'In <code>=VLOOKUP(E2,A2:C4,3,FALSE)</code> what does the <b>3</b> mean?',d:G([['Goods','Price','Stock'],['Saffron',48,10],['Salt',6,200],['Dates',12,35]]),tgt:'F2',opts:['Search for the value in column C','Return the value from the 3rd column of the table (C)','Look for the value 3 times','Skip 3 rows down'],ans:1,why:'Count from the first column of the table: A = 1, B = 2, C = 3.'})]});
NW({id:'d2b',reg:'d',ord:25,name:'Which Row Is It?',xp:70,
 intro:'The turtle herder does not want the load. He wants to know <i>which turtle in the line</i> carries it: "third from the front, second from the back". Position, not value.',
 les:'<code>MATCH(value, range, 0)</code> answers "<b>which position</b> in this list is the value at?". The first item is position 1. The final <code>0</code> demands an exact match. It is half of INDEX + MATCH: first find the position, then fetch what you want from that position.',
 rounds:[RD('d2br',{ty:'f',q:'In <code>F2</code> return the <b>position</b> (1 for the first name, 2 for the second…) of the turtle named in <code>E2</code> within the list <code>A2:A7</code>.',d:M(G([['Turtle'],['Brine'],['Pearl'],['Quill'],['Marrow'],['Dune'],['Hush']]),{E2:'Quill'}),tgt:'F2',sol:'=MATCH(E2,A2:A7,0)',shuf:'A2:A7'})]});
NW({id:'d3b',reg:'d',ord:35,name:'Two Keys, One Gate',xp:70,
 intro:'The Dune Gate has a new rule: some caravans pass on weight alone, others need a permit as well. The gatekeeper refuses to say which, so you must write down both versions.',
 les:'<code>AND(test1, test2)</code> is TRUE only when <b>both</b> are TRUE. <code>OR(test1, test2)</code> is TRUE when <b>at least one</b> is. They go inside IF\'s first slot: <code>=IF(AND(B2&lt;50,C2="Yes"),"Open","Closed")</code>.',
 rounds:[
  RD('d3br1',{ty:'f',q:'Fill <code>D2:D6</code>: <b>Open</b> if the weight is under 50 <b>and</b> the permit (column C) is "Yes"; otherwise <b>Closed</b>.',d:G([['Caravan','Weight','Permit','Gate'],['Spice',42,'Yes'],['Brick',70,'Yes'],['Water',30,'No'],['Salt',48,'Yes'],['Silk',12,'No']]),tgt:'D2',tgtR:['D2','D6'],sol:'=IF(AND(B2<50,C2="Yes"),"Open","Closed")',vary:'B2:B6'}),
  RD('d3br2',{ty:'f',q:'Same table, new rule. Fill <code>D2:D6</code>: <b>Open</b> if the weight is under 50 <b>or</b> the permit is "Yes"; otherwise <b>Closed</b>.',d:G([['Caravan','Weight','Permit','Gate'],['Spice',42,'Yes'],['Brick',70,'Yes'],['Water',30,'No'],['Salt',48,'Yes'],['Silk',72,'No']]),tgt:'D2',tgtR:['D2','D6'],sol:'=IF(OR(B2<50,C2="Yes"),"Open","Closed")',vary:'B2:B6'})]});
NW({id:'dg',reg:'d',ord:37,kind:'mini',name:'The Dune Gatekeeper',xp:160,
 intro:'A carved gatekeeper with the face of a tired accountant steps out of the sand. "You have learned to find things and to decide. Show me both. Three tests."',
 rounds:[
  RD('dgr1',{ty:'f',tx:'<b>Test one.</b> Find to the left.',q:'In <code>F2</code> return the load (column A) carried by the turtle named in <code>E2</code> (names are in column B). Use INDEX with MATCH.',d:M(G([['Load','Turtle'],[320,'Brine'],[410,'Pearl'],[275,'Quill'],[390,'Marrow']]),{E2:'Quill'}),tgt:'F2',sol:'=INDEX(A2:A5,MATCH(E2,B2:B5,0))',shuf:'B2:B5',vary:'A2:A5'}),
  RD('dgr2',{ty:'pred',tx:'<b>Test two.</b> A tier lookup.',q:'What does <code>D2</code> display? With a final <code>TRUE</code>, VLOOKUP returns the row with the biggest value that is not above the key.',d:M(G([[0,'Small'],[50,'Medium'],[80,'Large']],'A1'),{C2:65,D2:'=VLOOKUP(C2,A1:B3,2,TRUE)'}),tgt:'D2',show:'D2:  =VLOOKUP(C2,A1:B3,2,TRUE)   with C2 = 65 and the table in A1:B3 (0 Small, 50 Medium, 80 Large)'}),
  RD('dgr3',{ty:'f',tx:'<b>Test three.</b> Either way in.',q:'Fill <code>D2:D6</code>: <b>Enter</b> if the load is at most 60 <b>and</b> there are at least 2 turtles, <b>or</b> the permit is "Yes"; otherwise <b>Stay out</b>.',d:G([['Caravan','Load','Turtles','Permit','Ruling'],['Amber',55,3,'No'],['Brick',90,5,'Yes'],['Dates',40,1,'No'],['Spice',60,2,'No'],['Salt',95,6,'No']]),tgt:'E2',tgtR:['E2','E6'],sol:'=IF(OR(AND(B2<=60,C2>=2),D2="Yes"),"Enter","Stay out")',vary:['B2:B6','C2:C6']})]});
NW({id:'d4b',reg:'d',ord:45,name:'Two Conditions at Once',xp:75,
 intro:'The cistern clerk wants totals by district, then by district <i>and</i> season. "One condition I can do with my eyes closed," he says, closing them. "Two, I need help."',
 les:'<code>SUMIF(range, criteria, sum_range)</code> adds the numbers from <code>sum_range</code> where <code>range</code> matches one test. For <b>two or more</b> tests, use <code>SUMIFS(sum_range, range1, crit1, range2, crit2)</code>. Notice the sum range comes <b>first</b> in SUMIFS.',
 rounds:[
  RD('d4br1',{ty:'f',q:'In <code>F2</code> add up the litres (column C) for the <b>Upper</b> district only. One condition: use SUMIF.',d:G([['District','Season','Litres'],['Upper','Spring',40],['Lower','Spring',65],['Upper','Summer',30],['Lower','Summer',25],['Upper','Spring',55],['Lower','Spring',15]]),tgt:'F2',sol:'=SUMIF(A2:A7,"Upper",C2:C7)',pool:[['A2:A7',['Upper','Lower']]],vary:'C2:C7'}),
  RD('d4br2',{ty:'f',q:'In <code>F2</code> add up the litres for <b>Upper</b> district in <b>Spring</b> only. Two conditions: use SUMIFS.',d:G([['District','Season','Litres'],['Upper','Spring',40],['Lower','Spring',65],['Upper','Summer',30],['Lower','Summer',25],['Upper','Spring',55],['Lower','Spring',15]]),tgt:'F2',sol:'=SUMIFS(C2:C7,A2:A7,"Upper",B2:B7,"Spring")',pool:[['A2:A7',['Upper','Lower']],['B2:B7',['Spring','Summer']]],vary:'C2:C7'})]});
NW({id:'d8b',reg:'d',ord:85,name:'Number or Just Text?',xp:80,
 intro:'The oasis scribe imported his figures from an old scroll. They look like numbers. They behave like words. The scribe does not see the difference. Excel does.',
 les:'Text that <i>looks</i> like a number is still text. <code>SUM</code> ignores it. <code>VALUE(text)</code> converts it to a real number. If a unit is stuck to it ("12kg"), remove the unit with <code>SUBSTITUTE(text, "kg", "")</code> first, then wrap in <code>VALUE</code>.',
 rounds:[
  RD('d8br1',{ty:'f',q:'Fill <code>B2:B5</code> with the real <b>number</b> for each text entry in column A (they are stored as text).',d:G([['Text','Number'],['12'],['7'],['150'],['23']]),tgt:'B2',tgtR:['B2','B5'],sol:'=VALUE(A2)',vary:'A2:A5'}),
  RD('d8br2',{ty:'f',q:'Fill <code>B2:B5</code> with the number from entries like <b>"12kg"</b>: remove the "kg", then convert to a number.',d:G([['Weight','Number'],['12kg'],['7kg'],['150kg'],['23kg']]),tgt:'B2',tgtR:['B2','B5'],sol:'=VALUE(SUBSTITUTE(A2,"kg",""))'})]});
