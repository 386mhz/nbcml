import { App } from './app.js';
import { Navigation } from './navigation.js';
import { Auth } from './auth.js';
import { ResultsRenderer } from './renderers/results.js';
import { CONFIG } from './config.js';

// Expose global functions for HTML event handlers
window.showSection = Navigation.showSection;
window.showAdminLogin = Auth.showAdminLogin;
window.closeAdminLogin = Auth.closeAdminLogin;
window.handleEnterKey = Auth.handleEnterKey;
window.checkAdminPassword = Auth.checkAdminPassword;
window.scrollResults = function(direction) {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    const maxScroll = Math.max(0, container.scrollWidth - container.parentElement.clientWidth);
    if (direction === 'left') {
        CONFIG.scrollPosition = Math.max(0, CONFIG.scrollPosition - CONFIG.scrollStep);
    } else {
        CONFIG.scrollPosition = Math.min(maxScroll, CONFIG.scrollPosition + CONFIG.scrollStep);
    }
    ResultsRenderer.updateScrollPosition();
};

document.addEventListener('DOMContentLoaded', () => App.init());

// ...add the DOMContentLoaded logic for playoffs/preseason toggles here...