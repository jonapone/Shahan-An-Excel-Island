/* ===== SCRIPTURE: how Excel thinks ===== */
const SCRIPT=[
{id:'cells',t:'1. Cells, values and formulas',b:`<p>A spreadsheet is a grid of boxes called <b>cells</b>. Each has an address: column letter first, then row number. <code>B3</code> is column B, row 3.</p>
<p>A cell holds either a <b>value</b> (the number 14, the word Eel) or a <b>formula</b>. A formula always starts with <code>=</code>. That is how Excel knows you want it to <i>calculate</i> rather than just store text.</p>
<p><b>The big idea:</b> a formula does not store an answer. It stores a <i>recipe</i>. Change a number the recipe points at and the answer changes by itself. This is why you point at cells instead of typing numbers: <code>=B2*3</code> is alive; <code>=42</code> is dead.</p>
<p><b>Mini-test:</b> if B2 is 14, what does <code>=B2+1</code> show? 15. If B2 becomes 20? 21, without you touching the formula.</p>`},
{id:'refs',t:'2. Ranges, filling down and the dollar sign',b:`<p>A <b>range</b> is a block of cells: <code>B2:B7</code> means "from B2 down to B7, every cell". Functions like SUM take ranges.</p>
<p><b>Filling down.</b> You write a formula once and copy it down the column. Excel shifts the row numbers for you: <code>=B2*C2</code> becomes <code>=B3*C3</code>, then <code>=B4*C4</code>. These are <b>relative references</b>: they move with the formula.</p>
<p>Sometimes a reference must <i>not</i> move, like a single tax rate in <code>E2</code>. Lock it with dollar signs: <code>$E$2</code>. Think of <code>$</code> as a nail: it pins the column (<code>$E</code>) and the row (<code>$2</code>).</p>
<p><b>Rule of thumb:</b> the thing that changes per row stays relative (<code>A2</code>); the thing that is the same for every row gets nails (<code>$E$2</code>). A table you look things up in is almost always nailed: <code>$A$2:$B$7</code>.</p>
<p><b>Check yourself:</b> if a formula works in row 2 and breaks lower down, a missing <code>$</code> is the first suspect.</p>`},
{id:'ops',t:'3. Operators and order of operations',b:`<p>Excel does maths in a fixed order, the same as school: brackets first, then <code>^</code>, then <code>* /</code>, then <code>+ -</code>. So <code>=3+8*5</code> is 43, not 55. Use brackets to force what you mean: <code>=(3+8)*5</code> is 55.</p>
<p>Other operators you will meet:</p>
<p><code>&amp;</code> joins text: <code>="Dr. "&amp;A2</code>. <code>= &lt; &gt; &lt;= &gt;= &lt;&gt;</code> compare two things and answer TRUE or FALSE. <code>&lt;&gt;</code> means "is not equal to".</p>
<p><b>Careful with limits.</b> "At least 100" is <code>&gt;=100</code> (100 passes). "More than 100" is <code>&gt;100</code> (100 fails). Most mistakes at boundaries come from picking the wrong one. Always test the exact boundary value.</p>`},
{id:'fn',t:'4. Functions: name, brackets, arguments',b:`<p>A <b>function</b> is a ready-made tool: a name, then brackets, then <b>arguments</b> separated by commas. <code>=ROUND(2.567, 1)</code> has two arguments: the number, and how many decimals.</p>
<p><b>Text goes in quotes.</b> <code>"Eel"</code> is text. Without quotes Excel thinks <code>Eel</code> is the name of something and shows <code>#NAME?</code>. Numbers and cell references never get quotes.</p>
<p><b>Placeholders are not real.</b> When a lesson shows <code>=DATE(y,m,d)</code>, the <code>y m d</code> are labels for you to replace with real values or cells.</p>
<p><b>Nesting: read from the inside out.</b> <code>=PROPER(TRIM(A2))</code>: TRIM runs first, then PROPER works on its result. Whenever you meet a long formula, find the innermost brackets and work outward, writing down each intermediate result.</p>
<p><b>Commas vs semicolons:</b> some regional versions of Excel separate arguments with <code>;</code>. This game always uses commas.</p>`},
{id:'tf',t:'5. TRUE and FALSE: how Excel decides',b:`<p>Excel makes decisions with <b>tests</b>: questions with a TRUE or FALSE answer. <code>B2&gt;=100</code> asks "is B2 at least 100?".</p>
<p><code>IF(test, result_if_true, result_if_false)</code> has exactly <b>three slots</b>. The test goes in the first. What to show goes in the other two. Nothing else fits.</p>
<p>To combine tests, use functions <i>inside</i> the first slot:</p>
<p><code>AND(t1, t2)</code>: all must be TRUE. <code>OR(t1, t2)</code>: at least one. <code>NOT(t)</code>: flips it.</p>
<p><code>=IF(OR(AND(B2&lt;=80,C2&gt;=3),D2="Yes"),"Enter","Turn back")</code></p>
<p><b>How to build one:</b> (1) say the rule in plain words, (2) write each piece as a test, (3) join the tests with AND / OR, (4) wrap the whole thing in IF. The words "and", "or" in the rule become the functions AND, OR.</p>
<p><b>Three or more outcomes:</b> put another IF in the "false" slot: <code>IF(B2&lt;10,"Small",IF(B2&lt;50,"Medium","Large"))</code>. Excel stops at the first TRUE, so order the tests from smallest to largest.</p>`},
{id:'cond',t:'6. Counting and adding with a condition',b:`<p>Often you want "only the rows where…". The IF family does that:</p>
<p><code>COUNTIF(range, criteria)</code>: how many match.<br><code>SUMIF(range, criteria, sum_range)</code>: add up <i>another column</i> for the matching rows.<br><code>AVERAGEIF</code>: the average of the matching rows.</p>
<p><b>Criteria</b> is the rule. Text in quotes: <code>"Eel"</code>. A comparison also in quotes: <code>"&gt;50"</code>. A cell reference: <code>E2</code>.</p>
<p><b>Picture it:</b> SUMIF walks down two columns side by side. Where the first column passes the test, it grabs the number from the second column. That is why the two ranges must be the same height.</p>
<p><b>Several conditions:</b> the plural versions (<code>SUMIFS</code>, <code>COUNTIFS</code>, <code>AVERAGEIFS</code>, <code>MAXIFS</code>) take pairs of range and criteria, and a row counts only if it passes <b>all</b> of them. In SUMIFS and MAXIFS the range you want the answer from comes <b>first</b>.</p>`},
{id:'look',t:'7. Lookups: finding a thing by its name',b:`<p>A lookup answers: "given this key, what is the matching value in my table?" Like a phone book: find the name, read across.</p>
<p><b>VLOOKUP(key, table, col, 0)</b>: searches the <i>first column</i> of the table downward, then moves <code>col</code> columns to the right on that row. The <code>0</code> means exact match. Always include it.</p>
<p><b>INDEX + MATCH:</b> <code>MATCH(key, range, 0)</code> tells you <i>which position</i> the key is at. <code>INDEX(range, position)</code> gives you the item at that position, in any column, even left of the key.</p>
<p><b>XLOOKUP(key, look_range, return_range, if_not_found)</b>: you give two separate ranges, one to search and one to answer from. Exact by default, any direction, and a built-in "not found" message.</p>
<p><b>Approximate (tier) lookups:</b> sorted thresholds like 0, 50, 70, 85. You get the row with the biggest threshold <i>not above</i> your value. 74 lands on 70.</p>
<p><b>Errors:</b> <code>#N/A</code> means the key was not found. Wrap in <code>IFERROR(…, "text")</code> to give a friendly answer. Note that IFERROR must wrap the <i>whole</i> lookup.</p>`},
];
