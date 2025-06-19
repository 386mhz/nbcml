document.addEventListener('securitypolicyviolation', (e) => {
    console.log('CSP violation:', {
        'violatedDirective': e.violatedDirective,
        'blockedURI': e.blockedURI,
        'sourceFile': e.sourceFile
    });
});