SCRIPT.push(
{id:'text',t:'8. Text is data too',b:`<p>Text in Excel is just characters in a row, and functions can cut and join them. <code>LEFT(text, n)</code> takes the first n characters, <code>RIGHT</code> the last n, <code>MID(text, start, n)</code> takes n characters starting at a position (1 = the first character).</p>
<p><code>LEN</code> counts characters. <code>FIND("-", text)</code> returns the position of a character, which lets you cut at a spot that moves: <code>=LEFT(A2, FIND("-",A2)-1)</code> means "everything before the dash".</p>
<p><b>Cleaning chain:</b> <code>TRIM</code> removes stray spaces, <code>PROPER / UPPER / LOWER</code> fix capitals, <code>SUBSTITUTE(text, old, new)</code> replaces pieces. Chain them from the inside out.</p>
<p><b>Text that looks like a number is NOT a number.</b> The cell may show 12, but if it is stored as text Excel cannot add it. <code>VALUE("12")</code> turns number-looking text into a real number. After removing units like "kg" with SUBSTITUTE, wrap the result in VALUE to make it usable.</p>`},
{id:'date',t:'9. Dates are numbers',b:`<p>Behind the scenes every date is a plain number: the count of days since 1900. Today is around 46000. That is why you can add days (<code>=A2+90</code>) or compare dates (<code>A2&lt;B2</code>) just like numbers.</p>
<p><code>DATE(2025,3,4)</code> builds a date. <code>YEAR</code>, <code>MONTH</code>, <code>DAY</code> take one apart.</p>
<p><code>TEXT(date, "mmm")</code> <b>displays</b> a date as text in a format you choose: <code>"mmm"</code> gives Mar, <code>"mmmm"</code> gives March, <code>"yyyy"</code> the year, <code>"dd/mm/yyyy"</code> a full date.</p>
<p>If a cell shows 45720 where you expected a date, nothing is broken. It is a date shown without date formatting.</p>`},
{id:'arr',t:'10. Arrays, spilling and naming',b:`<p>Modern Excel can return <b>a whole list</b> from one formula. The results <b>spill</b> into the cells below and beside the formula cell. You write it once in the top-left cell.</p>
<p><code>FILTER(table, test)</code>: keep only rows where the test is TRUE. <code>SORT(range, col, order)</code> sorts. <code>UNIQUE(range)</code> removes duplicates. They nest: <code>=SORT(UNIQUE(A2:A9))</code> removes duplicates first, then sorts.</p>
<p><b>Think in whole columns.</b> <code>B2:B9&gt;50</code> is not one answer; it is a column of TRUE/FALSE, one per row. FILTER uses that column to decide which rows survive. Multiplying such columns (<code>(A2:A9="Red")*B2:B9</code>) turns TRUE into 1 and FALSE into 0, which is what SUMPRODUCT adds up.</p>
<p><b>LET</b> gives a name to a calculation you reuse: <code>=LET(t, SUM(B2:B7), IF(t&gt;500, t*0.9, t))</code>. Read it as "let t be the sum, then do this with t". The name lives only inside that formula.</p>`},
{id:'code',t:'11. Reading VBA and Office Scripts',b:`<p>You are not asked to write macros, only to <b>read</b> them and predict what they do. The method never changes: <b>make a trace table</b>.</p>
<p>List every variable as a column. Walk through the code line by line, one pass of the loop per row, and update the values. When the loop ends, the answer is in the table.</p>
<p><b>Loops:</b> <code>For i = 1 To 5</code> repeats with i = 1, 2, 3, 4, 5. In Office Scripts <code>for (let r = 0; r &lt; 4; r++)</code> repeats with r = 0, 1, 2, 3. <b>Stop before 4</b>, because <code>&lt;</code> excludes the limit.</p>
<p><b>Zero-based vs one-based:</b> VBA counts from 1 (<code>Cells(1,1)</code> is A1). Office Scripts count from 0 (<code>getCell(0,0)</code> is A1).</p>
<p><b>Handy bits:</b> <code>x Mod 2 = 1</code> means x is odd. <code>If … Then</code> runs a line only when its test is TRUE. <code>Exit For</code> leaves the <i>innermost</i> loop immediately.</p>
<p><b>Finding a bug:</b> read each line and ask "what exactly does this do?" Common culprits: the wrong column number, a loop that stops one row short, and a comparison pointing the wrong way (<code>&lt;</code> instead of <code>&gt;</code>).</p>`},
{id:'dbg',t:'12. How to debug a formula',b:`<p>When a formula misbehaves, do not guess. Run this checklist:</p>
<p><b>1. Read the error.</b> <code>#NAME?</code>: something is misspelled or text lacks quotes. <code>#N/A</code>: a lookup found nothing. <code>#DIV/0!</code>: divided by zero or blank. <code>#VALUE!</code>: wrong type of input. <code>#REF!</code>: pointing at a cell that does not exist.</p>
<p><b>2. Evaluate from the inside out.</b> Work out the innermost bracket by hand, then the next, with real numbers from the cells.</p>
<p><b>3. Check the rows below.</b> Works in row 2 but not row 5? A missing <code>$</code>, or a reference that drifted.</p>
<p><b>4. Check argument order.</b> SUMIFS wants the sum range first, SUMIF wants it last. VLOOKUP wants a column <i>number</i>; XLOOKUP wants a <i>range</i>.</p>
<p><b>5. Test the boundary.</b> Try the exact value where the rule changes: 100 for "at least 100".</p>`},
{id:'think',t:'13. Thinking like an analyst',b:`<p>Formulas are the easy part. The hard part is trusting the answer. Before you calculate, ask:</p>
<p><b>What belongs in this number?</b> An average that includes refunds or blanks tells a different story. Decide what counts first, then choose the function that matches.</p>
<p><b>Is the data clean?</b> Look for duplicates (<code>COUNTIF</code> above 1), text-stored numbers, stray spaces and impossible values.</p>
<p><b>Does it survive change?</b> A formula that references cells keeps working when the data changes. One with typed-in numbers does not.</p>
<p><b>Does the answer pass a sanity check?</b> If an average is bigger than your biggest value, something is wrong. Estimate roughly before trusting the cell.</p>
<p><b>Break rules into pieces.</b> A long rule chain becomes manageable when you write it in plain words first, turn each piece into a test, and combine them one layer at a time.</p>`});
const SCR_BY=id=>SCRIPT.find(c=>c.id===id);
