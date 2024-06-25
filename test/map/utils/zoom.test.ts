import { describe, it, expect } from 'bun:test'
import { getMapZoom } from '../../../src/map/utils/zoom'

describe('Zoom levels', () => {
  it('zoom > 19', () => {
    const res = getMapZoom(1)

    expect(res).toBeTypeOf('number')
    expect(res).toBe(19)
  })

  it('zoom < 0', () => {
    const res = getMapZoom(100000000)

    expect(res).toBeTypeOf('number')
    expect(res).toBe(0)
  })

  it('specific zoom', () => {
    const res = getMapZoom(1000)

    expect(res).toBe(18.5)
  })
})
