/**
 * Bitcoin Data Labs App Components
 * Lightweight integration for external applications
 * Version: 1.0.0
 */
class BitcoinLabsAppComponents {
    static baseUrl = 'https://sorukumar.github.io/Bitcoin-Data-Labs';
    static version = '1.0.0';
    
    static async loadComponent(elementId, componentPath, config = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${componentPath}`, {
                cache: 'default', // Allow browser caching
                mode: 'cors'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            let html = await response.text();
            
            // Fix all relative paths to absolute URLs
            html = this.fixPaths(html);
            
            const targetElement = document.getElementById(elementId);
            if (!targetElement) {
                throw new Error(`Element with id "${elementId}" not found`);
            }
            
            targetElement.innerHTML = html;
            
            // Apply configuration and behaviors
            if (elementId === 'header') {
                if (config.isApp) this.configureAppHeader(config);
                this.initHeaderBehavior(config);
            }
            
        } catch (error) {
            console.warn(`Bitcoin Data Labs: Fallback for ${elementId}:`, error.message);
            this.loadFallback(elementId, config);
        }
    }
    
    static fixPaths(html) {
        return html
            .replace(/src="\/Bitcoin-Data-Labs\//g, `src="${this.baseUrl}/`)
            .replace(/href="\/Bitcoin-Data-Labs\//g, `href="${this.baseUrl}/`)
            .replace(/src="\.\.\/logo-light\.png"/g, `src="${this.baseUrl}/logo-light.png"`)
            .replace(/src="\.\.\/([^"]+)"/g, `src="${this.baseUrl}/$1"`)
            .replace(/href="\.\.\/([^"]+)"/g, `href="${this.baseUrl}/$1"`);
    }
    
    static configureAppHeader(config) {
        // Use timeout to ensure DOM is ready
        setTimeout(() => {
            const appName = document.getElementById('currentAppName');
            const appLink = document.getElementById('appHomeLink');
            
            if (appName) {
                if (config.appName) {
                    appName.textContent = config.appName;
                } else {
                    // Hide the entire app logo section when appName is null
                    const appLogo = appName.closest('.app-logo');
                    const divider = document.querySelector('.divider');
                    if (appLogo) appLogo.style.display = 'none';
                    if (divider) divider.style.display = 'none';
                }
            }
            if (appLink && config.appHomeUrl) {
                appLink.href = config.appHomeUrl;
            }
        }, 100);
    }
    
    static initHeaderBehavior(config = {}) {
        const scrollThreshold = config.scrollThreshold || 30;
        let ticking = false;
        
        const updateHeader = () => {
            const header = document.querySelector('#header .top-bar');
            if (header) {
                const shouldCompress = window.scrollY > scrollThreshold;
                header.classList.toggle('header-compressed', shouldCompress);
            }
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }
    
    static loadFallback(elementId, config = {}) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        if (elementId === 'header') {
            element.innerHTML = this.getFallbackHeader(config);
        } else if (elementId === 'footer') {
            element.innerHTML = this.getFallbackFooter();
        }
    }
    
    static getFallbackHeader(config) {
        const appSection = config.isApp && config.appName ? `
            <a href="${config.appHomeUrl || '#'}" style="color: #2A3342; text-decoration: none; font-weight: bold;">
                ${config.appName}
            </a>
            <span style="margin: 0 10px; color: #ccc;">|</span>
        ` : '';
        
        return `
            <div class="top-bar" style="background: linear-gradient(to bottom, #FDFBF9, #F5F1EE); padding: 10px 0;">
                <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center;">
                        ${appSection}
                        <a href="${this.baseUrl}/" style="color: #E8916B; text-decoration: none; font-weight: bold;">
                            Bitcoin Data Labs
                        </a>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <a href="https://github.com/sorukumar/Bitcoin-Data-Labs" target="_blank" style="color: #2A3342; text-decoration: none; opacity: 0.8; transition: all 0.3s ease;" onmouseover="this.style.opacity='1'; this.style.color='#E8916B';" onmouseout="this.style.opacity='0.8'; this.style.color='#2A3342';">
                            <i class="fab fa-github"></i>
                        </a>
                        <a href="https://x.com/Soru_kumar" target="_blank" style="color: #2A3342; text-decoration: none; opacity: 0.8; transition: all 0.3s ease;" onmouseover="this.style.opacity='1'; this.style.color='#E8916B';" onmouseout="this.style.opacity='0.8'; this.style.color='#2A3342';">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/saurabh-kumar-930b6623/" target="_blank" style="color: #2A3342; text-decoration: none; opacity: 0.8; transition: all 0.3s ease;" onmouseover="this.style.opacity='1'; this.style.color='#E8916B';" onmouseout="this.style.opacity='0.8'; this.style.color='#2A3342';">
                            <i class="fab fa-linkedin"></i>
                        </a>
                    </div>
                </div>
            </div>`;
    }
    
    static getFallbackFooter() {
        return `
            <footer style="background: #F5F1EE; padding: 2rem; text-align: center; margin-top: 4rem; font-size: 0.9rem; color: #5F6C7E;">
                <p style="margin: 0; color: #5F6C7E;">
                    © ${new Date().getFullYear()} <a href="${this.baseUrl}/" style="color: #E8916B; text-decoration: none;">Bitcoin Data Labs</a>. All rights reserved.
                </p>
            </footer>`;
    }
    
    static loadFavicon() {
        // Remove any existing favicons
        const existingLinks = document.querySelectorAll('link[rel*="icon"]');
        existingLinks.forEach(link => link.remove());
        
        // Add Bitcoin Data Labs favicon
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        favicon.href = `${this.baseUrl}/favicon.png`;
        document.head.appendChild(favicon);
    }
    
    static init(config = {}) {
        // Validate config
        if (config.isApp && !config.appName) {
            console.warn('Bitcoin Data Labs: appName is recommended when isApp is true');
        }
        
        // Load favicon
        this.loadFavicon();
        
        // Load components
        const headerPath = config.isApp ? '/components/app-header.html' : '/components/header.html';
        this.loadComponent('header', headerPath, config);
        this.loadComponent('footer', '/components/footer.html', config);
        
        // Debug info
        if (config.debug) {
            console.log(`Bitcoin Data Labs App Components v${this.version} initialized`, config);
        }
    }
}

// Global alias for convenience
window.BitcoinLabsApp = BitcoinLabsAppComponents;