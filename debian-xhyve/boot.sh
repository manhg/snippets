#!/bin/bash
#
# Document:
#
# https://zhsj.me/blog/view/xhyve-install-debian
# https://www.freebsd.org/doc/handbook/virtualization-host-bhyve.html
# https://gist.github.com/lloeki/998675988a96ef286e0a
#
iso=debian-9.2.1-amd64-netinst.iso

if [ ! -f $iso ]; then
    wget http://ftp.jaist.ac.jp/pub/Linux/debian-cd/current/amd64/iso-cd/debian-9.2.1-amd64-netinst.iso
fi
 
if [ ! -f initrd.gz ]; then
    wget https://d-i.debian.org/daily-images/amd64/daily/netboot/debian-installer/amd64/linux
    wget https://d-i.debian.org/daily-images/amd64/daily/netboot/debian-installer/amd64/initrd.gz
fi

if [ ! -f disk.img ]; then
    echo "creating hdd"
    truncate -s 8G disk.img
fi

 
KERNEL="linux"
INITRD="initrd.gz"
CMDLINE="earlyprintk=serial console=ttyS0 acpi=off "
 
MEM="-m 512M"
PCI_DEV="-s 0:0,hostbridge -s 31,lpc"
NET="-s 2:0,virtio-net"

IMG_CD="-s 3,ahci-cd,$iso"

if [ ! $USE_CD ]; then
    KERNEL="vmlinuz"
    INITRD="initrd.img"
    CMDLINE="console=ttyS0,38400n8 acpi=off earlyprintk=serial root=/dev/vda1 "
fi

IMG_HDD="-s 4,virtio-blk,disk.img"
LPC_DEV="-l com1,stdio"
ACPI="-A"
sudo xhyve $ACPI $MEM $SMP $PCI_DEV $LPC_DEV $NET $IMG_CD $IMG_HDD -f kexec,$KERNEL,$INITRD,"$CMDLINE"