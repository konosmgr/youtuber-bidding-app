#!/bin/bash

# Simple script to copy the wolf logo to the correct location
# This doesn't process the image, so ensure your source image is already properly processed

# Check if a source file was provided
if [ -z "$1" ]; then
  echo "Usage: ./copy-logo.sh path/to/your/processed/wolf-logo.png"
  echo "Please provide the path to your processed wolf logo image."
  exit 1
fi

SOURCE_FILE="$1"
TARGET_DIR="static/images/ui"
TARGET_FILE="$TARGET_DIR/wolf-logo.png"

# Check if the source file exists
if [ ! -f "$SOURCE_FILE" ]; then
  echo "Error: Source file '$SOURCE_FILE' not found."
  exit 1
fi

# Ensure the target directory exists
mkdir -p "$TARGET_DIR"

# Copy the file
cp "$SOURCE_FILE" "$TARGET_FILE"

# Provide feedback
if [ $? -eq 0 ]; then
  echo "Success: Logo copied to $TARGET_FILE"
  echo "You can now view the updated logo by refreshing your browser."
else
  echo "Error: Failed to copy the logo file."
  exit 1
fi 