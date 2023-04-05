import { describe, it } from 'vitest';
import { getMapZoom } from '../../../src/map/utils/zoom';

describe.concurrent('', () => {
    it('zoom > 19', ({ expect }) => {
        const res = getMapZoom(1);

        expect(res).toBeTypeOf('number');
        expect(res).toBe(19);
    });

    it('zoom < 0', ({ expect }) => {
        const res = getMapZoom(100000000);

        expect(res).toBeTypeOf('number');
        expect(res).toBe(0);
    });

    it('specific zoom', ({expect}) => {
        const res = getMapZoom(1000);

        expect(res).toBe(18.5);
    })
});
