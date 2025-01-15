import { test, expect } from 'bun:test'
import { parseDMS } from '../map/utils/parseDMS'


test('Parse Degrees Minutes Seconds Direction: Example', () => {
  const res = parseDMS(`10°60'36.0"N 10°60'36.0"E`)

  expect(res).toStrictEqual([11.01, 11.01])
})

test('Parse Degrees Minutes Seconds Direction: Negative Example', () => {
  const res = parseDMS(`10°60'36.0"S 10°60'36.0"W`)

  expect(res).toStrictEqual([-11.01, -11.01])
})
