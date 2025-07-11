#!/bin/bash

# Update package lists
sudo apt-get update

# Install Node.js and npm (required for Lighthouse CI)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js and npm installation
node --version
npm --version

# Navigate to workspace
cd /mnt/persist/workspace

# Install dependencies
npm install

# Install a simple HTTP server for serving static files
npm install -g http-server

# Add npm global bin to PATH
echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> $HOME/.profile
source $HOME/.profile

# Install Google Chrome for Lighthouse (required for CI tests)
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable

# Verify Chrome installation
google-chrome --version

# Create a simple npm start script since it's referenced in lighthouserc.json
# but not defined in package.json
cat > package.json << 'EOF'
{
  "scripts": {
    "start": "http-server -p 8080 -c-1"
  },
  "devDependencies": {
    "@lhci/cli": "^0.15.0"
  }
}
EOF

echo "Setup completed successfully!"