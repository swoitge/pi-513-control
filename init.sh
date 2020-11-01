#!/bin/bash

# install git
sudo apt-get update && sudo apt-get install -y git

# npm install
cd /home/pi
curl -o nodejs.tar.gz https://nodejs.org/dist/v9.9.0/node-v9.9.0-linux-armv6l.tar.gz
tar --skip-old-files -xzf nodejs.tar.gz
sudo cp -r node-v9.9.0-linux-armv6l/* /usr/local/

# install control software
git config --global user.email "you@example.com"
git config --global user.name "Your Name"

git clone https://github.com/swoitge/pi-513-control.git
cd pi-513-control

npm install
