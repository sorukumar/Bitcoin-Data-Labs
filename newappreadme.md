# Using Bitcoin Data Labs Components

This guide provides everything you need to integrate the unified Bitcoin Data Labs header and footer into your application. These components are designed to be mobile-responsive, fluid, and brand-consistent.

## Prerequisites

1. **Font Awesome**: The components use Font Awesome icons.
2. **Standard IDs**: You must have `<div id="header"></div>` and `<div id="footer"></div>` in your HTML.

## Standard Integration (Recommended)

Copy-paste this structure into your application's shell:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- 1. Unified Styles (Load BEFORE your own CSS) -->
    <link rel="stylesheet" href="https://sorukumar.github.io/Bitcoin-Data-Labs/styles/styles.css">
    
    <!-- 2. Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>

<!-- 3. Add 'has-fixed-header' to handle the shared header height automatically -->
<body class="has-fixed-header">
    
    <div id="header"></div>

    <main class="container">
        <!-- APP CONTENT HERE -->
    </main>

    <div id="footer"></div>

    <!-- 4. Component Loader -->
    <script src="https://sorukumar.github.io/Bitcoin-Data-Labs/components/app-components.js"></script>
    
    <!-- 5. Initialization -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            BitcoinLabsApp.init({
                isApp: true,
                appName: "Your Project Name",
                appHomeUrl: "index.html",
                navLinks: [
                    { name: 'Dashboard', url: 'index.html' },
                    { name: 'Analytics', url: 'analytics.html' },
                    { name: 'GitHub', url: 'https://github.com/...' }
                ]
            });
        });
    </script>
</body>
</html>
```

## Configuration Schema

The `init()` function accepts the following parameters:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `isApp` | `boolean` | Yes | Set to `true` to enable the split-logo "App Branding" layout. |
| `appName` | `string` | Yes | The title of your app (e.g., "PlebDashboard"). |
| `appHomeUrl` | `string`| Yes | The home path for your app. |
| `navLinks` | `array` | No | List of `{ name, url }` objects. Collapses to hamburger menu on mobile. |
| `scrollThreshold` | `number` | No | Scroll distance before header compresses. Default: `30`. |
| `debug` | `boolean` | No | Enables console logging for loading lifecycle. |

## Feature Showcase

### 1. Dual Branding
When `isApp: true` is used, the header displays your application name prominently, followed by a vertical divider and the "Bitcoin Data Labs" parent brand.

### 2. Auto-Adaptive Navigation
You no longer need to build separate mobile navigations.
- **Desktop**: Links appear horizontally next to social icons.
- **Mobile (<768px)**: A hamburger menu appears. Social links and `navLinks` are moved into a vertical slide-down menu.

### 3. CSS Variable Exposure
You can theme the component shell using your app's CSS:
```css
:root {
  --max-width: 1400px; /* Adjust header content width */
  --header-height: 90px;
  --primary: #your-color; /* Adjust accent color */
}
```

## Migration from `include.js`
If you were using the old `include.js` or `BitcoinLabsComponents` class:
1. Update the script source to `app-components.js`.
2. Update the class reference to `BitcoinLabsApp`.
3. Add `class="has-fixed-header"` to your `body` tag.

## Support & Contributing
- **Issues**: Open in [Bitcoin-Data-Labs](https://github.com/sorukumar/Bitcoin-Data-Labs).
- **Updates**: Components are served via GitHub Pages; updates to the main repo are immediate.