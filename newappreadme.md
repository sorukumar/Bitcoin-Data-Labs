# Using Bitcoin Data Labs Components in Your App

This guide explains how to integrate the Bitcoin Data Labs header and footer components into your application.

## Quick Start

Add this code to your HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Your existing head content -->
    
    <!-- Add Bitcoin Data Labs styles -->
    <link rel="stylesheet" href="https://sorukumar.github.io/Bitcoin-Data-Labs/styles/styles.css">
    <!-- Required for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <!-- Header placeholder -->
    <div id="header"></div>

    <!-- Your app content here -->

    <!-- Footer placeholder -->
    <div id="footer"></div>

    <!-- Add Bitcoin Data Labs components -->
    <script src="https://sorukumar.github.io/Bitcoin-Data-Labs/components/include.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            BitcoinLabsComponents.init({
                isApp: true,
                appName: "Your App Name",  // Replace with your app name
                appHomeUrl: "https://github.com/yourusername/your-repo"  // Replace with your repo URL
            });
        });
    </script>
</body>
</html>
```

## Configuration Options

The `BitcoinLabsComponents.init()` accepts a configuration object with these properties:

- `isApp` (boolean): Set to true to use the app header layout
- `appName` (string): Your application's name
- `appHomeUrl` (string): URL to your application's homepage or repository

## Features

1. **Smart Header Behavior**
   - Compresses on scroll
   - Maintains brand consistency
   - Responsive design

2. **Branding Integration**
   - Shows your app name alongside Bitcoin Data Labs branding
   - Includes social links
   - Consistent styling

3. **Automatic Mobile Optimization**
   - Responsive layout
   - Touch-friendly
   - Compact design on smaller screens

## Common Use Cases

### Basic Integration
```javascript
BitcoinLabsComponents.init({
    isApp: true,
    appName: "PlebDashboard",
    appHomeUrl: "https://github.com/sorukumar/plebdashboard"
});
```

### Customizing Header Behavior
The header automatically compresses on scroll. If you need to customize this behavior, you can modify the threshold:

```javascript
BitcoinLabsComponents.init({
    isApp: true,
    appName: "Your App",
    appHomeUrl: "your-url",
    scrollThreshold: 100  // Optional: customize when header compresses (in pixels)
});
```

## Troubleshooting

1. **Components Not Loading**
   - Check if the URLs are correct
   - Ensure you have internet connectivity
   - Check browser console for errors

2. **Styling Issues**
   - Make sure the styles.css is loaded before your app's CSS
   - Use browser dev tools to inspect elements

## Best Practices

1. **Load Order**
   - Include the CSS files in the head
   - Place component divs at the start and end of body
   - Load include.js just before closing body tag

2. **Responsive Design**
   - Don't override the component's responsive styles
   - Test on multiple screen sizes

3. **Performance**
   - Components are loaded asynchronously
   - Resources are cached by the browser

## Support

For issues or suggestions:
- Open an issue in the [Bitcoin Data Labs repository](https://github.com/sorukumar/Bitcoin-Data-Labs)
- Contact through Twitter [@Soru_kumar](https://x.com/Soru_kumar)