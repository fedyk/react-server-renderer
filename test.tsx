import assert from "node:assert/strict"
import React from "./node-tsx.js"

assert.equal(React.render(<>Hello</>), "Hello")

assert.equal(React.render(<div>Hello</div>), `<div>Hello</div>`)

assert.equal(React.render(<div>Hello </div>), `<div>Hello </div>`)

assert.equal(React.render(<div className="test">Hello</div>), `<div class="test">Hello</div>`)

function Test1(props: {
  text: string
}) {
  return <span>{props.text}</span>
}

assert.equal(React.render(<Test1 text="test1"/>), `<span>test1</span>`)

function Test2() {
  return <a href="/home">Link</a>
}

assert.equal(React.render(<Test2 />), `<a href="/home">Link</a>`)

function Test3() {
  return <img src="img.png" />
}

assert.equal(React.render(<Test3 />), `<img src="img.png"/>`)
