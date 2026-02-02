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
            const appNav = document.getElementById('appNavLinks');
            const mobileNav = document.getElementById('mobileNavContent');
            const mobileSocials = document.getElementById('mobileSocials');
            const appSubNav = document.getElementById('appSubNav');

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

            // Inject app-specific navigation if provided
            if (config.navLinks && Array.isArray(config.navLinks) && config.navLinks.length > 0) {
                // Add class to header to indicate we have navigation (for CSS)
                const headerBar = document.querySelector('.app-header-main');
                if (headerBar) headerBar.classList.add('has-nav');
                document.body.classList.add('has-fixed-header');
                document.body.classList.add('has-sub-nav');

                const currentPath = window.location.pathname.split('/').pop() || 'index.html';
                const navHtml = config.navLinks.map(link => {
                    const isActive = currentPath === link.url || (currentPath === '' && link.url === 'index.html');
                    return `<a href="${link.url}" class="nav-link ${isActive ? 'active' : ''}">${link.name}</a>`;
                }).join('');

                if (appNav) appNav.innerHTML = navHtml;
                if (mobileNav) mobileNav.innerHTML = navHtml;

                // Sync socials to mobile if they exist
                if (mobileSocials) {
                    const desktopSocials = document.querySelector('.social-links-top');
                    if (desktopSocials) mobileSocials.innerHTML = desktopSocials.innerHTML;
                }
            } else if (appSubNav) {
                appSubNav.style.display = 'none';
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

        // Mobile Menu Logic with Event Delegation (Robust)
        if (!this._behaviorInitialized) {
            document.addEventListener('click', (e) => {
                const menuBtn = e.target.closest('.mobile-menu-btn');
                const navWrapper = document.getElementById('mobileMenuWrapper');

                if (menuBtn) {
                    e.stopPropagation();
                    if (navWrapper) {
                        navWrapper.classList.toggle('active');
                        const icon = menuBtn.querySelector('i');
                        if (icon) {
                            icon.classList.toggle('fa-bars');
                            icon.classList.toggle('fa-times');
                        }
                    }
                    return;
                }

                // Close menu when clicking outside
                if (navWrapper && navWrapper.classList.contains('active')) {
                    if (!navWrapper.contains(e.target)) {
                        navWrapper.classList.remove('active');
                        const activeBtn = document.querySelector('.mobile-menu-btn');
                        if (activeBtn) {
                            const icon = activeBtn.querySelector('i');
                            if (icon) {
                                icon.classList.add('fa-bars');
                                icon.classList.remove('fa-times');
                            }
                        }
                    }
                }
            });
            this._behaviorInitialized = true;
        }
    }

    static loadFallback(elementId, config = {}) {
        const element = document.getElementById(elementId);
        if (!element) return;

        if (elementId === 'header') {
            element.innerHTML = this.getFallbackHeader(config);
            this.initHeaderBehavior(config); // Re-init behavior for fallback
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
                <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; flex: 1;">
                        ${appSection}
                        <a href="${this.baseUrl}/" style="color: #E8916B; text-decoration: none; font-weight: bold;">
                            Bitcoin Data Labs
                        </a>
                    </div>
                    
                    <button class="mobile-menu-btn" aria-label="Toggle menu" style="display: none;">
                        <i class="fas fa-bars"></i>
                    </button>

                    <div class="nav-links-wrapper" style="display: flex; gap: 15px;">
                        <div class="app-nav" id="appNavLinks"></div>
                        <a href="https://github.com/sorukumar/Bitcoin-Data-Labs" target="_blank" style="color: #2A3342; text-decoration: none; opacity: 0.8;" class="social-icon">
                            <i class="fab fa-github"></i>
                        </a>
                        <a href="https://x.com/Soru_kumar" target="_blank" style="color: #2A3342; text-decoration: none; opacity: 0.8;" class="social-icon">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/saurabh-kumar-930b6623/" target="_blank" style="color: #2A3342; text-decoration: none; opacity: 0.8;" class="social-icon">
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