import { identity, orthogonalMatrix } from './matrix'

const devicePixelRatio = () => {
  return window.devicePixelRatio || 1.0
}

export const init = (canvas) => {
  const { width, height } = canvas

  const gl = canvas.getContext('webgl2')
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.blendFuncSeparate(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA,
    gl.ONE,
    gl.ONE_MINUS_SRC_ALPHA
  )
  gl.enable(gl.BLEND)
  gl.disable(gl.DEPTH_TEST)

  gl.viewport(0, 0, width * devicePixelRatio(), height * devicePixelRatio())
  const left = 0
  const right = width - 1
  const top = 0
  const bottom = height - 1
  const near = -10
  const far = 10

  const mvMatrix = identity()
  const pMatrix = orthogonalMatrix(left, right, top, bottom, near, far)
  return { mvMatrix, pMatrix }
}

export const render = (canvas, object, { mvMatrix, pMatrix }) => {
  const gl = canvas.getContext('webgl2')
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(object.program)
  const mvLocation = gl.getUniformLocation(object.program, 'uMVMatrix')
  gl.uniformMatrix4fv(mvLocation, false, mvMatrix)
  const pLocation = gl.getUniformLocation(object.program, 'uPMatrix')
  gl.uniformMatrix4fv(pLocation, false, pMatrix)
  const colorLocation = gl.getUniformLocation(object.program, 'uColor')

  gl.bindVertexArray(object.geometry)
  for (const { offset, color } of object.items) {
    if (colorLocation) {
      gl.uniform4fv(colorLocation, color)
    }
    gl.drawElements(object.mode, object.count, gl.UNSIGNED_SHORT, offset)
  }
  gl.bindVertexArray(null)
}
