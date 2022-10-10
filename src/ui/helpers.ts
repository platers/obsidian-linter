import {MarkdownRenderer} from 'obsidian';

export function parseTextToHTMLWithoutOuterParagraph(text: string, containerEl: HTMLElement) {
  MarkdownRenderer.renderMarkdown(text, containerEl, '', null);

  let htmlString = containerEl.innerHTML.trim();
  if (htmlString.startsWith('<p>')) {
    htmlString = htmlString.substring(3);
  }

  if (htmlString.endsWith('</p>')) {
    htmlString = htmlString.substring(0, htmlString.length - 4);
  }

  containerEl.innerHTML = htmlString;
}
