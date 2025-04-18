import { test, expect, mock } from 'bun:test'
import { readPB, readQ, nominatimQ } from '../read.js'

globalThis.fetch = mock()

const input = 'test position'
const result = [{ lat: '1.1', lon: '1.1' }]
const zoom = 32.648369576816776


/**
 *
 * @param {{lat: string; lon: string}} data
 * @param {boolean} status
 * @returns {Response}
 */
function mockNominatimResponse(data, status) {
  return { ok: status, json: () => new Promise((resolve) => resolve(data)) }
}

test('read pb: read example', async () => {
  const res = await readPB(
    '!1m14!1m12!1m3!1d1.1!2d1.1!3d1.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sde!2sde!4v1680097499131!5m2!1sde!2sde'
  )

  expect(res).toStrictEqual({
    area: {
      lat: 1.1,
      lon: 1.1,
    },
    markers: [],
    tile: 'roadmap',
    zoom,
  })
})

test('read pb: pb base64 marker', async () => {
  const res = await readPB(
    '!1m17!1m12!1m3!1d1.1!2d1.1!3d1.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!1zMTDCsDYwJzM2LjAiTiAxMMKwNjAnMzYuMCJF!5e0!3m2!1sde!2sde!4v1557583694739!5m2!1sde!2sde'
  )

  expect(res).toStrictEqual({
    area: {
      lat: 1.1,
      lon: 1.1,
    },
    markers: [
      {
        label: '11.01 11.01',
        lat: 11.01,
        lon: 11.01,
      },
    ],
    tile: 'roadmap',
    zoom,
  })
})

test('read pb: pb id marker', async () => {
  const res = await readPB(
    '!1m17!1m12!1m3!1d1.1!2d1.1!3d1.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!1s0x0:0x0!5e0!3m2!1sde!2sde!4v1557583694739!5m2!1sde!2sde'
  )

  expect(res).toStrictEqual({
    area: {
      lat: 1.1,
      lon: 1.1,
    },
    markers: [],
    tile: 'roadmap',
    zoom,
  })
})

test('read pb: pb markers to readQ', async () => {
  // @ts-ignore
  fetch.mockResolvedValue(mockNominatimResponse(result, true))

  const res = await readPB(
    `!1m17!1m12!1m3!1d1.1!2d1.1!3d1.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!1s${input}!5e0!3m2!1sde!2sde!4v1557583694739!5m2!1sde!2sde`
  )

  expect(res).toStrictEqual({
    area: {
      lat: 1.1,
      lon: 1.1,
    },
    markers: [
      {
        label: input,
        lat: parseFloat(result[0].lat),
        lon: parseFloat(result[0].lon),
      },
    ],
    tile: 'roadmap',
    zoom,
  })
})

test('read query: nominatim request', async () => {
  // @ts-ignore
  fetch.mockResolvedValue(mockNominatimResponse(result, true))

  const res = await readQ(input) // TODO: Mocking requests

  expect(fetch).toBeCalledWith(encodeURI(nominatimQ + input))

  expect(res).toStrictEqual({
    label: input,
    lat: parseFloat(result[0].lat),
    lon: parseFloat(result[0].lon),
  })
})

test('read query: failing nominatim request', async () => {
  // @ts-ignore-next
  fetch.mockResolvedValue(mockNominatimResponse(result, false))

  const res = await readQ(input)

  expect(res).null
})
