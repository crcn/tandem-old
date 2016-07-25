Notes:

- There are many ways to diff a DOM tree
- Possibly better performs diffs according to the least expensive ops - use scoring method
  -

Brainstorming:

a

<div>
  hello
  <span>
</div>

b

<div>
  <span />
</div>

c

[
  { type: 'remove', path: [0] }
]

----------------------------------------------------

a

<div>
  hello
  <span>
</div>

b

<div>
  <span />
  hello
</div>

c

[
  { type: 'moveChild', path: [1], dest: [0] }
]

----------------------------------------------------

a

<div>
  hello
  <div>
    <h1>Blarg</h1>
  </div>
</div>

b

<div>
  <div>blab</div>
  <div>blarg</div>
  <div>
    <h1>blob</h1>
  </div>
</div>

c

[
  { type: 'removeChild', path: [0] },
  { type: 'addChild', path: [0], node:<div>blab</div> },
  { type: 'addChild', path: [1], node:<div>blab</div> },
  { type: 'changeNodeValue', path: [2, 0, 0], nodeValue: 'blob' }
]

----------------------------------------------------

a

<div>
  <div id="a">1</div>
  <div id="b">2</div>
</div>

b

<div>
  <div id="b">3</div>
  <div id="a">1</div>
</div>

c

[
  { type: 'move', path: [1], dest: [0] },
  { type: 'changeNodeVaue', path: [0, 0], nodeValue: '3' }
]

----------------------------------------------------

a

<div>
  <div class="a"><h1>1</h1></div>
  <div class="a">2</div>
</div>

b

<div>
  <div class="a">1</div>
  <div class="a"><h1>2</h1></div>
</div>

c

[
  { type: 'move', path: [0], dest: [1] },
  { type: 'changeNodeVaue', path: [1, 0, 0], nodeValue: '2 }
]

----------------------------------------------------