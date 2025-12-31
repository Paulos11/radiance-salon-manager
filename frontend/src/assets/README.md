# Assets Directory

This directory contains static assets used in the application.

## Contents

- **logo.svg** - Radiance Salon Manager logo
- **images/** - Image files (can be added as needed)
- **icons/** - Icon files (can be added as needed)

## Usage

Import assets in components:

```javascript
import logo from './assets/logo.svg';

function Header() {
  return <img src={logo} alt="Radiance Logo" />;
}
```

## Adding New Assets

1. Place image files in this directory
2. Import and use in components
3. Optimize images before adding (compress, resize)

## Supported Formats

- SVG (recommended for logos and icons)
- PNG (for images with transparency)
- JPG (for photos)
- WebP (for optimized images)
