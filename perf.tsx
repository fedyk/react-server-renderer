import { performance } from "node:perf_hooks"
import React1 from "./react-server-renderer.js"
import React2 from "react"
import ReactDOMServer from "react-dom/server"

function createSample(React: unknown, renderer: any) {
  function Test1() {
    return <div>
      <span>Hello</span>
      <a href="#" >World</a>
    </div>
  }

  function render() {
    return renderer(<Test1/>)
  }

  return render
}


const sample1 = createSample(React1, React1.renderToStaticMarkup)
const sample2 = createSample(React2, ReactDOMServer.renderToStaticMarkup)

const start1 = performance.now()
for (let i = 0; i < 1000; i++) sample1()
console.log("sample 1", performance.now() - start1)

const start2 = performance.now()
for (let i = 0; i < 1000; i++) sample2()
console.log("sample 2", performance.now() - start2)