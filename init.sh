#!/bin/bash

# uv4l
sudo bash -c 'cat > /etc/apt/sources.list << EOL
deb http://raspbian.raspberrypi.org/raspbian/ buster main contrib non-free rpi
# Uncomment line below then apt-get update to enable apt-get source
#deb-src http://raspbian.raspberrypi.org/raspbian/ buster main contrib non-free rpi
deb [trusted=yes] http://www.linux-projects.org/listing/uv4l_repo/raspbian/stretch stretch main
EOL'

sudo apt-get update && sudo apt-get install -y uv4l uv4l-server uv4l-raspicam uv4l-raspicam-extras

sudo service uv4l_raspicam stop

cat > /etc/uv4l/uv4l-raspicam.conf << EOL
driver = raspicam
auto-video_nr = yes
#only change: framebuffer was 4
frame-buffers = 1
encoding = mjpeg
framerate = 30
video-denoise = no
nopreview = no
fullscreen = no
preview = 480
preview = 240
preview = 320
preview = 240
server-option = --webrtc-max-playout-delay=34
EOL

# restart
sudo service uv4l_raspicam start

# pi GPIO
sudo apt-get update && sudo apt-get install -y pigpio

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
