#!/bin/bash

IMG_PATH="/data/mattermost-docker/volumes/app/mattermost/data/"

# Shrink images
shrink_image() {
    find $IMG_PATH -size +500k -name "$1" \
        -exec mogrify -resize 1500x1500 -strip -quality 90 {} \;
}

shrink_image "*.jpg"
shrink_image "*.jpeg"
shrink_image "*.png"