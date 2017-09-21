#!/bin/sh
./scripts/disk_prepare.sh /dev/sda
./scripts/disk_get_size.sh /dev/sda 68719
./scripts/disk_prepare_partition_boot.sh /dev/sda
./scripts/disk_prepare_partition_lvm.sh /dev/sda 68719
./scripts/disk_prepare_pve.sh /dev/sda
mkfs -t ext4 /dev/pve/root
mkfs -t fat /dev/sda1
mkfs -t ext4 /dev/pve/data
mkswap /dev/pve/swap
sleep 1
mkdir /TARGET/
sleep 1
mount /dev/pve/root /TARGET
mkdir -p /TARGET/boot
mkdir -p /TARGET/var/lib/vz
mount /dev/sda1 /TARGET/boot
mount /dev/pve/data /TARGET/var/lib/vz
echo "rsync in corso..."
rsync -a / /TARGET --exclude-from ./scripts/excludes.list
#mkdir -p /TARGET/{sys,proc,dev,run,mnt,media/cdrom,home}
echo "rsync finito..."
rm -rf /TARGET/root/.ssh
rm -rf /TARGET/etc/pve
mkdir /TARGET/etc/pve
mount -o bind /proc /TARGET/proc
mount -o bind /dev /TARGET/dev
mount -o bind /sys /TARGET/sys
mount -o bind /run /TARGET/run
echo "creazione fstab..."
rm -rf /TARGET/etc/fstab
cat > /TARGET/etc/fstab <<FOO
# created by installer.sh
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
/dev/pve/root / ext4 relatime,errors=remount-ro 0 1
/dev/sda1 /boot vfat relatime 0 0
/dev/pve/data /var/lib/vz ext4 relatime 0 0
/dev/pve/swap none swap sw 0 0
FOO
echo "mkinitramfs -k -o /tmp/initramfs-$(uname -r)"
chroot /TARGET mkinitramfs -k -o /tmp/initramfs-$(uname -r)
cp /TARGET/tmp/initramfs-$(uname -r) /TARGET/boot
chroot /TARGET grub-install /dev/sda
chroot /TARGET update-grub
umount /TARGET/proc
sleep 1
umount /TARGET/dev
sleep 1
umount /TARGET/sys
sleep 1
umount /TARGET/run
sleep 1
umount /TARGET/boot
sleep 1
umount /TARGET/var/lib/vz
sleep 1
umount /TARGET
sleep 1
