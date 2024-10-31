// NormalizedCoordinatesTracker.ts
class CursorCoordinatesTracker extends HTMLElement {
  private rafId: number | null = null;
  private boundTrackCoordinates: (event: MouseEvent) => void;
  private cachedRect: DOMRect | null = null;

  constructor() {
    super();
    // Bind the method to maintain correct 'this' context
    this.boundTrackCoordinates = this.trackCoordinates.bind(this);
  }

  connectedCallback() {
    // Cache the bounding rectangle when the element is added to the DOM
    this.cachedRect = this.getBoundingClientRect();

    // Add event listener
    this.addEventListener("mousemove", this.boundTrackCoordinates);
  }

  disconnectedCallback() {
    // Remove event listener and cancel any pending animation frame
    this.removeEventListener("mousemove", this.boundTrackCoordinates);
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }

    // Clear the cached rectangle
    this.cachedRect = null;
  }

  trackCoordinates(event: MouseEvent) {
    // Cancel any previous pending animation frame
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }

    // Use requestAnimationFrame for smooth, performant coordinate tracking
    this.rafId = requestAnimationFrame(() => {
      // Use the cached rectangle instead of calling getBoundingClientRect() in every RAF
      if (!this.cachedRect) return;

      // Calculate normalized X coordinate (0 to 1)
      const normalizedX =
        (event.clientX - this.cachedRect.left) / this.cachedRect.width;
      const normalizedY =
        (event.clientY - this.cachedRect.top) / this.cachedRect.height;

      // Set CSS variables on the element
      this.style.setProperty("--cursor-x", event.clientX.toFixed(3));
      this.style.setProperty("--cursor-y", event.clientY.toFixed(3));
      this.style.setProperty("--cursor-x-normalized", normalizedX.toFixed(3));
      this.style.setProperty("--cursor-y-normalized", normalizedY.toFixed(3));
    });
  }

  // Add a method to update the cached rectangle if the element might have moved
  updateCachedRect() {
    this.cachedRect = this.getBoundingClientRect();
  }
}

// Define the custom element
customElements.define("cursor-coordinates", CursorCoordinatesTracker);
