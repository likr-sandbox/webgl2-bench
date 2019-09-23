import { initShader, initProgram } from '../../program'

const vertexShaderSource = `#version 300 es
layout(location = 0) in vec2 aPosition;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec4 uColor;
out vec4 vColor;

void main() {
  vec4 mvPosition = uMVMatrix * vec4(aPosition, 1.0, 1.0);
  gl_Position = uPMatrix * mvPosition;
  vColor = uColor;
}`

const fragmentShaderSource = `#version 300 es
precision mediump float;
in vec4 vColor;
out vec4 oFragColor;

void main() {
  oFragColor = vColor;
}`

const createProgram = (gl) => {
  const vertexShader = initShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = initShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  )
  return initProgram(gl, vertexShader, fragmentShader)
}

const createObject = (gl, data) => {
  const items = new Array(data.length)
  const vertices = new Float32Array(8 * data.length)
  const elements = new Uint16Array(4 * data.length)
  data.map(({ x, y, width, height, color }, i) => {
    items[i] = {
      offset: 8 * i,
      color: color
    }
    vertices[8 * i] = x - width / 2
    vertices[8 * i + 1] = y - height / 2
    vertices[8 * i + 2] = x - width / 2
    vertices[8 * i + 3] = y + height / 2
    vertices[8 * i + 4] = x + width / 2
    vertices[8 * i + 5] = y - height / 2
    vertices[8 * i + 6] = x + width / 2
    vertices[8 * i + 7] = y + height / 2
    elements[4 * i] = 4 * i
    elements[4 * i + 1] = 4 * i + 1
    elements[4 * i + 2] = 4 * i + 2
    elements[4 * i + 3] = 4 * i + 3
  })

  const vertexBuffer = gl.createBuffer()
  const elementBuffer = gl.createBuffer()
  const program = createProgram(gl)
  const positionLocation = gl.getAttribLocation(program, 'aPosition')
  const vertexArray = gl.createVertexArray()
  gl.bindVertexArray(vertexArray)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elements, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 8, 0)
  gl.bindVertexArray(null)
  return {
    mode: gl.TRIANGLE_STRIP,
    program,
    vertexBuffer: {
      buffer: vertexBuffer,
      data: new Float32Array()
    },
    elementBuffer: {
      buffer: elementBuffer,
      data: new Uint16Array()
    },
    geometry: vertexArray,
    count: 4,
    items
  }
}

export default createObject
