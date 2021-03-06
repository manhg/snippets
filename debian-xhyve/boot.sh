#!/bin/bash
#
# Document:
#
# https://zhsj.me/blog/view/xhyve-install-debian
# https://www.freebsd.org/doc/handbook/virtualization-host-bhyve.html
# https://gist.github.com/lloeki/998675988a96ef286e0a
#

MEM="-m 1024M"
CPU="-c 1"
PCI_DEV="-s 0:0,hostbridge -s 31,lpc"
NET="-s 2:0,virtio-net"

if [ $USE_CD ]; then
    iso=debian-9.3.0-amd64-netinst.iso

    if [ ! -f $iso ]; then
        wget http://ftp.jaist.ac.jp/pub/Linux/debian-cd/current/amd64/iso-cd/$iso
    fi

    if [ ! -f initrd.gz ]; then
        wget https://d-i.debian.org/daily-images/amd64/daily/netboot/debian-installer/amd64/linux
        wget https://d-i.debian.org/daily-images/amd64/daily/netboot/debian-installer/amd64/initrd.gz
    fi

    if [ ! -f disk.img ]; then
        echo "creating hdd"
        truncate -s 25G disk.img
    fi


    KERNEL="linux"
    INITRD="initrd.gz"
    CMDLINE="earlyprintk=serial console=ttyS0 acpi=off "
    IMG_CD="-s 3,ahci-cd,$iso"
else
    KERNEL="vmlinuz"
    INITRD="initrd.img"
    CMDLINE="console=ttyS0,38400n8 acpi=off earlyprintk=serial root=/dev/vda1 "
fi
UUID=" -U 90000000-0000-0000-0000-000000000000"
LPC_DEV="-l com1,stdio"

IMG_HDD="-s 4,virtio-blk,disk.img"
# add disk you want here
# IMG_HDD="$IMG_HDD -s 5,virtio-blk,other.img"
ACPI="-A"
sudo /usr/local/bin/xhyve $CPU -w $UUID $ACPI $MEM $SMP $PCI_DEV $LPC_DEV $NET $IMG_CD $IMG_HDD -f kexec,$KERNEL,$INITRD,"$CMDLINE"