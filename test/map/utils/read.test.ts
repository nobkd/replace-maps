import { describe, it } from 'vitest';
import { readPB, readQ } from '../../../src/map/utils/read';

describe.concurrent('read pb', () => {
    it('', async ({ expect }) => {
        const req = readPB('');
    });
});


describe.concurrent('read query', () => {
    it('', async ({ expect }) => {
        const req = readQ(''); // TODO: Mocking requests
    });
});
