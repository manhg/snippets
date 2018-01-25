``
certbot certonly \
    --noninteractive \
    --standalone \
    --email your@example.com \
    --preferred-challenges=http \
    --http-01-port 80 \
    --cert-name exmaple
    -d domain1.example.com,domain2.example.com
```

crontab

```
MAILTO=your@domain
0 10 3 * *  certbot renew --noninteractive --post-hook "nginx -s reload"
```