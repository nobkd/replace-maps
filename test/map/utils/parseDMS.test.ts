import { describe, it } from 'vitest';
import { parseDMS } from '../../../src/map/utils/parseDMS';

describe.concurrent('Parse Degrees Minutes Seconds Direction', () => {
    it('Example', ({ expect }) => {
        const res = parseDMS(`11°11'11.1"N 11°11'11.1"E`);

        expect(res).toStrictEqual([11.186416666666666, 11.186416666666666]);
    });
    
    it('Negative Example', ({ expect }) => {
        const res = parseDMS(`11°11'11.1"S 11°11'11.1"W`);

        expect(res).toStrictEqual([-11.186416666666666, -11.186416666666666]);
    });
});
