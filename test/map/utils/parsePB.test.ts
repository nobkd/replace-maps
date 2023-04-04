import { describe, it } from 'vitest';
import { parsePB } from '../../../src/map/utils/parsePB';

describe.concurrent('Parse PB', () => {
    it('empty', ({ expect }) => {
        const res = parsePB([]);
        expect(res).empty;
    });
});
