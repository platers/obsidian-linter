import {App, Component, MarkdownRenderer} from 'obsidian';

export function parseTextToHTMLWithoutOuterParagraph(app: App, text: string, containerEl: HTMLElement, component: Component) {
  void MarkdownRenderer.render(app, text, containerEl, '', component);

  let htmlString = containerEl.innerHTML.trim();
  if (htmlString.startsWith('<p>')) {
    htmlString = htmlString.substring(3);
  }

  if (htmlString.endsWith('</p>')) {
    htmlString = htmlString.substring(0, htmlString.length - 4);
  }

  containerEl.innerHTML = htmlString;
}

export function hideEl(el: HTMLElement) {
  el.addClass('linter-visually-hidden');
}

export function unhideEl(el: HTMLElement) {
  el.removeClass('linter-visually-hidden');
}
