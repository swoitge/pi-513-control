#!/bin/bash

# uv4l
sudo bash -c 'cat > /etc/apt/sources.list << EOL
deb http://raspbian.raspberrypi.org/raspbian/ buster main contrib non-free rpi
# Uncomment line below then apt-get update to enable apt-get source
#deb-src http://raspbian.raspberrypi.org/raspbian/ buster main contrib non-free rpi
deb http://www.linux-projects.org/listing/uv4l_repo/raspbian/stretch stretch main
EOL'

sudo apt-get update && sudo apt-get install uv4l uv4l-server uv4l-raspicam uv4l-raspicam-extras
sudo service uv4l_raspicam start

# npm install
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get update && sudo apt-get install -y nodejs
sudo npm install -g node-gyp

# install git
sudo apt-get update && sudo apt-get install -y git

# install control software
git config --global user.email "you@example.com"
git config --global user.name "Your Name"

# git clone https://github.com/swoitge/pi-513-control.git
#cd pi-513-control

#npm install
