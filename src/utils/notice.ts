/**
 * https://github.com/daylilyfield/obsidian-firesync/blob/master/src/views/notice.ts
 */
import { Notice, addIcon, setIcon } from 'obsidian';
import {INDICATOR_SVG} from '../assets/indicator';

addIcon('indicator', INDICATOR_SVG);

export function showNotice(message: string, duration:number = 4000, type: string|undefined): void {

  const fragment = document.createDocumentFragment();

  let wrapper = fragment.createDiv({
		attr: {
			style: `display: flex; gap: .75em;`,
		}
	});

	if (type === 'error') {
		const header = wrapper.createDiv({
			attr: {
				style: `color: var(--color-red);`,
			},
		});
		setIcon(header, 'alert-triangle');
	}

	if (type === 'success') {
		const header = wrapper.createDiv({
			attr: {
				style: `color: var(--color-green);`,
			},
		});
		setIcon(header, 'check-circle');
	}

	if (type === 'info') {
		const header = wrapper.createDiv({
			attr: {
				style: `color: var(--color-blue);`,
			},
		});
		setIcon(header, 'info');
	}

	if (type === 'loading') {
		const header = wrapper.createDiv({
			attr: {
				cls: "indicator"
			}
		});
		setIcon(header, 'indicator');
	}

  wrapper.createDiv({
    text: message,
    attr: {
      style: ``,
    },
  });

  new Notice(fragment, duration);

}