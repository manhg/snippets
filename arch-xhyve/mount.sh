#!/bin/bash
echo "Waiting box up at SSH port..."
while ! nc -z 192.168.64.21 22; do   
  sleep 1
done

mount -t nfs -o rw,noatime,rsize=32768,wsize=32768,async 192.168.64.21:/nfs /work/nfs_arch