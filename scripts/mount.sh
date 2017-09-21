#!/bin/sh
mkdir /TARGET/
sleep 1
mount /dev/pve/root /TARGET
mkdir -p /TARGET/boot
mkdir -p /TARGET/var/lib/vz
mount /dev/sda1 /TARGET/boot
mount /dev/pve/data /TARGET/var/lib/vz
