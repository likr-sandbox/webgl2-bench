import { initShader, initProgram } from '../../program'

const vertexShaderSource = `#version 300 es
layout(location = 0) in vec2 aPosition;
layout(location = 1) in vec4 aColor;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
out vec4 vColor;

void main() {
  vec4 mvPosition = uMVMatrix * vec4(aPosition, 1.0, 1.0);
  gl_Position = uPMatrix * mvPosition;
  vColor = aColor;
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
  const items = [{ offset: 0 }]
  const vertices = new Float32Array(24 * data.length)
  const elements = new Uint16Array(6 * data.length)
  data.map(({ x, y, width, height, color }, i) => {
    vertices[24 * i] = x - width / 2
    vertices[24 * i + 1] = y - height / 2
    vertices[24 * i + 6] = x - width / 2
    vertices[24 * i + 7] = y + height / 2
    vertices[24 * i + 12] = x + width / 2
    vertices[24 * i + 13] = y - height / 2
    vertices[24 * i + 18] = x + width / 2
    vertices[24 * i + 19] = y + height / 2
    for (let j = 0; j < 4; ++j) {
      vertices[24 * i + 6 * j + 2] = color[0]
      vertices[24 * i + 6 * j + 3] = color[1]
      vertices[24 * i + 6 * j + 4] = color[2]
      vertices[24 * i + 6 * j + 5] = color[3]
    }
    elements[6 * i] = 4 * i
    elements[6 * i + 1] = 4 * i + 1
    elements[6 * i + 2] = 4 * i + 2
    elements[6 * i + 3] = 4 * i + 1
    elements[6 * i + 4] = 4 * i + 2
    elements[6 * i + 5] = 4 * i + 3
  })

  const vertexBuffer = gl.createBuffer()
  const elementBuffer = gl.createBuffer()
  const program = createProgram(gl)
  const positionLocation = gl.getAttribLocation(program, 'aPosition')
  const colorLocation = gl.getAttribLocation(program, 'aColor')
  const vertexArray = gl.createVertexArray()
  gl.bindVertexArray(vertexArray)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elements, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 24, 0)
  gl.enableVertexAttribArray(colorLocation)
  gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 24, 8)
  gl.bindVertexArray(null)
  return {
    mode: gl.TRIANGLES,
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
    count: data.length * 6,
    items
  }
}

export default createObject
