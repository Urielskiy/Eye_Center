const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Install required packages if not already installed
try {
  console.log('Installing required packages...');
  execSync('npm install sharp');
  console.log('Packages installed successfully.');
} catch (error) {
  console.error('Error installing packages:', error);
  process.exit(1);
}

// After packages are installed, we can import them
const sharp = require('sharp');

async function generateFavicon() {
  const svgPath = path.join(__dirname, '..', 'public', 'eye-favicon.svg');
  const icoPath = path.join(__dirname, '..', 'src', 'app', 'favicon.ico');
  
  try {
    // Create directory if it doesn't exist
    const dir = path.dirname(icoPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Convert SVG to ICO (multiple sizes)
    await sharp(svgPath)
      .resize(16, 16)
      .toFile(path.join(__dirname, '..', 'public', 'favicon-16x16.png'));
      
    await sharp(svgPath)
      .resize(32, 32)
      .toFile(path.join(__dirname, '..', 'public', 'favicon-32x32.png'));
      
    await sharp(svgPath)
      .resize(48, 48)
      .toFile(path.join(__dirname, '..', 'public', 'favicon-48x48.png'));
      
    // For the main favicon.ico, we'll use the 32x32 size
    await sharp(svgPath)
      .resize(32, 32)
      .toFile(path.join(__dirname, '..', 'src', 'app', 'favicon.ico'));
      
    console.log('Favicon generated successfully!');
  } catch (error) {
    console.error('Error generating favicon:', error);
    process.exit(1);
  }
}

generateFavicon();
