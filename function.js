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
export function generateContrastedDarkerColor({
  hex, 
  targetRatio= 4.5,
  output= "hex"
}) {
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
  const hexOutput = `#${toHex(textRgb[0])}${toHex(textRgb[1])}${toHex(textRgb[2])}`.toUpperCase();
  if(output==="hex"){
    return hexOutput;
  }
  return hexToOklch(hexOutput)
}

/**
 * Calculate WCAG relative luminance from RGB (0-1).
 * @param {rVal: number, gVal: numbr, bVal: number} 
 * @returns {number}
 */
export function getLuminance (rVal, gVal, bVal) {
  const a = [rVal, gVal, bVal].map(v => 
    v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
};

// Helper: Convert HSL back to RGB
export function hslToRgb (hVal, sVal, lVal) {
  if (sVal === 0) return [lVal, lVal, lVal];  
  const q = lVal < 0.5 ? lVal * (1 + sVal) : lVal + sVal - lVal * sVal;
  const p = 2 * lVal - q;
  return [
    hue2rgb(p, q, hVal + 1/3),
    hue2rgb(p, q, hVal),
    hue2rgb(p, q, hVal - 1/3)
  ];
};

export function hue2rgb (p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
};
// 5. Convert resulting RGB back to Hex string
export function toHex (x) {
  const hexVal = Math.round(x * 255).toString(16);
  return hexVal.length === 1 ? '0' + hexVal : hexVal;
};
/**
 * Calculates a dynamic, mathematically contrasted lighter shade 
 * derived directly from the input hex color.
 * 
 * @param {string} hex - Input background color (e.g., "#123478" or "#1B5E20")
 * @param {number} targetRatio - Target contrast ratio (default 4.5 for WCAG AA)
 * @returns {string} Dynamically calculated lighter hex color
 */
export function generateContrastedLighterColor({
  hex, 
  targetRatio= 4.5,
  output="hex"
}) {
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

  const hexOutput = `#${toHex(textRgb[0])}${toHex(textRgb[1])}${toHex(textRgb[2])}`.toUpperCase();
  if(output==="hex"){
    return hexOutput;
  }
  return hexToOklch(hexOutput)
}

export function oklchLightnessContrast(color){
  let contrastL = 0;
  let midContrastL = 0;
  let deepContrastL = 0;
  let L = 0;
  let C = 0;
  let H = 0;
  if(color.toLowerCase().startsWith('oklch')) {
      // Parse existing OKLCH values
      const match = color.match(/oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)(?:\s*\/.*)?\s*\)/i);
      if (!match) {
          throw new Error("Invalid OKLCH color format.");
      }
      L = parseFloat(match[1]);
      C = parseFloat(match[2]);
      H = parseFloat(match[3]);
  }
  // adjust the lightness to generate contrasting colors 
  // suitable for font colors
  if (L <= 35) {
    contrastL = (L + 45)
    midContrastL = (L + 55)
    deepContrastL = (L + 65)
  }else if(L <= 50){
    contrastL = (L + 45)
    midContrastL = (L + 55) > 100 ? 95 : (L + 55)
    deepContrastL = (L + 65) > 100 ? 100 : (L + 65)
  }else if(L <= 60){
    contrastL = (L - 45)
    midContrastL = (15)
    deepContrastL = (0)
  }else{
    contrastL = (L * 0.45)
    midContrastL = (L * 0.35)
    deepContrastL = (L * 0.25)
  }
  
  // if (L <= 25) {
  //   contrastL = (L + L * 2)
  //   deepContrastL = (L + L * 3.5)
  // }else if(L > 25 && L <= 35){
  //   contrastL = (L + L * 1.35)
  //   deepContrastL = (L + L * 1.85)
  // }else if(L > 35 && L <= 44){
  //   contrastL = (L + L * 1)
  //   deepContrastL = (L + L * 1.25)
  // }else if(L > 44 && L <= 50){
  //   contrastL = (L + L * 0.8)
  //   deepContrastL = (2 * L)
  // }else if(L > 50 && L <= 60){
  //   contrastL = (L + L * 0.5)
  //   deepContrastL = (L + L * 0.7)
  // }else{
  //   contrastL = (L - L * 0.60)
  //   deepContrastL = (L - L * 0.80)
  // }
  return {
    color: color,
    contrast: `oklch(${contrastL}% ${C > 0.1 ? C.toFixed(3) - 0.1: C.toFixed(3)} ${H.toFixed(3)})`,
    midContrast: `oklch(${midContrastL}% ${C > 0.1 ? C.toFixed(3) - 0.1: C.toFixed(3)} ${H.toFixed(3)})`,
    deepContrast: `oklch(${deepContrastL}% ${C > 0.1 ? C.toFixed(3) - 0.1: C.toFixed(3)} ${H.toFixed(3)})`,
    darker: generateContrastedDarkerColor({hex:oklchToHex(L,C,H),targetRatio:4.5,output:"oklch"}),
    lighter: generateContrastedLighterColor({hex:oklchToHex(L,C,H),targetRatio:4.5,output:"oklch"})
  };
}

/**
 * Converts a 6-digit HEX color string to an OKLCH color object.
 * @param {string} hex - The hex color string (e.g., "#3b82f6" or "3b82f6")
 * @returns { {
 * L: number, 
 * C: number, 
 * H: number, 
 * color: string, 
 * contrast: string,
 * deepContrast: string
 * } } An object with L, C, H values and a CSS string.
 */
