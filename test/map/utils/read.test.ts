import { describe, it } from 'vitest';
import { readPB, readQ } from '../../../src/map/utils/read';

describe.concurrent('read pb', () => {
    it('read example', async ({ expect }) => {
        const res = await readPB(
            '!1m14!1m12!1m3!1d1.1!2d1.1!3d1.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sde!2sde!4v1680097499131!5m2!1sde!2sde'
        );

        expect(res).toStrictEqual({
            area: {
                lat: 1.1,
                lon: 1.1,
            },
            markers: [],
            tile: 'roadmap',
            zoom: 19,
        });
    });

    it('pb markers', async ({ expect }) => {
        const res = await readPB(
            '!1m17!1m12!1m3!1d1.1!2d1.1!3d1.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!1zMTDCsDYwJzM2LjAiTiAxMMKwNjAnMzYuMCJF!5e0!3m2!1sde!2sde!4v1557583694739!5m2!1sde!2sde'
        );

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
            zoom: 19,
        });
    });
});

describe.concurrent('read query', () => {
    it('', async ({ expect }) => {
        const res = readQ(''); // TODO: Mocking requests
    });
});
