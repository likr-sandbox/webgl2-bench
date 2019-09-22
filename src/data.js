import * as d3 from 'd3'

export const generateRectangles = (n, width, height) => {
  return Array.from({ length: n }).map(() => {
    const color = d3.hsl(360 * Math.random(), 1, 0.5).rgb()
    return {
      x: width * Math.random(),
      y: height * Math.random(),
      width: 10,
      height: 10,
      color: new Float32Array([color.r / 255, color.g / 255, color.b / 255, 1])
    }
  })
}
