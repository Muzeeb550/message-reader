const sharp = require('sharp');
const fs = require('fs');

const sizes = [192, 512];

async function generateIcons() {
  const inputFile = './public/favicon.png';
  
  if (!fs.existsSync(inputFile)) {
    console.error('Error: favicon.png not found in public folder!');
    return;
  }

  for (const size of sizes) {
    await sharp(inputFile)
      .resize(size, size)
      .toFile(`./public/icon-${size}x${size}.png`);
    console.log(`✓ Generated icon-${size}x${size}.png`);
  }
  
  console.log('All icons generated successfully! 🎉');
}

generateIcons().catch(console.error);
