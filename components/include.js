class BitcoinLabsComponents {
    static getBasePath() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('Bitcoin-Data-Labs')) {
            return '/Bitcoin-Data-Labs';
        }

        const script = document.currentScript || Array.from(document.getElementsByTagName('script')).reverse().find(script => script.src && script.src.includes('/components/include.js'));
        if (script && script.src) {
            try {
                const url = new URL(script.src, window.location.href);
                return url.pathname.replace(/\/components\/include\.js$/, '') || '';
            } catch (error) {
                console.warn('Bitcoin Labs include: could not derive base path from script src', error);
            }
        }

        return '';
    }

    static async loadComponent(elementId, componentPath, config = {}) {
        try {
            const basePath = this.getBasePath();
            const fullPath = `${basePath}${componentPath}`;
            console.log('Loading component from:', fullPath);

            const response = await fetch(fullPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const targetElement = document.getElementById(elementId);
            if (!targetElement) {
                throw new Error(`Element with id "${elementId}" not found`);
            }
            targetElement.innerHTML = html;
            
            if (config.isApp) {
                this.configureAppHeader(config);
            }
            
            if (elementId === 'header') {
                this.initHeaderBehavior(config);
            }
        } catch (error) {
            console.error(`Error loading component from ${componentPath}:`, error);
            // Fallback content for header
            if (elementId === 'header') {
                this.loadFallbackHeader(elementId, config);
            }
        }
    }

    static loadFallbackHeader(elementId, config) {
        const basePath = this.getBasePath();
        document.getElementById(elementId).innerHTML = `
            <div class="top-bar">
                <div class="container top-container">
                    <div class="logos-container">
                        ${config.isApp ? `
                            <div class="app-logo">
                                <a href="${config.appHomeUrl || '#'}" id="appHomeLink">
                                    <span class="app-name" id="currentAppName">${config.appName || 'App'}</span>
                                </a>
                            </div>
                            <div class="divider"></div>
                        ` : ''}
                        <div class="parent-logo">
                            <a href="${basePath}/">
                                <img src="${basePath}/logo-light.png" alt="Bitcoin Data Labs" class="parent-logo-img">
                            </a>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    static configureAppHeader(config) {
        const appNameElement = document.getElementById('currentAppName');
        const appHomeLink = document.getElementById('appHomeLink');
        
        if (appNameElement && config.appName) {
            appNameElement.textContent = config.appName;
        }
        
        if (appHomeLink && config.appHomeUrl) {
            appHomeLink.href = config.appHomeUrl;
        }
    }

    static initHeaderBehavior(config = {}) {
        const header = document.getElementById('header');
        if (!header) return;

        const headerElement = header.firstElementChild;
        let lastScroll = 0;
        let ticking = false;

        const updateHeader = () => {
            const currentScroll = window.pageYOffset;
            
            // More subtle compression threshold with smoother transition
            if (currentScroll > 30) {
                headerElement.classList.add('header-compressed');
            } else {
                headerElement.classList.remove('header-compressed');
            }
            
            lastScroll = currentScroll;
            ticking = false;
        };

        // Use requestAnimationFrame for smooth performance
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateHeader();
                });
                ticking = true;
            }
        });
    }

    static init(config = {}) {
        const basePath = this.getBasePath();
        this.loadComponent('header', config.isApp ? '/components/app-header.html' : '/components/header.html', config);
        this.loadComponent('footer', '/components/footer.html');
    }
}