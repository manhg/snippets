#!/bin/bash
CURRENT=$(df $1 | grep / | awk '{ print $5}' | sed 's/%//g')
ALERT=80
df -H | grep -vE '^Filesystem|tmpfs|cdrom' | awk '{ print $5 " " $1 }' | while read output;
do
  #echo $output
  usep=$(echo "$output" | awk '{ print $1}' | cut -d'%' -f1  )
  partition=$(echo "$output" | awk '{ print $2 }' )
  if [ $usep -ge $ALERT ]; then
      echo "WARNING Disk space full soon $(hostname) \"$partition ($usep%)\" "
  fi
done
