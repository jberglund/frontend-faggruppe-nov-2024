class TimeElement extends HTMLElement {
  private timer: number | undefined;

  constructor() {
    super();
    this.updateTime = this.updateTime.bind(this);
  }

  connectedCallback() {
    // Start updating time when element is connected to DOM
    this.updateTime();
    this.timer = window.setInterval(this.updateTime, 1000);
  }

  disconnectedCallback() {
    // Clean up timer when element is removed
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Convert to 0-1 range for easier CSS calculations
    const hoursNormalized = (hours % 12) / 12;
    const minutesNormalized = minutes / 60;
    const secondsNormalized = seconds / 60;

    // Set CSS custom properties
    this.style.setProperty("--hours", hours.toString());
    this.style.setProperty("--minutes", minutes.toString());
    this.style.setProperty("--seconds", seconds.toString());
    this.style.setProperty("--hours-normalized", hoursNormalized.toString());
    this.style.setProperty(
      "--minutes-normalized",
      minutesNormalized.toString()
    );
    this.style.setProperty(
      "--seconds-normalized",
      secondsNormalized.toString()
    );
  }
}

// Register the custom element
customElements.define("time-variables", TimeElement);
