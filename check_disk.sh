#!/bin/bash
CURRENT=$(df $1 | grep / | awk '{ print $5}' | sed 's/%//g')
THRESHOLD=80
if [ "$CURRENT" -gt "$THRESHOLD" ] ; then
    echo "WARNING Disk space full soon "
    hostname
    df -hT -t ext4
fi
