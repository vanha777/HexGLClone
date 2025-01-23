const uglify = require('uglify-js');
const cleancss = require('clean-css');
const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Function to create directory if it doesn't exist
function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

// Function to copy directory recursively
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Main build process
try {
    // List of directories to copy completely
    const directoriesToCopy = [
        'bkcore',
        'bkcore.coffee',
        'libs',
        'css',
        'audio',
        'textures.full',
        'geometries',
        'models',
        'sounds',
        'fonts',
        'textures.full'
    ];

    // Copy all directories
    directoriesToCopy.forEach(dir => {
        if (fs.existsSync(dir)) {
            copyDir(dir, `dist/${dir}`);
            console.log(`Copied ${dir} directory`);
        } else {
            console.log(`Warning: Directory ${dir} not found`);
        }
    });

    // Create required texture directories if they don't exist
    const requiredTexturePaths = [
        'textures.full/particles',
        'textures.full/ships/feisar',
        'textures.full/ships/feisar/booster',
        'textures.full/ships/terminator',
        'textures.full/ships/terminator/booster',
        'textures.full/tracks/cityscape',
        'textures.full/tracks/cityscape/scrapers1',
        'textures.full/tracks/cityscape/scrapers2',
        'textures.full/tracks/cityscape/start',
        'textures.full/tracks/spacescape',
        'textures.full/tracks/spacescape/scrapers1',
        'textures.full/tracks/spacescape/scrapers2',
        'textures.full/tracks/spacescape/start',
        'textures.full/bonus/base',
        'textures.full/skybox/dawnclouds',
        'textures.full/hud',
        'textures.full/shop'
    ];

    requiredTexturePaths.forEach(dir => {
        const fullPath = path.join('dist', dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`Created directory: ${fullPath}`);
        }
    });

    // List of required files that should exist in bkcore.coffee
    const requiredCoffeeFiles = [
        'controllers/TouchController.js',
        'controllers/OrientationController.js',
        'controllers/GamepadController.js',
        'Timer.js',
        'ImageData.js',
        'Utils.js'
    ];

    // Create bkcore.coffee directory if it doesn't exist
    if (!fs.existsSync('dist/bkcore.coffee')) {
        fs.mkdirSync('dist/bkcore.coffee', { recursive: true });
        fs.mkdirSync('dist/bkcore.coffee/controllers', { recursive: true });
    }

    // Create empty files for missing bkcore.coffee files
    requiredCoffeeFiles.forEach(file => {
        const destPath = path.join('dist/bkcore.coffee', file);
        ensureDirectoryExistence(destPath);
        if (!fs.existsSync(destPath)) {
            fs.writeFileSync(destPath, '// Generated empty file');
            console.log(`Created empty file: ${destPath}`);
        }
    });

    // Copy individual files
    const filesToCopy = [
        'launch.js',
        'index.html',
        'manifest.webapp',
        'favicon.png'
    ];

    filesToCopy.forEach(file => {
        if (fs.existsSync(file)) {
            fs.copyFileSync(file, `dist/${file}`);
            console.log(`Copied ${file}`);
        } else {
            console.log(`Warning: File ${file} not found`);
        }
    });

    // Create placeholder images for shop items if they don't exist
    function createPlaceholderImage(filePath) {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        
        // Draw placeholder
        ctx.fillStyle = '#3498db';
        ctx.fillRect(0, 0, 80, 80);
        
        // Save as PNG
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filePath, buffer);
    }

    // Add this after creating directories
    const shopImages = [
        'textures.full/shop/boost.png',
        'textures.full/shop/shield.png',
        'textures.full/shop/handling.png'
    ];

    shopImages.forEach(imagePath => {
        const fullPath = path.join('dist', imagePath);
        ensureDirectoryExistence(fullPath);
        if (!fs.existsSync(fullPath)) {
            createPlaceholderImage(fullPath);
            console.log(`Created placeholder image: ${fullPath}`);
        }
    });

    console.log('Build completed successfully!');
} catch (error) {
    console.error('Build failed:', error);
} 