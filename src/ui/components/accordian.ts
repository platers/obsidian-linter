// adapted from https://codepen.io/chriscoyier/pen/XWNqxyY

export class Accordion {
  summaryEl: HTMLElement;
  detailEl: HTMLElement;
  contentEl: HTMLDivElement;
  totalEl: HTMLDivElement;
  isClosing = false;
  isExpanding = false;
  // Store the animation object (so we can cancel it if needed)
  animation: Animation;

  constructor(
    private containerEl: HTMLElement,
    private title: string,
    private createBodyContent: (el: HTMLDivElement) => void,
    private setTotalText: () => string,
  ) {
    this.containerEl = containerEl;
    this.title = title;
    this.createBodyContent = createBodyContent;
    this.animation = null;

    this.display();
  }

  display() {
    this.detailEl = this.containerEl.createEl('details');
    this.summaryEl = this.detailEl.createEl('summary', {text: this.title, cls: 'linter-summary'});
    this.totalEl = this.summaryEl.createDiv({text: '', attr: {style: 'float: right;'}});
    this.summaryEl.onclick = () => {
      this.onClick();
    };

    this.contentEl = this.detailEl.createDiv('content'); // TODO: create a better class to house the body content in
    this.createBodyContent(this.contentEl);

    this.updateTotalText();
  }

  updateTotalText() {
    this.totalEl.setText(this.setTotalText());
  }

  onClick() {
    // Add an overflow on the <details> to avoid content overflowing
    this.detailEl.style.overflow = 'hidden';
    // Check if the element is being closed or is already closed
    if (this.isClosing || !this.detailEl.hasAttribute('open')) {
      this.open();
    // Check if the element is being opened or is already open
    } else if (this.isExpanding || this.detailEl.hasAttribute('open')) {
      this.shrink();
    }
  }

  shrink() {
    // Set the element as "being closed"
    this.isClosing = true;
    // Store the current height of the element
    const startHeight = `${this.detailEl.offsetHeight}px`;
    // Calculate the height of the summary
    const endHeight = `${this.summaryEl.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.detailEl.animate({
      // Set the keyframes from the startHeight to endHeight
      height: [startHeight, endHeight],
    }, {
      duration: 400,
      easing: 'ease-out',
    });

    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(false);
    // If the animation is cancelled, isClosing variable is set to false
    this.animation.oncancel = () => this.isClosing = false;
  }

  open() {
    // Apply a fixed height on the element
    this.detailEl.style.height = `${this.detailEl.offsetHeight}px`;
    // Force the [open] attribute on the details element
    this.detailEl.setAttribute('open', '');
    // Wait for the next frame to call the expand function
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    // Set the element as "being expanding"
    this.isExpanding = true;
    // Get the current fixed height of the element
    const startHeight = `${this.detailEl.offsetHeight}px`;
    // Calculate the open height of the element (summary height + content height)
    const endHeight = `${this.summaryEl.offsetHeight + this.contentEl.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.detailEl.animate({
      // Set the keyframes from the startHeight to endHeight
      height: [startHeight, endHeight],
    }, {
      duration: 400,
      easing: 'ease-out',
    });
    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(true);
    // If the animation is cancelled, isExpanding variable is set to false
    this.animation.oncancel = () => this.isExpanding = false;
  }

  onAnimationFinish(open: boolean) {
    // Set the open attribute based on the parameter
    if (open) {
      this.detailEl.setAttribute('open', '');
    } else {
      this.detailEl.removeAttribute('open');
    }

    // Clear the stored animation
    this.animation = null;
    // Reset isClosing & isExpanding
    this.isClosing = false;
    this.isExpanding = false;
    // Remove the overflow hidden and the fixed height
    this.detailEl.style.height = this.detailEl.style.overflow = '';
  }
}
