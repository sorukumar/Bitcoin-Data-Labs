/**
 * Bitcoin Data Labs App Components
 * Lightweight integration for external applications
 * Version: 1.0.0
 */
class BitcoinLabsAppComponents {
    static _baseUrl;
    static version = '1.0.0';

    static get baseUrl() {
        if (this._baseUrl) return this._baseUrl;

        let scriptSrc = '';
        if (document.currentScript && document.currentScript.src) {
            scriptSrc = document.currentScript.src;
        } else {
            const scripts = Array.from(document.getElementsByTagName('script')).reverse();
            const found = scripts.find(script => script.src && script.src.includes('/components/app-components.js'));
            if (found) scriptSrc = found.src;
        }

        try {
            if (scriptSrc) {
                const url = new URL(scriptSrc, window.location.href);
                const basePath = url.pathname.replace(/\/components\/app-components\.js$/, '');
                this._baseUrl = `${url.origin}${basePath}`.replace(/\/$/, '');
                return this._baseUrl;
            }
        } catch (error) {
            console.warn('Bitcoin Data Labs: could not derive baseUrl from script src', error);
        }

        if (window.location.hostname === 'sorukumar.github.io') {
            this._baseUrl = 'https://sorukumar.github.io/Bitcoin-Data-Labs';
        } else {
            this._baseUrl = window.location.origin;
        }
        return this._baseUrl;
    }

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
            } else if (elementId === 'footer') {
                this.configureAppFooter(config);
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
            .replace(/src="https?:\/\/sorukumar\.github\.io\/Bitcoin-Data-Labs\//g, `src="${this.baseUrl}/`)
            .replace(/href="https?:\/\/sorukumar\.github\.io\/Bitcoin-Data-Labs\//g, `href="${this.baseUrl}/`)
            .replace(/src="https?:\/\/bitcoindatalabs\.org\//g, `src="${this.baseUrl}/`)
            .replace(/href="https?:\/\/bitcoindatalabs\.org\//g, `href="${this.baseUrl}/`)
            .replace(/src="\.\.\/logo\.svg"/g, `src="${this.baseUrl}/logo.svg"`)
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
                const headerBar = document.querySelector('.app-header-main');
                if (headerBar) headerBar.classList.add('has-nav');
                document.body.classList.add('has-nav'); // NEW: Add to body for global scoping
                document.body.classList.add('has-fixed-header');
                document.body.classList.add('has-sub-nav');

                const currentPath = window.location.pathname.split('/').pop() || 'index.html';
                const navHtml = config.navLinks.map(link => {
                    const isActive = currentPath === link.url || (currentPath === '' && link.url === 'index.html');
                    return `<a href="${link.url}" class="nav-link ${isActive ? 'active' : ''}">${link.name}</a>`;
                }).join('');

                if (appNav) appNav.innerHTML = navHtml;
                if (mobileNav) mobileNav.innerHTML = navHtml;

            } else if (appSubNav) {
                appSubNav.style.display = 'none';
            }

            // Inject suite links if provided
            // Inject suite links if provided
            if (config.suiteLinks && Array.isArray(config.suiteLinks) && config.suiteLinks.length > 0) {
                const desktopSuite = document.getElementById('desktopSuiteLinks');
                const mobileSuite = document.getElementById('mobileSuiteContent');

                if (desktopSuite) {
                    const menuItems = config.suiteLinks.map(link => {
                        const iconHtml = link.icon ? `<i class="${link.icon}" style="width: 16px; text-align: center; margin-right: 8px; opacity: 0.7;"></i>` : '';
                        return `<a href="${link.url}" style="display: block; padding: 10px 16px; color: inherit; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: background 0.2s;" onmouseover="this.style.background='rgba(128,128,128,0.1)'" onmouseout="this.style.background='transparent'" target="_blank">${iconHtml}${link.name}</a>`;
                    }).join('');
                    
                    // Use HTML5 native <details> for a zero-JS accessible dropdown
                    desktopSuite.innerHTML = `
                        <style>
                            .bdl-suite-summary::marker, .bdl-suite-summary::-webkit-details-marker { display: none; }
                            @media screen and (max-width: 768px) {
                                .bdl-suite-details { display: none !important; }
                            }
                        </style>
                        <details style="position: relative;" class="bdl-suite-details">
                            <summary class="bdl-suite-summary" style="cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 6px; background: rgba(128,128,128,0.1); color: inherit; font-weight: 600; font-size: 0.85rem; list-style: none; transition: background 0.2s;" onmouseover="this.style.background='rgba(128,128,128,0.2)'" onmouseout="this.style.background='rgba(128,128,128,0.1)'">
                                <i class="fas fa-layer-group"></i> orange-dev-suite <i class="fas fa-chevron-down" style="font-size: 0.7em; opacity: 0.7;"></i>
                            </summary>
                            <div style="position: absolute; top: 100%; right: 0; margin-top: 8px; background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, rgba(128,128,128,0.2)); border-radius: 8px; padding: 6px 0; min-width: 200px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); z-index: 100;">
                                ${menuItems}
                            </div>
                        </details>
                    `;

                    // Close details dropdown when clicking outside
                    document.addEventListener('click', (e) => {
                        const details = document.querySelector('.bdl-suite-details');
                        if (details && !details.contains(e.target)) {
                            details.removeAttribute('open');
                        }
                    });
                }

                if (mobileSuite) {
                    const mobileSuiteHtml = `
                        <div style="border-top: 1px solid rgba(128,128,128,0.2); margin: 15px 0 5px 0; padding-top: 15px;">
                            <div style="font-size: 0.8rem; letter-spacing: 0.5px; color: #a0aec0; margin: 0 15px 10px 15px; font-weight: 600;">orange-dev-suite</div>
                            ${config.suiteLinks.map(link => {
                                const iconHtml = link.icon ? `<i class="${link.icon}" style="margin-right: 10px; width: 16px; text-align: center; opacity: 0.7;"></i>` : '';
                                return `<a href="${link.url}" class="nav-link suite-link-mobile" style="display: flex; align-items: center; color: inherit;" target="_blank">${iconHtml}${link.name}</a>`;
                            }).join('')}
                        </div>
                    `;
                    mobileSuite.innerHTML = mobileSuiteHtml;
                }
            }
        }, 100);
    }

    static initHeaderBehavior(config = {}) {
        const scrollThreshold = config.scrollThreshold || 30;
        let ticking = false;

        const updateHeader = () => {
            const header = document.querySelector('#header .top-bar');
            const shouldCompress = window.scrollY > scrollThreshold;

            if (header) {
                header.classList.toggle('header-compressed', shouldCompress);
            }

            // Apply to body for robust sub-nav and mobile-menu coordination
            document.body.classList.toggle('header-scrolled', shouldCompress);

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

    static configureAppFooter(config) {
        setTimeout(() => {
            const footerLinksContainer = document.getElementById('appFooterLinks');
            if (footerLinksContainer && config.footerLinks && Array.isArray(config.footerLinks)) {
                const linksHtml = config.footerLinks.map(link => {
                    return `<a href="${link.url}" style="color: var(--text-secondary, #94a3b8); text-decoration: none; font-weight: 500; transition: color 0.2s;" onmouseover="this.style.color='var(--primary, #E8916B)'" onmouseout="this.style.color='var(--text-secondary, #94a3b8)'">${link.name}</a>`;
                }).join('<span style="color: rgba(255,255,255,0.2); margin: 0 12px;">|</span>');
                footerLinksContainer.innerHTML = linksHtml;
            }
        }, 100);
    }

    static injectFeedbackWidget(feedbackUrl) {
        if (document.getElementById('bdl-feedback-widget')) return;
        
        const widget = document.createElement('a');
        widget.id = 'bdl-feedback-widget';
        widget.href = feedbackUrl;
        widget.innerHTML = '<i class="fas fa-lightbulb"></i>';
        widget.title = 'Feedback & Feature Requests';
        
        // Inline styles to avoid CSS coupling across repos
        Object.assign(widget.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary, #E8916B)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: '0 4px 15px rgba(232, 145, 107, 0.4)',
            cursor: 'pointer',
            zIndex: '9999',
            textDecoration: 'none',
            transition: 'transform 0.2s, box-shadow 0.2s'
        });
        
        widget.onmouseover = () => {
            widget.style.transform = 'translateY(-3px)';
            widget.style.boxShadow = '0 6px 20px rgba(232, 145, 107, 0.6)';
        };
        widget.onmouseout = () => {
            widget.style.transform = 'none';
            widget.style.boxShadow = '0 4px 15px rgba(232, 145, 107, 0.4)';
        };
        
        document.body.appendChild(widget);
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
        
        if (config.feedbackUrl) {
            setTimeout(() => this.injectFeedbackWidget(config.feedbackUrl), 200);
        }

        // Debug info
        if (config.debug) {
            console.log(`Bitcoin Data Labs App Components v${this.version} initialized`, config);
        }
    }
}

// Global alias for convenience
window.BitcoinLabsApp = BitcoinLabsAppComponents;