export function hexToOklch(color) {
  let contrastL = 0;
  let deepContrastL = 0;
  let L = 0;
  let C = 0;
  let H = 0;
  if(color.toLowerCase().startsWith('oklch')) {
      // Parse existing OKLCH values
      const match = color.match(/oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)(?:\s*\/.*)?\s*\)/i);
      if (!match) {
          throw new Error("Invalid OKLCH color format.");
      }
      L = parseFloat(match[1]);
      C = parseFloat(match[2]);
      H = parseFloat(match[3]);
  }else{
    let r = 0;
    let g = 0;
    let b = 0;
    if(color.startsWith('rgb')) {
        // Parse existing RGB values
        const match = color.match(/rgb\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);  
        if (!match) {
            throw new Error("Invalid RGB color format.");
        }
        r = parseInt(match[1]) / 255;
        g = parseInt(match[2]) / 255;
        b = parseInt(match[3]) / 255;
    }else{
      // it is hex code
      // 1. Clean and normalize HEX to decimal sRGB (0.0 to 1.0)
      let cleanHex = color.replace('#', '');
      if (cleanHex.length !== 6) {
          throw new Error("Invalid HEX color format. Expected 6 characters.");
      }
      
      r = parseInt(cleanHex.substring(0, 2), 16) / 255;
      g = parseInt(cleanHex.substring(2, 4), 16) / 255;
      b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    }
    // 2. Convert sRGB to Linear RGB (Un-gamma)
    const toLinear = (c) => (c <= 0.04045) ? (c / 12.92) : Math.pow((c + 0.055) / 1.055, 2.4);
    let rL = toLinear(r);
    let gL = toLinear(g);
    let bL = toLinear(b);

    // 3. Linear RGB to LMS Cone Space (Matrix M1 multiplication)
    let l = 0.4122214708 * rL + 0.5363325363 * gL + 0.0514459929 * bL;
    let m = 0.2119034982 * rL + 0.6806995451 * gL + 0.1073969566 * bL;
    let s = 0.0883024619 * rL + 0.2817188376 * gL + 0.6299787005 * bL;

    // 4. Non-linear Cube Root Scaling
    // Math.cbrt handles negative values gracefully if needed
    let l_ = Math.cbrt(l);
    let m_ = Math.cbrt(m);
    let s_ = Math.cbrt(s);

    // 5. LMS to OKLAB (Matrix M2 multiplication)
    L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
    let a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
    let b_coord = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

    // 6. OKLAB to Polar OKLCH
    C = parseFloat(Math.sqrt(a * a + b_coord * b_coord).toFixed(3));
    H = 0;

    // Only calculate hue angle if the color actually has color (Chroma)
    if (C > 0.0001) {
        H = parseFloat(Math.atan2(b_coord, a) * (180 / Math.PI).toFixed(3));
        if (H < 0) H += 360;
    } else {
        C = 0; // Force absolute zero for perfect neutrals
    }
    L = parseFloat((L * 100).toFixed(1));
    color = `oklch(${L}% ${C.toFixed(3)} ${H.toFixed(3)})`;
  }
  return {
    L: `${L}%`,
    C: C,
    H: H,
    color: color
  };
}

/**
 * Converts OKLCH values to a 6-digit HEX color string.
 * @param {number|string} L - Lightness (0 to 1, or 0% to 100%) OR a full CSS string like "oklch(60% 0.15 120)"
 * @param {number} [C] - Chroma (typically 0 to 0.4)
 * @param {number} [H] - Hue angle (0 to 360)
 * @returns {string} A 6-digit HEX color code (e.g., "#3b82f6")
 */
