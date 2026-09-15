import ThrinkleSwitch from './ThrinkleSwitch.js';
import ThrinkleContainer from './ThrinkleContainer.js';
import ThrinkleColumn from './ThrinkleColumn.js';
import ThrinkleAlert from './ThrinkleAlert.js';

// 1. Register Web Components
window.customElements.define('thrinkle-switch', ThrinkleSwitch);
window.customElements.define('thrinkle-container', ThrinkleContainer);
window.customElements.define('thrinkle-column', ThrinkleColumn);
window.customElements.define('thrinkle-alert', ThrinkleAlert);

// 2. Function to load style.css asynchronously
function initStyles() {
  return new Promise((resolve, reject) => {
    let link = document.head.querySelector('link#thrinkle_format');

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('id', 'thrinkle_format');
      link.href = './css/style.css';
      link.rel = 'stylesheet';

      // Wait for CSS to download and apply to DOM
      link.onload = () => resolve();
      link.onerror = () => reject(new Error('Failed to load ./css/style.css'));

      document.head.appendChild(link);
    } else {
      // If stylesheet is already present, resolve immediately
      resolve();
    }
  });
}

// 4. Initialize and dispatch custom event when ready
initStyles()
  .then(() => {
    // Dispatch event so custom elements or app scripts know styles are ready
    window.dispatchEvent(new CustomEvent('thrinkle-styles-loaded'));
  })
  .catch((err) => console.error(err));