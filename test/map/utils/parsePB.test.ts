import { describe, it } from 'vitest';
import { parsePB, tileTypes } from '../../../src/map/utils/parsePB';
import { experiments } from 'webextension-polyfill';

describe.concurrent('Parse PB', () => {
    it('empty list', ({ expect }) => {
        const res = parsePB([]);

        expect(res).empty;
        expect(res).toEqual([]);
    });

    it('contains empty list', ({ expect }) => {
        const res = parsePB(['1m0']);

        expect(res).toStrictEqual([[]]);
    });

    it('double', ({ expect }) => {
        const res = parsePB(['1d1.1'])[0];

        expect(res).toBeTypeOf('number');
        expect(res).toBe(1.1);
    });

    it('float', ({ expect }) => {
        const res = parsePB(['1f1.1'])[0];

        expect(res).toBeTypeOf('number');
        expect(res).toBe(1.1);
    });

    it('int', ({ expect }) => {
        const res = parsePB(['1i1'])[0];

        expect(res).toBeTypeOf('number');
        expect(res).toBe(1);
        expect(res).to;
    });

    it('enum roadmap', ({ expect }) => {
        const res = parsePB(['1e0'])[0];

        expect(res).toBeTypeOf('string');
        expect(res).toBe('roadmap');
        expect(res).toBe(tileTypes[0]);
    });

    it('enum satellite', ({ expect }) => {
        const res = parsePB(['1e1'])[0];

        expect(res).toBeTypeOf('string');
        expect(res).toBe('satellite');
        expect(res).toBe(tileTypes[1]);
    });

    it('enum empty', ({ expect }) => {
        const res = parsePB(['1e'])[0];

        expect(res).toBeTypeOf('string');
        expect(res).toBe('roadmap');
        expect(res).toBe(tileTypes[0]);
    });

    it('enum >1', ({ expect }) => {
        const res = parsePB(['1e2'])[0];

        expect(res).toBeTypeOf('string');
        expect(res).toBe('roadmap');
        expect(res).toBe(tileTypes[0]);
    });

    it('wrongly encoded base64', ({ expect }) => {
        expect(() => parsePB(['1zM'])).toThrowError('The string to be decoded is not correctly encoded.');
    });

    it('base64 encoded coordinates', ({ expect }) => {
        const res = parsePB(['1zM'])[0];

        expect(res).toBeTypeOf('string');
        expect(res).toBe('M');
    });
});
