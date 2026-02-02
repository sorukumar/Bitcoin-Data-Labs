# Bitcoin Data Labs UI Shell - Integration Guide

This guide provides technical specifications for integrating the unified header and footer components into standalone applications within the Bitcoin Data Labs ecosystem.

## 🚀 Pre-flight Checklist for AI Agents

When working on a repository integration, ensure the following steps are followed sequentially:

1.  **Remove Legacy Mobile Navs**: Delete any local hamburger menus, mobile navigation CSS/JS, or custom header logic. The shared library handles this natively.
2.  **Clear CSS Overrides**: Look for `!important` rules targeting `header`, `#header`, or `footer`. These usually cause layout breakage with the modern fluid shell.
3.  **Bootstrap Body**: Ensure the `<body>` tag has the `.has-fixed-header` class.

## 🛠️ Step-by-Step Integration

### 1. HTML Structure
Ensure your `index.html` (and all other pages) follows this skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Unified Styles (Load BEFORE your app's CSS) -->
    <link rel="stylesheet" href="https://sorukumar.github.io/Bitcoin-Data-Labs/styles/styles.css">
    
    <!-- Required Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>

<body class="has-fixed-header">
    
    <!-- Component Placeholders -->
    <div id="header"></div>

    <main class="container">
        <!-- Your App Content -->
    </main>

    <div id="footer"></div>

    <!-- Component Library -->
    <script src="https://sorukumar.github.io/Bitcoin-Data-Labs/components/app-components.js"></script>
    
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // INITIALIZATION
            BitcoinLabsApp.init({
                isApp: true,
                appName: "Your App Title",
                appHomeUrl: "index.html",
                navLinks: [
                    { name: 'Dashboard', url: 'index.html' },
                    { name: 'Explorer', url: 'explorer.html' }
                ]
            });
        });
    </script>
</body>
</html>
```

## ⚙️ Configuration Schema

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `isApp` | `boolean` | Yes | Switches to the split-logo "App Name \| BDL" branding. |
| `appName` | `string` | Yes | The primary title shown in the header. |
| `appHomeUrl` | `string` | Yes | Local path or global URL for the logo link. |
| `navLinks` | `array` | No | List of `{ name, url }` objects. **Note**: If provided, mobile view uses a hamburger menu. If omitted, social icons stay in the top bar. |
| `scrollThreshold` | `number` | No | Pixels to scroll before header compresses (Default: `30`). |
| `debug` | `boolean` | No | Logs detailed lifecycle events to the browser console. |

## 🎨 Layout & Theming

The shell is fluid and uses CSS variables for effortless synchronization. You can override these in your app's `:root`:

- `--max-width`: Controls the content constraint within the header/container (default `900px`).
- `--header-height`: Standard height (default `90px`).
- `--z-header`: Stacking priority (default `10000`).

## 📱 Mobile Behavior
- **Breakpoints**: The shell switches to mobile view at **768px**.
- **Hamburger**: JS automatically detects the presence of `navLinks`. If links exist, a hamburger menu button is dynamically enabled. If not, the header remains static with social links visible.

## 🔄 Migration Guide
If migrating from `include.js` or `BitcoinLabsComponents`:
1.  **Global Object**: Change all references from `BitcoinLabsComponents` to `BitcoinLabsApp`.
2.  **Script Path**: Point the script src to `https://sorukumar.github.io/Bitcoin-Data-Labs/components/app-components.js`.
3.  **Link Cleanup**: Move your hardcoded app navigation into the `navLinks` array in the `init()` call.

## 🆘 Support
Report issues or propose branding updates in the [Bitcoin-Data-Labs repository](https://github.com/sorukumar/Bitcoin-Data-Labs).