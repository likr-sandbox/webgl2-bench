import React from 'react'
import { init, render } from '../../render'
import { generateRectangles } from '../../data'
import createTriangleAllMesh from './triangle'
import createTriangleStripMesh from './triangle_strip'

const createMesh = (mode, gl, data) => {
  switch (mode) {
    case 'triangle-all':
      return createTriangleAllMesh(gl, data)
    case 'triangle-strip':
      return createTriangleStripMesh(gl, data)
  }
}

const RectanglesPage = () => {
  const canvasRef = React.useRef()
  const width = 600
  const height = 600

  const [time, setTime] = React.useState({ total: 0, count: 0 })

  React.useEffect(() => {
    console.log('start')
    const data = generateRectangles(1000, width, height)
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl2')
    const object = createMesh('triangle-all', gl, data)
    const context = init(canvas)
    const loop = () => {
      const start = window.performance.now()
      render(canvas, object, context)
      const stop = window.performance.now()
      setTime({
        total: time.total + (stop - start),
        count: time.count + 1
      })
      window.requestAnimationFrame(loop)
    }
    loop()
  }, [])

  return (
    <>
      <div>
        <p>{time.count && (time.total / time.count).toFixed(2)}</p>
      </div>
      <div>
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
    </>
  )
}

export default RectanglesPage
