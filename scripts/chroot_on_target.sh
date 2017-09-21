#!/bin/sh
./scripts/mount4chroot.sh
chroot /TARGET $1 $2 $3 $4 $5 $6 $7 $8 $9
./scripts/umount4chroot.sh
