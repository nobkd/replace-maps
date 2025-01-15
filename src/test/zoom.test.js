import { test, expect } from 'bun:test'
import { getMapZoom } from '../map/utils/zoom'

test('Zoom levels: zoom > 19', () => {
  const res = getMapZoom(1)

  expect(res).toBeTypeOf('number')
  expect(res).toBe(19)
})

test('Zoom levels: zoom < 0', () => {
  const res = getMapZoom(100000000)

  expect(res).toBeTypeOf('number')
  expect(res).toBe(0)
})

test('Zoom levels: specific zoom', () => {
  const res = getMapZoom(1000)

  expect(res).toBe(18.5)
})
