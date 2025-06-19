class SecurityMonitor {
    static checkHSTS() {
        fetch(window.location.href)
            .then(response => {
                const hstsHeader = response.headers.get('Strict-Transport-Security');
                console.log('HSTS Header:', hstsHeader);
                
                // Check HSTS implementation
                if (!hstsHeader) {
                    console.error('HSTS header not found');
                    return;
                }

                const hasIncludeSubDomains = hstsHeader.includes('includeSubDomains');
                const hasPreload = hstsHeader.includes('preload');
                const maxAge = hstsHeader.match(/max-age=(\d+)/);

                console.table({
                    'Max Age': maxAge ? maxAge[1] : 'Not set',
                    'Include SubDomains': hasIncludeSubDomains ? 'Yes' : 'No',
                    'Preload': hasPreload ? 'Yes' : 'No'
                });
            })
            .catch(error => console.error('HSTS Check Failed:', error));
    }
}

// Run check when page loads
document.addEventListener('DOMContentLoaded', SecurityMonitor.checkHSTS);