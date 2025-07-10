// Authentication module
import { CONFIG, AppState } from './config.js';
import { Navigation } from './navigation.js';

export const Auth = {
    showAdminLogin() {
        document.getElementById('adminLogin').classList.add('show');
    },
    closeAdminLogin() {
        document.getElementById('adminLogin').classList.remove('show');
        document.getElementById('adminPassword').value = '';
    },
    handleEnterKey(event) {
        if (event.key === 'Enter') {
            Auth.checkAdminPassword();
        }
    },
    checkAdminPassword() {
        const enteredPassword = document.getElementById('adminPassword').value;
        if (enteredPassword === CONFIG.adminPassword) {
            AppState.isAdminLoggedIn = true;
            document.getElementById('adminTab').style.display = 'block';
            Auth.closeAdminLogin();
            Navigation.showSection('admin');
            alert('Welcome, Administrator!');
        } else {
            alert('Incorrect password. Access denied.');
            document.getElementById('adminPassword').value = '';
        }
    }
};