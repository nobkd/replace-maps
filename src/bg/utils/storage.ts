import { storage } from 'webextension-polyfill';

export type HostnameStatus = {
    [key: string]: boolean;
};

export const KEY_DISABLED = 'disabled_urls';

export async function getAllDisabled(): Promise<string[]> {
    return (await storage.local.get(KEY_DISABLED))[KEY_DISABLED] ?? [];
}

export async function invertDisabled(url: string): Promise<void> {
    url = getHostname(url);
    const disabledUrls = await getAllDisabled();

    if (disabledUrls.includes(url)) {
        disabledUrls.splice(disabledUrls.indexOf(url), 1);
    } else {
        disabledUrls.push(url);
    }

    await storage.local.set({
        [KEY_DISABLED]: disabledUrls,
    });
}

export function getHostname(url: string): string {
    url = url.replace(/^\w+:\/\//, '');
    url = url.split(/[\/#]/, 1)[0];
    return url;
}
