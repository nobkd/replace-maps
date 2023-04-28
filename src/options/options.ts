import { storage } from 'webextension-polyfill';
import {
    KEY_DISABLED_HOSTS,
    disabledHosts,
    getHostname,
    invertHostState,
} from '../bg/utils/storage';

const table = document.querySelector('.table')!;

/**
 *
 */
function buildEntries() {
    table.innerHTML = '';
    disabledHosts.forEach(createEntry);
}

/**
 *
 * @returns
 */
async function addEntry() {
    const search = new URLSearchParams(document.location.search);
    let hostname = search.get('hostname');
    if (hostname === null) return;

    hostname = getHostname(hostname);
    if (disabledHosts.includes(hostname)) return;

    await invertHostState(hostname);
    createEntry(hostname);
}

/**
 *
 * @param hostname
 */
function createEntry(hostname: string) {
    const div = document.createElement('div');

    let span = document.createElement('span');
    span.innerText = hostname;

    let button = document.createElement('button');
    button.onclick = removeEntry;

    div.append(span, button);
    table.appendChild(div);
}

/**
 *
 * @param click
 * @returns
 */
async function removeEntry(click: MouseEvent) {
    let target: EventTarget | null = click.target;
    if (target === null) return;

    let index = getIndex(target as HTMLButtonElement);
    if (index === -1) return;

    await invertHostState(disabledHosts[index]);
}

/**
 *
 * @param button
 * @returns
 */
function getIndex(button: HTMLButtonElement) {
    let div: HTMLDivElement = button.parentElement as HTMLDivElement;
    if (div === null) return -1;

    let index = Array.from(table.children).indexOf(div);
    div.remove();

    return index;
}

storage.local.onChanged.addListener((changes) => {
    if (KEY_DISABLED_HOSTS in changes) {
        buildEntries();
    }
});

buildEntries();
addEntry();
