import { describe, it, expect } from 'bun:test';
import { parsePB, tileTypes } from '../../../src/map/utils/parsePB';

describe('Parse PB', () => {
    it('empty list', () => {
        const res = parsePB([]);

        expect(res).empty;
        expect(res).toEqual([]);
    });

    it('contains empty list', () => {
        const res = parsePB(['1m0']);

        expect(res).toStrictEqual([[]]);
    });

    it('double', () => {
        const res = parsePB(['1d1.1']);

        expect(res[0]).toBeTypeOf('number');
        expect(res).toContain(1.1);
    });

    it('float', () => {
        const res = parsePB(['1f1.1']);

        expect(res[0]).toBeTypeOf('number');
        expect(res).toContain(1.1);
    });

    it('int', () => {
        const res = parsePB(['1i1']);

        expect(res[0]).toBeTypeOf('number');
        expect(res).toContain(1);
    });

    it('enum roadmap', () => {
        const res = parsePB(['1e0'])[0];

        expect(res[0]).toBeTypeOf('string');
        expect(res).toContain('roadmap');
        expect(res).toContain(tileTypes[0]);
    });

    it('enum satellite', () => {
        const res = parsePB(['1e1']);

        expect(res[0]).toBeTypeOf('string');
        expect(res).toContain('satellite');
        expect(res).toContain(tileTypes[1]);
    });

    it('enum empty', () => {
        const res = parsePB(['1e']);

        expect(res[0]).toBeTypeOf('string');
        expect(res).toContain('roadmap');
        expect(res).toContain(tileTypes[0]);
    });

    it('enum >1', () => {
        const res = parsePB(['1e2']);

        expect(res[0]).toBeTypeOf('string');
        expect(res).toContain('roadmap');
        expect(res).toContain(tileTypes[0]);
    });

    it('wrongly encoded base64', () => {
        expect(() => parsePB(['1zM'])).toThrowError(
            'The string to be decoded is not correctly encoded.'
        );
    });

    it('base64 encoded coordinates', () => {
        const res = parsePB(['1zMTHCsDExJzExLjEiTiAxMcKwMTEnMTEuMSJF'])[0];

        expect(res).toBeTypeOf('string');
        expect(res).toBe(`11°11'11.1"N 11°11'11.1"E`);
    });

    it('"real" world example', () => {
        const splitted =
            '!1m14!1m12!1m3!1d1.1!2d1.1!3d1.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sde!2sde!4v1680097499131!5m2!1sde!2sde'
                .split('!')
                .slice(1);
        const res = parsePB(splitted);

        expect(res).toStrictEqual([
            [[[1.1, 1.1, 1.1], [0, 0, 0], [1024, 768], 13.1], 'roadmap'],
            ['de', 'de'],
            '1680097499131',
            ['de', 'de'],
        ]);
    });
});
