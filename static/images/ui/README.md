# Wolf Logo Implementation

## Option 1: Manual Processing (Recommended)

1. Download the wolf logo image shared in the chat.
2. Process the image using an image editor (Photoshop, GIMP, or an online tool):
   - Remove any white space outside the circular boundary
   - Keep only the black circular background with the white wolf, mountains, trees, and stars
   - Ensure the final image maintains the circular shape
   - Save as PNG with transparency
   
3. Save the processed image as `wolf-logo.png` in this directory (`static/images/ui/`)

## Option 2: Using the Shell Script (Simplest)

If you've already processed the image or have the properly formatted logo:

```bash
# Make the script executable if needed
chmod +x scripts/copy-logo.sh

# Run the script with the path to your processed image
./scripts/copy-logo.sh path/to/your/processed/wolf-logo.png
```

## Option 3: Using the Node.js Processing Script

If you prefer automated image processing with more options:

1. Install the Sharp image processing library:
   ```
   npm install sharp
   ```

2. Run the processing script:
   ```
   node scripts/process-logo.js path/to/your/downloaded/wolf-logo.png
   ```

3. The script will automatically resize and optimize the image and save it to this directory.

## Image Requirements
- Dimensions: At least 100x100px (will be displayed at 36x36px)
- Format: PNG with transparency
- Name: wolf-logo.png

## Deployment Options

- For local development, place the image in this directory
- For production, you may want to upload the image to your S3 bucket and update the image path in the Navbar component if needed 