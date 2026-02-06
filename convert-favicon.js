const sharp = require('sharp');
const fs = require('fs');

async function convertFavicon() {
  const inputFile = './public/favicon.png';
  
  if (!fs.existsSync(inputFile)) {
    console.error('Error: favicon.png not found!');
    return;
  }

  // Create a 32x32 favicon
  await sharp(inputFile)
    .resize(32, 32)
    .toFile('./public/favicon.ico');
  
  console.log('✓ favicon.ico generated successfully! 🎉');
}

convertFavicon().catch(console.error);
