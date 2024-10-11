export function hideEl(el: HTMLElement) {
  el.addClass('linter-visually-hidden');
}

export function unhideEl(el: HTMLElement) {
  el.removeClass('linter-visually-hidden');
}

export function setElContent(text: string, el: HTMLElement) {
  if (text.includes('</')) {
    const range = document.createRange();
    el.append(range.createContextualFragment(text));
  } else {
    el.setText(text);
  }
}
