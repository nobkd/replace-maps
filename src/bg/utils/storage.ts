import { storage } from 'webextension-polyfill';

export type HostnameStatus = {
    [key: string]: boolean;
};

export async function getDisabled(hostname: string): Promise<boolean> {
    await storage.local.get(hostname);

    // what is the result???

    return false;
}

export async function setDisabled(hostname: string, status: boolean) {
    //
}

export async function getAll(): Promise<HostnameStatus> {
    return await storage.local.get();
}
