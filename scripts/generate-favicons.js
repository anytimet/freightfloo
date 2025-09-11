#!/usr/bin/env node

/**
 * Favicon Generator Script for FreightFloo
 * 
 * This script helps generate favicon files from your main logo.
 * 
 * Requirements:
 * 1. Place your main logo as 'logo.png' in the public folder
 * 2. Install sharp: npm install sharp
 * 3. Run: node scripts/generate-favicons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const logoPath = path.join(publicDir, 'logo.png');

// Check if logo exists
if (!fs.existsSync(logoPath)) {
  console.error('❌ logo.png not found in public folder!');
  console.log('Please place your logo.png file in the public folder first.');
  process.exit(1);
}

console.log('🎨 Generating favicon files from logo.png...');

// Favicon sizes and names
const favicons = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

// Generate favicons
async function generateFavicons() {
  try {
    for (const favicon of favicons) {
      const outputPath = path.join(publicDir, favicon.name);
      
      await sharp(logoPath)
        .resize(favicon.size, favicon.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated ${favicon.name} (${favicon.size}x${favicon.size})`);
    }

    // Generate favicon.ico (32x32)
    const icoPath = path.join(publicDir, 'favicon.ico');
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(icoPath);
    
    console.log('✅ Generated favicon.ico (32x32)');

    // Generate web app manifest
    const manifest = {
      name: 'FreightFloo',
      short_name: 'FreightFloo',
      description: 'Digital freight marketplace connecting shippers with trusted carriers',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#2563eb',
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    };

    const manifestPath = path.join(publicDir, 'site.webmanifest');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Generated site.webmanifest');

    console.log('\n🎉 All favicon files generated successfully!');
    console.log('\n📁 Files created:');
    console.log('   - favicon.ico');
    console.log('   - favicon-16x16.png');
    console.log('   - favicon-32x32.png');
    console.log('   - apple-touch-icon.png');
    console.log('   - android-chrome-192x192.png');
    console.log('   - android-chrome-512x512.png');
    console.log('   - site.webmanifest');
    
    console.log('\n🚀 Your app is now ready with proper favicons!');

  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    process.exit(1);
  }
}

generateFavicons();
