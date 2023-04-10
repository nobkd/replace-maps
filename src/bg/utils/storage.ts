import { storage } from 'webextension-polyfill';

export const KEY_DISABLED_HOSTS = 'disabled_hosts';

export let disabledHosts: string[] = await getDisabledHosts();
storage.local.onChanged.addListener((changes) => {
    if (KEY_DISABLED_HOSTS in changes) {
        disabledHosts = changes[KEY_DISABLED_HOSTS].newValue ?? [];
    }
});

async function getDisabledHosts(): Promise<string[]> {
    return (await storage.local.get(KEY_DISABLED_HOSTS))[KEY_DISABLED_HOSTS] ?? [];
}

export async function invertHostState(hostname: string): Promise<void> {
    if (disabledHosts.includes(hostname)) {
        disabledHosts.splice(disabledHosts.indexOf(hostname), 1);
    } else {
        disabledHosts.push(hostname);
    }

    await storage.local.set({
        [KEY_DISABLED_HOSTS]: disabledHosts,
    });
}

export function getHostname(url: string): string {
    url = url.replace(/^\w+:\/\//, '');
    url = url.split(/[\/#]/, 1)[0];
    return url;
}