function oklchToHex(L, C, H) {
    // 1. If a string is passed, parse out the L, C, H values
    if (typeof L === 'string') {
        // Supports modern space syntax, old comma syntax, and optional alpha slashes
        const match = L.match(/oklch\(\s*([\d.]+)\%?\s*[\s,]\s*([\d.]+)\s*[\s,]\s*([\d.]+)(?:\s*\/.*)?\s*\)/i);
        if (!match) throw new Error("Invalid OKLCH string format.");
        
        // If the string used a '%' sign for Lightness (e.g. 60%), convert it to a 0-1 decimal
        const hasPercent = L.includes('%');
        L = parseFloat(match[1]) / (hasPercent ? 100 : 1);
        C = parseFloat(match[2]);
        H = parseFloat(match[3]);
    }

    // 2. Convert Polar OKLCH to Cartesian OKLAB (a, b coordinates)
    const hueRad = H * (Math.PI / 180);
    const a = C * Math.cos(hueRad);
    const b_coord = C * Math.sin(hueRad);

    // 3. OKLAB to LMS Cone Space (Inverse Matrix M2)
    let l_ = L + 0.3963377774 * a + 0.2158037573 * b_coord;
    let m_ = L - 0.1055613458 * a - 0.0638541728 * b_coord;
    let s_ = L - 0.0894841775 * a - 1.2914855480 * b_coord;

    // 4. Undo the non-linear cube root scaling
    let l = l_ * l_ * l_;
    let m = m_ * m_ * m_;
    let s = s_ * s_ * s_;

    // 5. LMS to Linear RGB (Inverse Matrix M1)
    let rL = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    let gL = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    let bL = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    // 6. Convert Linear RGB to sRGB (Re-apply Gamma)
    const toSRGB = (c) => (c <= 0.0031308) ? (12.92 * c) : (1.055 * Math.pow(c, 1 / 2.4) - 0.055);
    let r = toSRGB(rL);
    let g = toSRGB(gL);
    let b = toSRGB(bL);

    // 7. Clamp values strictly between 0 and 1 to prevent gamut overflow bugs
    r = Math.max(0, Math.min(1, r));
    g = Math.max(0, Math.min(1, g));
    b = Math.max(0, Math.min(1, b));

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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

export function getSVG(icon){
  switch(icon.toLowerCase()){
    case 'facebook':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M240 363.3L240 576L356 576L356 363.3L442.5 363.3L460.5 265.5L356 265.5L356 230.9C356 179.2 376.3 159.4 428.7 159.4C445 159.4 458.1 159.8 465.7 160.6L465.7 71.9C451.4 68 416.4 64 396.2 64C289.3 64 240 114.5 240 223.4L240 265.5L174 265.5L174 363.3L240 363.3z"/></svg>`;
    case 'instagram':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M320.3 205C256.8 204.8 205.2 256.2 205 319.7C204.8 383.2 256.2 434.8 319.7 435C383.2 435.2 434.8 383.8 435 320.3C435.2 256.8 383.8 205.2 320.3 205zM319.7 245.4C360.9 245.2 394.4 278.5 394.6 319.7C394.8 360.9 361.5 394.4 320.3 394.6C279.1 394.8 245.6 361.5 245.4 320.3C245.2 279.1 278.5 245.6 319.7 245.4zM413.1 200.3C413.1 185.5 425.1 173.5 439.9 173.5C454.7 173.5 466.7 185.5 466.7 200.3C466.7 215.1 454.7 227.1 439.9 227.1C425.1 227.1 413.1 215.1 413.1 200.3zM542.8 227.5C541.1 191.6 532.9 159.8 506.6 133.6C480.4 107.4 448.6 99.2 412.7 97.4C375.7 95.3 264.8 95.3 227.8 97.4C192 99.1 160.2 107.3 133.9 133.5C107.6 159.7 99.5 191.5 97.7 227.4C95.6 264.4 95.6 375.3 97.7 412.3C99.4 448.2 107.6 480 133.9 506.2C160.2 532.4 191.9 540.6 227.8 542.4C264.8 544.5 375.7 544.5 412.7 542.4C448.6 540.7 480.4 532.5 506.6 506.2C532.8 480 541 448.2 542.8 412.3C544.9 375.3 544.9 264.5 542.8 227.5zM495 452C487.2 471.6 472.1 486.7 452.4 494.6C422.9 506.3 352.9 503.6 320.3 503.6C287.7 503.6 217.6 506.2 188.2 494.6C168.6 486.8 153.5 471.7 145.6 452C133.9 422.5 136.6 352.5 136.6 319.9C136.6 287.3 134 217.2 145.6 187.8C153.4 168.2 168.5 153.1 188.2 145.2C217.7 133.5 287.7 136.2 320.3 136.2C352.9 136.2 423 133.6 452.4 145.2C472 153 487.1 168.1 495 187.8C506.7 217.3 504 287.3 504 319.9C504 352.5 506.7 422.6 495 452z"/></svg>`;
    case 'tumblr':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M469.9 544.3C456.3 558.8 419.9 576 372.5 576C251.7 576 225.5 487.2 225.5 435.4L225.5 291.4L178 291.4C172.5 291.4 168 286.9 168 281.4L168 213.4C168 206.2 172.5 199.8 179.3 197.4C241.3 175.6 260.8 121.4 263.6 80.3C264.4 69.3 270.1 64 279.7 64L350.6 64C356.1 64 360.6 68.5 360.6 74L360.6 189.2L443.6 189.2C449.1 189.2 453.6 193.6 453.6 199.1L453.6 280.8C453.6 286.3 449.1 290.8 443.6 290.8L360.2 290.8L360.2 424C360.2 458.2 383.9 477.6 428.2 459.8C433 457.9 437.2 456.6 440.9 457.6C444.4 458.5 446.7 461 448.3 465.5L470.3 529.8C472.1 534.8 473.6 540.4 469.9 544.3z"/></svg>`;
    case 'threads':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M436.8 302C436.2 232.4 398.5 190.5 334.8 190.5C292.3 190.5 256.5 209.7 237.7 240.4L278.9 269.1C289.6 252.3 304.3 238.3 331.3 238.3C361.8 238.3 377.6 255.3 382.1 286.8C367.4 284.5 352.6 283.3 337.5 283.3C255.1 283.3 216.4 320.6 216.4 369.9C216.4 419.2 255.2 449.6 312.3 449.6C375 449.6 412.4 407.4 427.7 355.1C443.6 362.3 454.6 379.1 454.6 404.4C454.6 472 376.6 508.9 310.5 508.9C213 508.9 149.2 444.9 149.2 340.7C149.2 213.1 233.5 131.3 346.8 131.3C422.8 131.3 460.4 164.7 486 209.4L528 179.9C500.2 121.9 438.1 80.4 344.9 80.4C196.4 80.4 95.4 185.8 95.4 338.6C95.4 478.4 194.3 559.5 312.1 559.5C409.5 559.5 507.9 502.7 507.9 405.5C507.9 354.7 478.7 321 436.7 302zM310.4 398.9C288.9 398.9 270 388.7 270 369.9C270 340.3 306.4 331.3 342 331.3C355.5 331.3 368.8 332.2 380.5 334.8C372.1 373.3 347.1 399 310.5 399L310.5 399z"/></svg>`;
    case 'weibo':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M471 241.6C478.6 217.6 457.6 194.8 433.6 199.9C411.6 204.7 404.8 171.8 426.5 167.1C476.6 156.2 518.8 204.2 503 251.9C496.2 273.1 464.2 262.7 471 241.6zM278.8 510.7C172.5 510.7 64 459.3 64 374.4C64 330.1 92 279 140.3 230.7C240 131 343.5 129.8 313.9 225C309.9 238.1 326.2 230.7 326.2 231C405.7 197.4 466.7 214.2 440.2 282.4C436.5 291.8 441.3 293.3 448.5 295.5C584.2 337.8 483.3 510.7 278.8 510.7zM422.5 364.4C417.1 308.7 344 270.4 259.1 278.7C174.3 287.3 110.3 339 115.7 394.7C121.1 450.4 194.2 488.7 279.1 480.4C363.9 471.8 427.9 420.1 422.5 364.4zM411.9 99.1C386 104.7 395.1 142.8 420.2 137.4C492.5 122.2 555 190.2 531.9 261.4C524.5 285.6 561 298.4 569.3 273.4C601.2 173.6 514.2 77.5 411.9 99.1zM333.4 410.1C316.3 448.9 266.6 470.1 224.3 456.4C183.5 443.3 166.3 403 184 366.7C201.7 331.3 247.1 311.3 287.4 321.6C329.4 332.4 350.5 371.8 333.4 410.1zM247.1 380.1C234.2 374.7 217.1 380.4 209.1 393C200.8 405.9 204.8 421 217.7 427C230.8 433 248.5 427.3 256.8 414.1C264.8 401 260.5 385.8 247.1 380.1zM279.7 366.7C274.6 365 268.3 367.3 265.4 372.1C262.5 377.2 264 382.7 269.1 385C274.2 387 280.8 384.7 283.7 379.6C286.5 374.4 284.8 368.7 279.7 366.7z"/></svg>`;
    case 'flickr':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M496 96L144 96C117.5 96 96 117.5 96 144L96 496C96 522.5 117.5 544 144 544L496 544C522.5 544 544 522.5 544 496L544 144C544 117.5 522.5 96 496 96zM240.5 256C275.6 256 304 284.4 304 319.5C304 354.6 275.6 383 240.5 383C205.4 383 177 354.6 177 319.5C177 284.4 205.4 256 240.5 256zM399.5 256C434.6 256 463 284.4 463 319.5C463 354.6 434.6 383 399.5 383C364.4 383 336 354.6 336 319.5C336 284.4 364.4 256 399.5 256z"/></svg>`;
    case 'nimblr':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M374.6 417.3C359.7 417.3 347.6 405.2 347.6 390.3C347.6 375.4 359.7 363.3 374.6 363.3C389.5 363.3 401.6 375.4 401.6 390.3C401.6 405.2 389.5 417.3 374.6 417.3zM295.2 390.3C295.2 405.3 283 417.5 268.1 417.5C253.1 417.5 240.9 405.3 240.9 390.3C240.9 375.3 253.1 363.2 268.1 363.2C283 363.2 295.2 375.3 295.2 390.3zM319.8 223C285 223 217.4 242.8 187.2 291L142 64L142 399.5C142 497.1 221.6 576 319.8 576C418 576 497.5 497 497.5 399.5C497.5 302 418.1 223 319.8 223zM319.8 531.1C246.5 531.1 187.3 472.2 187.3 399.5C187.3 326.8 246.5 267.9 319.8 267.9C393.1 267.9 452.3 326.8 452.3 399.4C452.3 472 393 531 319.8 531L319.8 531.1z"/></svg>`;
    case 'digg':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M145.7 236.3L64 236.3L64 410.7L196.7 410.7L196.7 160L145.7 160L145.7 236.3zM145.7 369.7L114.9 369.7L114.9 277.4L145.7 277.4L145.7 369.7zM442.9 236.3L442.9 410.7L524.7 410.7L524.7 439.2L442.9 439.2L442.9 480L576 480L576 236.3L442.9 236.3zM524.7 369.7L493.9 369.7L493.9 277.4L524.7 277.4L524.7 369.7zM289.1 410.7L371.2 410.7L371.2 439.2L289.1 439.2L289.1 480L422.4 480L422.4 236.3L289.1 236.3L289.1 410.7zM340.3 277.4L371.1 277.4L371.1 369.7L340.3 369.7L340.3 277.4zM217.3 160L268.6 160L268.6 211L217.3 211L217.3 160zM217.3 236.3L268.6 236.3L268.6 410.7L217.3 410.7L217.3 236.3z"/></svg>`;
    case 'youtube':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320.1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.4 47 320.4C47 320.4 47 409.8 58.4 452.7C64.7 476.3 83.2 494.2 106.7 500.5C149.3 512 320.1 512 320.1 512C320.1 512 490.9 512 533.5 500.5C557 494.2 575.5 476.3 581.8 452.7C593.2 409.8 593.2 320.4 593.2 320.4C593.2 320.4 593.2 231 581.8 188.1zM264.2 401.6L264.2 239.2L406.9 320.4L264.2 401.6z"/></svg>`;
    case 'vimeo':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M499.2 96L140.8 96C116.1 96 96 116.1 96 140.8L96 499.2C96 523.9 116.1 544 140.8 544L499.2 544C523.9 544 544 523.9 544 499.2L544 140.8C544 116.1 523.9 96 499.2 96zM473 244.8C471.6 276.3 449.6 319.5 407 374.2C363 431.4 325.7 460 295.3 460C276.4 460 260.5 442.6 247.4 407.7C221.9 314.4 211 259.7 190 259.7C187.6 259.7 179.1 264.8 164.6 274.9L149.4 255.3C186.7 222.5 222.3 186.1 244.6 184.1C269.8 181.7 285.3 198.9 291.1 235.8C311.8 367 321 386.8 358.7 327.4C372.2 306 379.5 289.7 380.5 278.5C384 245.3 354.6 247.6 334.7 256.1C350.6 204 381 178.7 425.9 180.1C459.2 181 474.9 202.6 473 244.8z"/></svg>`;
    case 'telegram':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M320 72C183 72 72 183 72 320C72 457 183 568 320 568C457 568 568 457 568 320C568 183 457 72 320 72zM435 240.7C431.3 279.9 415.1 375.1 406.9 419C403.4 437.6 396.6 443.8 390 444.4C375.6 445.7 364.7 434.9 350.7 425.7C328.9 411.4 316.5 402.5 295.4 388.5C270.9 372.4 286.8 363.5 300.7 349C304.4 345.2 367.8 287.5 369 282.3C369.2 281.6 369.3 279.2 367.8 277.9C366.3 276.6 364.2 277.1 362.7 277.4C360.5 277.9 325.6 300.9 258.1 346.5C248.2 353.3 239.2 356.6 231.2 356.4C222.3 356.2 205.3 351.4 192.6 347.3C177.1 342.3 164.7 339.6 165.8 331C166.4 326.5 172.5 322 184.2 317.3C256.5 285.8 304.7 265 328.8 255C397.7 226.4 412 221.4 421.3 221.2C423.4 221.2 427.9 221.7 430.9 224.1C432.9 225.8 434.1 228.2 434.4 230.8C434.9 234 435 237.3 434.8 240.6z"/></svg>`;
    case 'viber':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M508.3 113.9C495.6 102.2 444.2 64.9 329.6 64.4C329.6 64.4 194.5 56.3 128.7 116.7C92.1 153.3 79.2 207 77.8 273.5C76.4 340 74.7 464.6 194.8 498.4L194.9 498.4L194.8 550C194.8 550 194 570.9 207.8 575.1C224.4 580.3 234.2 564.4 250.1 547.3C258.8 537.9 270.8 524.1 279.9 513.6C362.1 520.5 425.2 504.7 432.4 502.4C449 497 542.9 485 558.1 360.4C573.9 231.8 550.5 150.6 508.3 113.9zM522.2 351C509.3 455 433.2 461.6 419.2 466.1C413.2 468 357.7 481.8 288 477.3C288 477.3 236 540 219.8 556.3C214.5 561.6 208.7 561.1 208.8 550.6C208.8 543.7 209.2 464.9 209.2 464.9L209.2 464.9C107.4 436.7 113.4 330.6 114.5 275.1C115.6 219.6 126.1 174.1 157.1 143.5C212.8 93 327.5 100.5 327.5 100.5C424.4 100.9 470.8 130.1 481.6 139.9C517.3 170.5 535.5 243.7 522.2 351zM383.2 270.2C383.6 278.8 370.7 279.4 370.3 270.8C369.2 248.8 358.9 238.1 337.7 236.9C329.1 236.4 329.9 223.5 338.4 224C366.3 225.5 381.8 241.5 383.2 270.2zM403.5 281.5C404.5 239.1 378 205.9 327.7 202.2C319.2 201.6 320.1 188.7 328.6 189.3C386.6 193.5 417.5 233.4 416.4 281.8C416.3 290.4 403.3 290 403.5 281.5zM450.5 294.9C450.6 303.5 437.6 303.6 437.6 295C437 213.5 382.7 169.1 316.8 168.6C308.3 168.5 308.3 155.7 316.8 155.7C390.5 156.2 449.8 207.1 450.5 294.9zM439.2 393L439.2 393.2C428.4 412.2 408.2 433.2 387.4 426.5L387.2 426.2C366.1 420.3 316.4 394.7 285 369.7C268.8 356.9 254 341.8 242.6 327.3C232.3 314.4 221.9 299.1 211.8 280.7C190.5 242.2 185.8 225 185.8 225C179.1 204.2 200 184 219.1 173.2L219.3 173.2C228.5 168.4 237.3 170 243.2 177.1C243.2 177.1 255.6 191.9 260.9 199.2C265.9 206 272.6 216.9 276.1 223C282.2 233.9 278.4 245 272.4 249.6L260.4 259.2C254.3 264.1 255.1 273.2 255.1 273.2C255.1 273.2 272.9 340.5 339.4 357.5C339.4 357.5 348.5 358.3 353.4 352.2L363 340.2C367.6 334.2 378.7 330.4 389.6 336.5C404.3 344.8 423 357.7 435.4 369.4C442.4 375.1 444 383.8 439.2 393z"/></svg>`;
    case 'signal':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M320 64C306.7 64 293.7 65 280.9 67L284.6 90.7C296.1 88.9 308 88 320 88C332 88 343.9 88.9 355.4 90.7L359.1 67C346.3 65 333.3 64 320 64zM380.8 71.3L375.1 94.6C398.5 100.3 420.5 109.5 440.5 121.7L453 101.2C430.9 87.8 406.6 77.6 380.8 71.3zM457.2 132.9C476.3 146.9 493.2 163.8 507.3 183L526.7 168.8C511 147.6 492.4 129 471.3 113.5L457.1 132.8zM538.9 187.1L518.4 199.6C530.6 219.6 539.8 241.6 545.5 265L568.8 259.3C562.5 233.5 552.3 209.2 538.9 187.1zM549.4 284.6C551.2 296.1 552.1 308 552.1 320C552.1 332 551.2 343.9 549.4 355.4L573.1 359.1C575 346.4 576.1 333.3 576.1 320C576.1 306.7 575.1 293.7 573.1 280.9L549.4 284.6zM518.4 440.5L538.9 453C552.3 430.9 562.5 406.6 568.8 380.8L545.5 375.1C539.8 398.5 530.6 420.5 518.4 440.5zM526.6 471.3L507.2 457.1C493.2 476.2 476.3 493.1 457.1 507.2L471.3 526.6C492.4 511.1 511.1 492.5 526.5 471.4zM440.5 518.3C420.5 530.5 398.5 539.7 375.1 545.4L380.8 568.7C406.6 562.4 430.9 552.2 453 538.8L440.5 518.3zM359.1 573L355.4 549.3C343.9 551.1 332 552 320 552C308 552 296.1 551.1 284.6 549.3L280.9 573C293.6 574.9 306.7 576 320 576C333.3 576 346.3 575 359.1 573zM265 545.4C247.4 541.1 230.6 534.8 214.9 526.8L207.1 522.8L174.3 530.5L179.8 553.9L204.1 548.2C221.5 557.1 240 564 259.4 568.7L265.1 545.4zM159.4 558.6L154 535.3L112.3 545C101.9 547.4 92.6 538.1 95 527.7L104.7 486.1L81.3 480.6L71.6 522.2C65.2 550 90 574.8 117.8 568.4L159.4 558.7zM109.4 465.7L117.1 432.9L113.1 425.1C105.1 409.4 98.8 392.6 94.5 375L71.3 380.7C76 400.1 82.9 418.7 91.7 436L86 460.3L109.4 465.8zM67 359.1L90.7 355.4C88.9 343.9 88 332 88 320C88 308 88.9 296.1 90.7 284.6L67 280.9C65 293.7 64 306.7 64 320C64 333.3 65 346.3 67 359.1zM94.6 265C100.3 241.6 109.5 219.6 121.7 199.6L101.2 187.1C87.8 209.2 77.6 233.5 71.3 259.3L94.6 265zM113.5 168.8L132.9 183C146.9 163.9 163.8 147 183 132.9L168.7 113.5C147.6 129 129 147.6 113.5 168.7zM199.6 121.8C219.6 109.6 241.6 100.4 265 94.7L259.2 71.3C233.4 77.6 209.1 87.8 187 101.2L199.5 121.7zM320 528C434.9 528 528 434.9 528 320C528 205.1 434.9 112 320 112C205.1 112 112 205.1 112 320C112 356.4 121.4 390.7 137.8 420.5C139.4 423.4 139.9 426.7 139.2 429.9L117.6 522.4L210.1 500.8C213.3 500.1 216.6 500.6 219.5 502.2C249.3 518.7 283.5 528 320 528z"/></svg>`;
    case 'discord':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M524.5 133.8C524.3 133.5 524.1 133.2 523.7 133.1C485.6 115.6 445.3 103.1 404 96C403.6 95.9 403.2 96 402.9 96.1C402.6 96.2 402.3 96.5 402.1 96.9C396.6 106.8 391.6 117.1 387.2 127.5C342.6 120.7 297.3 120.7 252.8 127.5C248.3 117 243.3 106.8 237.7 96.9C237.5 96.6 237.2 96.3 236.9 96.1C236.6 95.9 236.2 95.9 235.8 95.9C194.5 103 154.2 115.5 116.1 133C115.8 133.1 115.5 133.4 115.3 133.7C39.1 247.5 18.2 358.6 28.4 468.2C28.4 468.5 28.5 468.7 28.6 469C28.7 469.3 28.9 469.4 29.1 469.6C73.5 502.5 123.1 527.6 175.9 543.8C176.3 543.9 176.7 543.9 177 543.8C177.3 543.7 177.7 543.4 177.9 543.1C189.2 527.7 199.3 511.3 207.9 494.3C208 494.1 208.1 493.8 208.1 493.5C208.1 493.2 208.1 493 208 492.7C207.9 492.4 207.8 492.2 207.6 492.1C207.4 492 207.2 491.8 206.9 491.7C191.1 485.6 175.7 478.3 161 469.8C160.7 469.6 160.5 469.4 160.3 469.2C160.1 469 160 468.6 160 468.3C160 468 160 467.7 160.2 467.4C160.4 467.1 160.5 466.9 160.8 466.7C163.9 464.4 167 462 169.9 459.6C170.2 459.4 170.5 459.2 170.8 459.2C171.1 459.2 171.5 459.2 171.8 459.3C268 503.2 372.2 503.2 467.3 459.3C467.6 459.2 468 459.1 468.3 459.1C468.6 459.1 469 459.3 469.2 459.5C472.1 461.9 475.2 464.4 478.3 466.7C478.5 466.9 478.7 467.1 478.9 467.4C479.1 467.7 479.1 468 479.1 468.3C479.1 468.6 479 468.9 478.8 469.2C478.6 469.5 478.4 469.7 478.2 469.8C463.5 478.4 448.2 485.7 432.3 491.6C432.1 491.7 431.8 491.8 431.6 492C431.4 492.2 431.3 492.4 431.2 492.7C431.1 493 431.1 493.2 431.1 493.5C431.1 493.8 431.2 494 431.3 494.3C440.1 511.3 450.1 527.6 461.3 543.1C461.5 543.4 461.9 543.7 462.2 543.8C462.5 543.9 463 543.9 463.3 543.8C516.2 527.6 565.9 502.5 610.4 469.6C610.6 469.4 610.8 469.2 610.9 469C611 468.8 611.1 468.5 611.1 468.2C623.4 341.4 590.6 231.3 524.2 133.7zM222.5 401.5C193.5 401.5 169.7 374.9 169.7 342.3C169.7 309.7 193.1 283.1 222.5 283.1C252.2 283.1 275.8 309.9 275.3 342.3C275.3 375 251.9 401.5 222.5 401.5zM417.9 401.5C388.9 401.5 365.1 374.9 365.1 342.3C365.1 309.7 388.5 283.1 417.9 283.1C447.6 283.1 471.2 309.9 470.7 342.3C470.7 375 447.5 401.5 417.9 401.5z"/></svg>`;
    case 'sms':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M320 544C461.4 544 576 436.5 576 304C576 171.5 461.4 64 320 64C178.6 64 64 171.5 64 304C64 358.3 83.2 408.3 115.6 448.5L66.8 540.8C62 549.8 63.5 560.8 70.4 568.3C77.3 575.8 88.2 578.1 97.5 574.1L215.9 523.4C247.7 536.6 282.9 544 320 544zM204.8 236.8L224 236.8C232.8 236.8 240 244 240 252.8C240 261.6 232.8 268.8 224 268.8L204.8 268.8C199.5 268.8 195.2 273.1 195.2 278.4C195.2 283.7 199.5 288 204.8 288C227.8 288 246.4 306.6 246.4 329.6C246.4 352.6 227.8 371.2 204.8 371.2L179.2 371.2C170.4 371.2 163.2 364 163.2 355.2C163.2 346.4 170.4 339.2 179.2 339.2L204.8 339.2C210.1 339.2 214.4 334.9 214.4 329.6C214.4 324.3 210.1 320 204.8 320C181.8 320 163.2 301.4 163.2 278.4C163.2 255.4 181.8 236.8 204.8 236.8zM393.6 278.4C393.6 255.4 412.2 236.8 435.2 236.8L454.4 236.8C463.2 236.8 470.4 244 470.4 252.8C470.4 261.6 463.2 268.8 454.4 268.8L435.2 268.8C429.9 268.8 425.6 273.1 425.6 278.4C425.6 283.7 429.9 288 435.2 288C458.2 288 476.8 306.6 476.8 329.6C476.8 352.6 458.2 371.2 435.2 371.2L409.6 371.2C400.8 371.2 393.6 364 393.6 355.2C393.6 346.4 400.8 339.2 409.6 339.2L435.2 339.2C440.5 339.2 444.8 334.9 444.8 329.6C444.8 324.3 440.5 320 435.2 320C412.2 320 393.6 301.4 393.6 278.4zM295.3 244.6L320 285.7L344.7 244.6C348.4 238.4 355.8 235.5 362.7 237.4C369.6 239.3 374.4 245.6 374.4 252.8L374.4 355.2C374.4 364 367.2 371.2 358.4 371.2C349.6 371.2 342.4 364 342.4 355.2L342.4 310.6L333.7 325.1C330.8 329.9 325.6 332.9 320 332.9C314.4 332.9 309.2 329.9 306.3 325.1L297.6 310.6L297.6 355.2C297.6 364 290.4 371.2 281.6 371.2C272.8 371.2 265.6 364 265.6 355.2L265.6 252.8C265.6 245.6 270.4 239.3 277.3 237.4C284.2 235.5 291.6 238.4 295.3 244.6z"/></svg>`;
    case 'phone':
    case 'telephone':
    case 'call':
    case 'handset':
    case 'tel':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M224.2 89C216.3 70.1 195.7 60.1 176.1 65.4L170.6 66.9C106 84.5 50.8 147.1 66.9 223.3C104 398.3 241.7 536 416.7 573.1C493 589.3 555.5 534 573.1 469.4L574.6 463.9C580 444.2 569.9 423.6 551.1 415.8L453.8 375.3C437.3 368.4 418.2 373.2 406.8 387.1L368.2 434.3C297.9 399.4 241.3 341 208.8 269.3L253 233.3C266.9 222 271.6 202.9 264.8 186.3L224.2 89z"/></svg>`;
    case 'whatsapp':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M476.9 161.1C435 119.1 379.2 96 319.9 96C197.5 96 97.9 195.6 97.9 318C97.9 357.1 108.1 395.3 127.5 429L96 544L213.7 513.1C246.1 530.8 282.6 540.1 319.8 540.1L319.9 540.1C442.2 540.1 544 440.5 544 318.1C544 258.8 518.8 203.1 476.9 161.1zM319.9 502.7C286.7 502.7 254.2 493.8 225.9 477L219.2 473L149.4 491.3L168 423.2L163.6 416.2C145.1 386.8 135.4 352.9 135.4 318C135.4 216.3 218.2 133.5 320 133.5C369.3 133.5 415.6 152.7 450.4 187.6C485.2 222.5 506.6 268.8 506.5 318.1C506.5 419.9 421.6 502.7 319.9 502.7zM421.1 364.5C415.6 361.7 388.3 348.3 383.2 346.5C378.1 344.6 374.4 343.7 370.7 349.3C367 354.9 356.4 367.3 353.1 371.1C349.9 374.8 346.6 375.3 341.1 372.5C308.5 356.2 287.1 343.4 265.6 306.5C259.9 296.7 271.3 297.4 281.9 276.2C283.7 272.5 282.8 269.3 281.4 266.5C280 263.7 268.9 236.4 264.3 225.3C259.8 214.5 255.2 216 251.8 215.8C248.6 215.6 244.9 215.6 241.2 215.6C237.5 215.6 231.5 217 226.4 222.5C221.3 228.1 207 241.5 207 268.8C207 296.1 226.9 322.5 229.6 326.2C232.4 329.9 268.7 385.9 324.4 410C359.6 425.2 373.4 426.5 391 423.9C401.7 422.3 423.8 410.5 428.4 397.5C433 384.5 433 373.4 431.6 371.1C430.3 368.6 426.6 367.2 421.1 364.5z"/></svg>`;
    case 'skype':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M520.7 363.8C523.6 349.8 525.4 334.9 525.4 320C525.4 206.5 433.5 114.7 320.1 114.7C305.2 114.7 290.4 116.4 276.3 119.4C257.3 104.7 233.7 96 208 96C146.2 96 96 146.2 96 208C96 233.7 104.7 257.3 119.3 276.2C116.4 290.2 114.6 305.1 114.6 320C114.6 433.5 206.5 525.3 319.9 525.3C334.8 525.3 349.6 523.6 363.7 520.6C382.7 535.2 406.3 543.9 431.9 543.9C493.7 543.9 543.9 493.7 543.9 431.9C544 406.3 535.3 382.7 520.7 363.8zM326.1 455.3C260.5 455.3 205.6 426.1 205.6 390.3C205.6 374.3 214.6 359.7 235.1 359.7C266.3 359.7 269.2 404.6 323.2 404.6C348.9 404.6 365.5 393.2 365.5 378.3C365.5 359.6 349.5 356.7 323.5 350.3C261 334.9 205.7 328.3 205.7 263.1C205.7 203.9 264.3 182 314.8 182C369.9 182 425.6 203.9 425.6 237.4C425.6 254.3 414.2 269.2 395.3 269.2C367 269.2 366.1 235.7 320.3 235.7C294.6 235.7 278.3 242.7 278.3 258.2C278.3 278 299.1 280 347.4 291.2C388.8 300.5 438.1 318 438.1 368.8C438.1 427.9 381 455.3 326.1 455.3z"/></svg>`;
    case 'snapchat':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M561.1 430.6C557.7 421.4 551.3 416.5 544 412.4C542.6 411.6 541.4 410.9 540.3 410.5C538.1 409.4 535.9 408.3 533.7 407.1C510.9 395 493.1 379.8 480.7 361.7C477.2 356.6 474.1 351.2 471.6 345.6C470.5 342.6 470.6 340.9 471.4 339.3C472.2 338.1 473.1 337.1 474.3 336.3C478.2 333.7 482.3 331.1 485 329.3C489.9 326.1 493.8 323.6 496.2 321.9C505.6 315.4 512.1 308.4 516.2 300.6C519.1 295.2 520.7 289.3 521.1 283.2C521.5 277.1 520.5 271 518.3 265.4C512.1 249.1 496.7 239 478 239C474.1 239 470.1 239.4 466.3 240.2C465.3 240.4 464.2 240.7 463.2 240.9C463.4 229.7 463.1 218 462.1 206.4C458.6 165.6 444.3 144.3 429.4 127.2C419.9 116.5 408.7 107.5 396.2 100.5C373.6 87.6 348 81.1 320.1 81.1C292.2 81.1 266.7 87.6 244.1 100.5C231.6 107.5 220.4 116.6 210.8 127.3C195.9 144.3 181.6 165.7 178.1 206.5C177.1 218.1 176.9 229.9 177 241C176 240.7 175 240.5 173.9 240.3C170 239.5 166.1 239.1 162.2 239.1C143.5 239.1 128.1 249.2 121.9 265.5C119.7 271.2 118.7 277.3 119.1 283.3C119.5 289.3 121.1 295.3 124 300.7C128.1 308.5 134.7 315.4 144 322C146.5 323.7 150.4 326.2 155.2 329.4C157.8 331.1 161.7 333.6 165.5 336.1C166.8 337 167.9 338.1 168.8 339.4C169.6 341 169.6 342.8 168.4 346C165.9 351.5 162.9 356.8 159.5 361.8C147.4 379.5 130.1 394.4 108.1 406.4C96.4 412.6 84.2 416.7 79.1 430.7C75.2 441.2 77.8 453.2 87.6 463.3C91.2 467.1 95.4 470.2 100 472.7C109.6 478 119.8 482 130.3 484.8C132.5 485.4 134.6 486.3 136.4 487.5C140 490.6 139.5 495.4 144.2 502.3C146.6 505.9 149.6 509 153.2 511.4C163.2 518.3 174.5 518.8 186.4 519.2C197.2 519.6 209.4 520.1 223.3 524.7C229.1 526.6 235.1 530.3 242 534.6C258.7 544.9 281.6 558.9 319.8 558.9C358 558.9 381.1 544.8 397.9 534.5C404.8 530.3 410.8 526.6 416.4 524.7C430.3 520.1 442.6 519.6 453.3 519.2C465.2 518.7 476.5 518.3 486.5 511.4C490.7 508.5 494.2 504.7 496.7 500.2C500.1 494.4 500.1 490.3 503.3 487.4C505.1 486.2 507 485.3 509.1 484.8C519.8 482 530.1 477.9 539.9 472.6C544.8 470 549.2 466.5 552.9 462.4L553 462.2C562.2 452.3 564.5 440.7 560.8 430.4zM527.1 448.9C506.4 460.4 492.6 459.1 481.8 466C472.7 471.9 478.1 484.5 471.5 489.1C463.4 494.7 439.3 488.7 408.3 499C382.7 507.5 366.3 531.8 320.3 531.8C274.3 531.8 258.3 507.5 232.2 498.9C201.2 488.6 177.1 494.7 169 489C162.4 484.4 167.8 471.8 158.7 465.9C148 459 134.2 460.2 113.4 448.8C100.2 441.5 107.7 437 112.1 434.9C187.2 398.5 199.2 342.3 199.8 338.2C200.4 333.2 201.2 329.2 195.6 324.1C190.2 319.1 166.4 304.4 159.8 299.8C148.9 292.2 144.1 284.5 147.6 275.2C150.1 268.7 156.1 266.3 162.5 266.3C164.5 266.3 166.5 266.5 168.5 267C180.5 269.6 192.2 275.6 198.9 277.2C199.7 277.4 200.5 277.5 201.4 277.5C205 277.5 206.3 275.7 206 271.6C205.2 258.5 203.4 232.9 205.4 209C208.2 176.1 218.8 159.8 231.4 145.4C237.5 138.5 265.9 108.4 320.3 108.4C374.7 108.4 403 138.2 409 145.1C421.6 159.5 432.2 175.8 435 208.7C437.1 232.6 435.3 258.2 434.4 271.3C434.1 275.6 435.4 277.2 439 277.2C439.8 277.2 440.7 277.1 441.5 276.9C448.2 275.3 459.9 269.3 471.9 266.7C473.9 266.3 475.9 266 477.9 266C484.3 266 490.3 268.5 492.8 274.9C496.3 284.3 491.6 291.9 480.6 299.5C474 304.1 450.2 318.8 444.8 323.8C439.2 328.9 440 332.9 440.6 338C441.1 342.2 453.1 398.4 528.3 434.7C532.7 436.9 540.2 441.4 527 448.8z"/></svg>`;
    case 'link':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M451.5 160C434.9 160 418.8 164.5 404.7 172.7C388.9 156.7 370.5 143.3 350.2 133.2C378.4 109.2 414.3 96 451.5 96C537.9 96 608 166 608 252.5C608 294 591.5 333.8 562.2 363.1L491.1 434.2C461.8 463.5 422 480 380.5 480C294.1 480 224 410 224 323.5C224 322 224 320.5 224.1 319C224.6 301.3 239.3 287.4 257 287.9C274.7 288.4 288.6 303.1 288.1 320.8C288.1 321.7 288.1 322.6 288.1 323.4C288.1 374.5 329.5 415.9 380.6 415.9C405.1 415.9 428.6 406.2 446 388.8L517.1 317.7C534.4 300.4 544.2 276.8 544.2 252.3C544.2 201.2 502.8 159.8 451.7 159.8zM307.2 237.3C305.3 236.5 303.4 235.4 301.7 234.2C289.1 227.7 274.7 224 259.6 224C235.1 224 211.6 233.7 194.2 251.1L123.1 322.2C105.8 339.5 96 363.1 96 387.6C96 438.7 137.4 480.1 188.5 480.1C205 480.1 221.1 475.7 235.2 467.5C251 483.5 269.4 496.9 289.8 507C261.6 530.9 225.8 544.2 188.5 544.2C102.1 544.2 32 474.2 32 387.7C32 346.2 48.5 306.4 77.8 277.1L148.9 206C178.2 176.7 218 160.2 259.5 160.2C346.1 160.2 416 230.8 416 317.1C416 318.4 416 319.7 416 321C415.6 338.7 400.9 352.6 383.2 352.2C365.5 351.8 351.6 337.1 352 319.4C352 318.6 352 317.9 352 317.1C352 283.4 334 253.8 307.2 237.5z"/></svg>`;
    case 'linkedin':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM165 266.2L231.5 266.2L231.5 480L165 480L165 266.2zM236.7 198.5C236.7 219.8 219.5 237 198.2 237C176.9 237 159.7 219.8 159.7 198.5C159.7 177.2 176.9 160 198.2 160C219.5 160 236.7 177.2 236.7 198.5zM413.9 480L413.9 376C413.9 351.2 413.4 319.3 379.4 319.3C344.8 319.3 339.5 346.3 339.5 374.2L339.5 480L273.1 480L273.1 266.2L336.8 266.2L336.8 295.4L337.7 295.4C346.6 278.6 368.3 260.9 400.6 260.9C467.8 260.9 480.3 305.2 480.3 362.8L480.3 480L413.9 480z"/></svg>`;
    case 'x':
    case 'twitter':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M453.2 112L523.8 112L369.6 288.2L551 528L409 528L297.7 382.6L170.5 528L99.8 528L264.7 339.5L90.8 112L236.4 112L336.9 244.9L453.2 112zM428.4 485.8L467.5 485.8L215.1 152L173.1 152L428.4 485.8z"/></svg>`;
    case 'sidebar-close':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/></svg>`;
    case 'sidebar-open':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path stroke="currentColor" d="m8 9 3 3-3 3"/></svg>`;
  }
}