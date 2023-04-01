import { storage } from 'webextension-polyfill';

export type HostnameStatus = {
    [key: string]: boolean;
};

export async function getDisabled(url: string): Promise<boolean> {
    const hostname = getHostname(url);
    let res = await storage.local.get(hostname);
    return res[hostname] ?? false;
}

export async function invertDisabled(url: string) {
    await storage.local.set({
        [getHostname(url)]: !(await getDisabled(url)),
    });
}

export async function getAll(): Promise<HostnameStatus> {
    return await storage.local.get();
}

function getHostname(url: string): string {
    url = url.replace(/^\w+:\/\//, '');
    url = url.split(/[\/#]/, 1)[0];
    return url;
}
