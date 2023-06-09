import assert from "node:assert/strict"
import React from "./react-server-renderer.js"

assert.equal(React.renderToStaticMarkup(<>Hello</>), "Hello")

assert.equal(React.renderToStaticMarkup(<div>Hello</div>), `<div>Hello</div>`)

assert.equal(React.renderToStaticMarkup(<div>Hello </div>), `<div>Hello </div>`)

assert.equal(React.renderToStaticMarkup(<div className="test">Hello</div>), `<div class="test">Hello</div>`)

function Test1(props: {
  text: string
}) {
  return <span>{props.text}</span>
}

assert.equal(React.renderToStaticMarkup(<Test1 text="test1"/>), `<span>test1</span>`)

function Test2() {
  return <a href="/home">Link</a>
}

assert.equal(React.renderToStaticMarkup(<Test2 />), `<a href="/home">Link</a>`)

function Test3() {
  return <img src="img.png" />
}

assert.equal(React.renderToStaticMarkup(<Test3 />), `<img src="img.png"/>`)

function Test4() {
  return <div>{"<img onerror=alert(1) />"}</div>
}

assert.equal(React.renderToStaticMarkup(<Test4 />), `<div>&lt;img onerror=alert(1) /&gt;</div>`)

function Test5() {
  return <div id='"><script>alert(1)</script>'>test5</div>
}

assert.equal(React.renderToStaticMarkup(<Test5 />), `<div id="&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;">test5</div>`)
