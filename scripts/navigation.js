// Navigation module
import { AppState } from './config.js';
import { Auth } from './auth.js';

export const Navigation = {
    showSection(sectionId) {
        if (sectionId === 'admin' && !AppState.isAdminLoggedIn) {
            Auth.showAdminLogin();
            return;
        }
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`[onclick="showSection('${sectionId}')"]`) ||
            document.getElementById(`${sectionId}Tab`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        AppState.currentSection = sectionId;
    }
};