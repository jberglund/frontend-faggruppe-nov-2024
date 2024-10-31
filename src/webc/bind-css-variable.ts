/**
 * <bind-input-css unit="px" variable="--scale">
 *  <input type="range" >
 *  <output type="number" >
 * </bind-input-css>
 *
 */

class BindInputCss extends HTMLElement {
  bindToElement = document.documentElement;
  cssVariableName: string;
  inputs: NodeListOf<HTMLInputElement>;
  handleFunction = this.handleSteppedInputs;
  unit = this.getAttribute('unit') || '';

  connectedCallback() {
    this.inputs.forEach((input) => {
      this.setValueIfCSSPropertyExists();
      input.addEventListener('input', (event) => {
        if (!(event.target instanceof HTMLInputElement)) return;

        this.handleFunction(event.target);
      });
    });
  }

  handleSteppedInputs(target: HTMLInputElement) {
    this.bindToElement.style.setProperty(
      this.cssVariableName,
      target.value + this.unit
    );
    if (target.type === 'range' || target.type === 'number') {
      this.syncInputs(target);
    }
  }

  setValueIfCSSPropertyExists() {
    const root = getComputedStyle(this.bindToElement);
    this.inputs.forEach((input) => {
      if (input.type === 'radio') return;

      input.value = root.getPropertyValue(this.cssVariableName);
    });
  }

  syncInputs(changedInput: HTMLInputElement) {
    this.inputs.forEach((input) => {
      if (input !== changedInput) {
        input.value = changedInput.value;
      }
    });
  }

  constructor() {
    super();
    this.cssVariableName = this.getAttribute('variable') || '';
    this.inputs = this.querySelectorAll('input');
    if (!this.cssVariableName.startsWith('--')) {
      throw new Error('CSS variable name must start with --');
    }
  }
}

export default BindInputCss;

customElements.define('bind-input-css', BindInputCss);
