import { describe, it, expect } from 'vitest'
import { parseDMS } from '../../../src/map/utils/parseDMS'

describe('Parse Degrees Minutes Seconds Direction', () => {
  it('Example', () => {
    const res = parseDMS(`10°60'36.0"N 10°60'36.0"E`)

    expect(res).toStrictEqual([11.01, 11.01])
  })

  it('Negative Example', () => {
    const res = parseDMS(`10°60'36.0"S 10°60'36.0"W`)

    expect(res).toStrictEqual([-11.01, -11.01])
  })
})
