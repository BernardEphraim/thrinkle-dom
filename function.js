export function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

/**
 * Calculates a dynamic, mathematically contrasted darker shade 
 * derived directly from the input hex color.
 * 
 * @param {string} hex - Input background color (e.g., "#E8F5E9" or "#123478")
 * @param {number} targetRatio - Target contrast ratio (default 4.5 for WCAG AA)
 * @returns {string} Dynamically calculated darker hex color
 */
export function generateContrastedDarkerColor(hex, targetRatio = 4.5) {
  // 1. Clean and normalize input hex
  let cleanHex = hex.replace(/^#/, '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  // 2. Convert RGB to HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic/grayscale
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // 3. Helper: Calculate WCAG relative luminance from RGB (0-1)
  const getLuminance = (rVal, gVal, bVal) => {
    const a = [rVal, gVal, bVal].map(v => 
      v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };

  // Helper: Convert HSL back to RGB
  const hslToRgb = (hVal, sVal, lVal) => {
    if (sVal === 0) return [lVal, lVal, lVal];
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = lVal < 0.5 ? lVal * (1 + sVal) : lVal + sVal - lVal * sVal;
    const p = 2 * lVal - q;
    return [
      hue2rgb(p, q, hVal + 1/3),
      hue2rgb(p, q, hVal),
      hue2rgb(p, q, hVal - 1/3)
    ];
  };

  const bgLuminance = getLuminance(r, g, b);

  // 4. Step down lightness iteratively until target contrast ratio is met
  let currentL = l;
  let textRgb = [r, g, b];
  let textLuminance = bgLuminance;
  let currentRatio = 1;

  // Reduce lightness in small decrements
  while (currentL > 0) {
    currentL = Math.max(0, currentL - 0.01);
    textRgb = hslToRgb(h, s, currentL);
    textLuminance = getLuminance(...textRgb);

    // WCAG contrast formula: (L1 + 0.05) / (L2 + 0.05)
    const l1 = Math.max(bgLuminance, textLuminance);
    const l2 = Math.min(bgLuminance, textLuminance);
    currentRatio = (l1 + 0.05) / (l2 + 0.05);

    if (currentRatio >= targetRatio) break;
  }

  // 5. Convert resulting RGB back to Hex string
  const toHex = x => {
    const hexVal = Math.round(x * 255).toString(16);
    return hexVal.length === 1 ? '0' + hexVal : hexVal;
  };

  return `#${toHex(textRgb[0])}${toHex(textRgb[1])}${toHex(textRgb[2])}`.toUpperCase();
}

/**
 * Calculates a dynamic, mathematically contrasted lighter shade 
 * derived directly from the input hex color.
 * 
 * @param {string} hex - Input background color (e.g., "#123478" or "#1B5E20")
 * @param {number} targetRatio - Target contrast ratio (default 4.5 for WCAG AA)
 * @returns {string} Dynamically calculated lighter hex color
 */
export function generateContrastedLighterColor(hex, targetRatio = 4.5) {
  // 1. Clean and normalize input hex
  let cleanHex = hex.replace(/^#/, '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  // 2. Convert RGB to HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic/grayscale
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // 3. Helper: Calculate WCAG relative luminance from RGB (0-1)
  const getLuminance = (rVal, gVal, bVal) => {
    const a = [rVal, gVal, bVal].map(v => 
      v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };

  // Helper: Convert HSL back to RGB
  const hslToRgb = (hVal, sVal, lVal) => {
    if (sVal === 0) return [lVal, lVal, lVal];
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = lVal < 0.5 ? lVal * (1 + sVal) : lVal + sVal - lVal * sVal;
    const p = 2 * lVal - q;
    return [
      hue2rgb(p, q, hVal + 1/3),
      hue2rgb(p, q, hVal),
      hue2rgb(p, q, hVal - 1/3)
    ];
  };

  const bgLuminance = getLuminance(r, g, b);

  // 4. Step up lightness iteratively until target contrast ratio is met
  let currentL = l;
  let textRgb = [r, g, b];
  let textLuminance = bgLuminance;
  let currentRatio = 1;

  // Increase lightness in small increments
  while (currentL < 1) {
    currentL = Math.min(1, currentL + 0.01);
    textRgb = hslToRgb(h, s, currentL);
    textLuminance = getLuminance(...textRgb);

    // WCAG contrast formula: (L1 + 0.05) / (L2 + 0.05)
    const l1 = Math.max(bgLuminance, textLuminance);
    const l2 = Math.min(bgLuminance, textLuminance);
    currentRatio = (l1 + 0.05) / (l2 + 0.05);

    if (currentRatio >= targetRatio) break;
  }

  // 5. Convert resulting RGB back to Hex string
  const toHex = x => {
    const hexVal = Math.round(x * 255).toString(16);
    return hexVal.length === 1 ? '0' + hexVal : hexVal;
  };

  return `#${toHex(textRgb[0])}${toHex(textRgb[1])}${toHex(textRgb[2])}`.toUpperCase();
}

// Helper to safely read CSS variables
export function getCssVariable(varName) {
  const name = varName.startsWith('--') ? varName : `--${varName}`;
  return window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

export function removeClassesStartingWith(prefix, element) {
    // 1. Convert classList to array and find matching prefix classes
    const classesToRemove = Array.from(element.classList).filter(className => 
      className.startsWith(prefix)
    );

    // 2. Remove all matched classes at once using spread syntax
    if (classesToRemove.length > 0) {
      element.classList.remove(...classesToRemove);
    }
}

export function setCssVariable(varName, value) {
    const name = varName.startsWith('--') ? varName : `--${varName}`;
    document.documentElement.style.setProperty(name, value);
}

export function setupAnimation({
  element,
  animationName,
  animationDirection,
  animationFillMode,
  animationDuration,
  animationTimingFunction,
  animationIterationCount,
  animationDelay,
  animationPlayState,
  animationTimeline,
  animationRotationAngle
}){ 
        // Trigger animation strictly AFTER styles/theme are painted
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // // this.classList.add('animate-enter');
                element.style.animationName = animationName;
                element.style.animationDirection = animationDirection || (element.hasAttribute('animationdirection') ? element.getAttribute('animationdirection') : 'forwards');
                element.style.animationFillMode = animationFillMode || (element.hasAttribute('animationfillmode') ? element.getAttribute('animationfillmode') : 'both');
                element.style.animationDuration = animationDuration || (element.hasAttribute('animationduration') ? element.getAttribute('animationduration') : '1s');
                element.style.animationTimingFunction = animationTimingFunction || (element.hasAttribute('animationtimingfunction') ? element.getAttribute('animationtimingfunction') : 'cubic-bezier(0.34, 1.56, 0.64, 1)'); 
                element.style.animationIterationCount = animationIterationCount || (element.hasAttribute('animationiterationcount') ? element.getAttribute('animationiterationcount') : '1');
                element.style.animationDelay = animationDelay || (element.hasAttribute('animationdelay') ? element.getAttribute('animationdelay') : '0ms');
                element.style.animationPlayState = animationPlayState || (element.hasAttribute('animationplaystate') ? element.getAttribute('animationplaystate') : 'running');
                element.style.animationTimeline = animationTimeline || (element.hasAttribute('animationtimeline') ? element.getAttribute('animationtimeline') : 'running');
                element.style.animationRotationAngle = animationRotationAngle || (element.hasAttribute('animationrotationangle') ? element.getAttribute('animationrotationangle') : '360deg');
                
            });
        });
    }