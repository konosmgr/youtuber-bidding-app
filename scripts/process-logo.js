// Script to process a logo image to remove white space outside the circular boundary
// Requires the 'sharp' image processing library
// Install with: npm install sharp

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Paths
const sourceImagePath = process.argv[2] || './source-logo.png';
const outputImagePath = './static/images/ui/wolf-logo.png';

// Ensure the output directory exists
const outputDir = path.dirname(outputImagePath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log(`Processing image: ${sourceImagePath}`);
console.log(`Saving to: ${outputImagePath}`);

// Process the image
sharp(sourceImagePath)
  // Extract alpha channel from any white background and create transparency
  .toFormat('png')
  // Resize if needed - adjust dimensions as appropriate
  .resize(100, 100, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  })
  .toFile(outputImagePath)
  .then(() => {
    console.log('Logo processed successfully!');
  })
  .catch(err => {
    console.error('Error processing image:', err);
  });

console.log('To run this script:');
console.log('1. Install sharp: npm install sharp');
console.log('2. Run: node scripts/process-logo.js path/to/your/wolf-logo.png'); 