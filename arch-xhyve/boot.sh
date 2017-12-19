#!/bin/bash
#
# Document:
#
# https://www.freebsd.org/doc/handbook/virtualization-host-bhyve.html
# http://blog.dunkelstern.de/2016/01/17/xhyve-a-quick-how-to/
# https://gist.github.com/lloeki/ca1d508cbc7692dfba52
# https://gist.github.com/lloeki/998675988a96ef286e0a
#

if [ $USE_CD ]; then
    iso=archlinux-2017.11.01-x86_64.iso

    if [ ! -f $iso ]; then
        wget http://ftp.nara.wide.ad.jp/pub/Linux/archlinux/iso/2017.11.01/archlinux-2017.11.01-x86_64.iso
    fi
     
    if [ ! -f archiso.img ]; then
        echo "fixing disk"
        dd if=/dev/zero bs=2k count=1 of=tmp.iso
        dd if=$iso bs=2k skip=1 >> tmp.iso
         
        echo "mounting disk"
        diskinfo=$(hdiutil attach tmp.iso)
        disk=$(echo "$diskinfo" |  cut -d' ' -f1)
        mnt=$(echo "$diskinfo" | perl -ne '/(\/Volumes.*)/ and print $1')
        echo "mounted as $disk at $mnt"
         
        echo "extracting kernel"
        ls -l "$mnt/arch/boot/x86_64"
        cp "$mnt/arch/boot/x86_64/vmlinuz" .
        cp "$mnt/arch/boot/x86_64/archiso.img" .
        diskutil eject "$disk"
        rm tmp.iso
    fi

    if [ ! -f disk.img ]; then
        echo "creating hdd"
        truncate -s 8G disk.img
    fi
    IMG_CD="-s 3,ahci-cd,$iso"
fi
 
UUID=" -U 10000000-0000-0000-0000-000000000000"
MEM="-m 512M"
PCI_DEV="-s 0:0,hostbridge -s 31,lpc"
NET="-s 2:0,virtio-net"
KERNEL="vmlinuz-linux"
INITRD="initramfs-linux.img"
CMDLINE="console=ttyS0 acpi=off earlyprintk=serial root=/dev/vda1 console=ttyS0,38400n8"
IMG_HDD="-s 4,virtio-blk,disk.img"
LPC_DEV="-l com1,stdio"
ACPI="-A"
sudo xhyve $UUID $ACPI $MEM $SMP $PCI_DEV $LPC_DEV $NET $IMG_CD $IMG_HDD -f kexec,$KERNEL,$INITRD,"$CMDLINE"