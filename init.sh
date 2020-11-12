#!/bin/bash

# install git
sudo apt-get update && sudo apt-get install -y git

# uv4l
sudo cat > /etc/apt/sources.list << EOL
deb http://raspbian.raspberrypi.org/raspbian/ buster main contrib non-free rpi
# Uncomment line below then 'apt-get update' to enable 'apt-get source'
#deb-src http://raspbian.raspberrypi.org/raspbian/ buster main contrib non-free rpi
deb http://www.linux-projects.org/listing/uv4l_repo/raspbian/stretch stretch main
EOL

sudo apt-get update && sudo apt-get install uv4l uv4l-server uv4l-raspicam uv4l-raspicam-extras
sudo service uv4l_raspicam start


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
