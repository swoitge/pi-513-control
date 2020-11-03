rem D:\programme\ffnpeg-4.3.1\bin\ffmpeg -f dshow -i video="USB2.0 Camera" -map 0:0 -s 160x90 -c:v libvpx -header webm.hdr -f webm_chunk chunk_%%d.chk
D:\programme\ffnpeg-4.3.1\bin\ffmpeg -f dshow -i video="USB2.0 Camera" -map 0:0 -s 160x90 -c:v libx264 output.mp4
