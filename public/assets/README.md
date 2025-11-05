# Assets Organization

This folder contains all static assets for the Meghana's Biryani website, organized by page/component.

## Folder Structure

```
public/assets/
├── navbar/
│   ├── icons/     # Logo, menu icons, close/hamburger icons
│   └── images/    # Navbar background images, banners
├── homepage/
│   ├── icons/     # Feature icons, decorative icons
│   └── images/    # Hero images, section backgrounds
├── about/
│   ├── icons/     # Value icons, heritage icons
│   └── images/    # Heritage photos, team photos, restaurant images
├── menu/
│   ├── icons/     # Category icons, spice level icons, dietary icons
│   └── images/    # Food photography, menu item images
└── footer/
    ├── icons/     # Social media icons, payment icons, location icons
    └── images/    # Footer logos, partner logos
```

## Usage in Next.js

Assets in the `public` folder can be referenced from the root path `/`:

```tsx
// Example: Using an image from the homepage folder
<Image 
  src="/assets/homepage/images/hero-banner.jpg" 
  alt="Hero Banner"
  width={1920}
  height={1080}
/>

// Example: Using a navbar logo
<img src="/assets/navbar/icons/logo.svg" alt="Meghana's Biryani" />

// Example: Using a menu item image
<Image 
  src="/assets/menu/images/chicken-biryani.jpg" 
  alt="Chicken Biryani"
  width={800}
  height={800}
/>

// Example: Using footer social icons
<img src="/assets/footer/icons/instagram.svg" alt="Instagram" />
```

## Best Practices

1. **Image Formats**: Use WebP for better compression, with PNG/JPG fallbacks
2. **Naming Convention**: Use kebab-case (e.g., `hero-banner.jpg`, `menu-item-1.jpg`)
3. **Optimization**: Compress images before adding them to the project
4. **Dimensions**: Keep high-resolution versions for hero images (1920x1080 or larger)
5. **Thumbnails**: Create smaller versions for menu items and previews

## Recommended Image Sizes

- **Hero Images**: 1920x1080px or 1920x1200px
- **Menu Items**: 800x800px (square) or 1200x800px (landscape)
- **About Page Photos**: 1200x800px
- **Icons/Logos**: SVG preferred, or PNG with transparent background
- **Thumbnails**: 400x400px

