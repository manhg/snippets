* get guest ip
* mount on host:

```
mount -t nfs -o rw,noatime,rsize=32768,wsize=32768,proto=udp,async 192.168.64.2:/nfs /work/nfs
```