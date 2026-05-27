echo "Starting setup..."

if [ -z "$(which npm)" ]; then
  echo "npm is not installed."
  echo "Please install Node.js and npm and try again."
  exit 1
fi

echo "Installing dependencies in $DEV_APP..."
cd $DEV_APP
npm install
cd ..

echo "Set up complete!"
