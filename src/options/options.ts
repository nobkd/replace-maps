import { disabledHosts, invertHostState } from '../bg/utils/storage';

const table = document.querySelector('.table');

function tableEntries() {
    const tableItems: HTMLDivElement[] = disabledHosts.map(createEntry);
    tableItems.forEach((div) => table?.insertAdjacentElement('beforeend', div));
}

function createEntry(entryText: string, index: number): HTMLDivElement {
    const div = document.createElement('div');
    div.innerHTML = `<span>${entryText}</span><button onclick="removeEntry(${index})"></button>`;
    return div;
}

// TODO: function shouldn't be removed (because 'unused')
function removeEntry(index: number) {
    invertHostState(disabledHosts[index]).then(() => document.location.reload());
}

tableEntries();
