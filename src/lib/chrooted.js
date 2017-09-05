/* chrooted */
"use strict";

import { getAll } from "./passwd.js";

let chrooted = function() {};

chrooted.prototype.show = function() {
  console.log("chrooted.show()");
  getAll(function(users) {
    users.forEach(function(user) {
      console.log(`username :${user.username}`);
      console.log(`password: ${user.password}`);
      console.log(`userId: ${user.userId}`);
      console.log(`groupId: ${user.groupId}`);
      console.log(`name: ${user.name}`);
      console.log(`homedir: ${user.homedir}`);
      console.log(`shell: ${user.shell}`);
    });
  });
};

export default new chrooted();

/*



tempInstallerCreate(){
let file = `${this.fsDir}/bin/tempinstaller`;
let text = `
#!/bin/bash
USERS=\$(getent passwd | tr ":" " " | awk "\\\$3 >= \$(grep UID_MIN /etc/login.defs | cut -d " " -f 2) { print \\\$1 }"|sort)
for name in \$USERS; do
if [ \$name != "nobody" ]
then
  userdel -f -r \$name
fi
done
sed -i '/$CLIENT_USERNAME/d' /etc/sudoers
groupadd -g 1000 $CLIENT_USERNAME
useradd -u 1000 -g 1000 -c "$CLIENT_USERFULLNAME,,," -G $DEFAULTGROUPS -s /bin/bash -m $CLIENT_USERNAME
echo -e "$CLIENT_PASSWORD\n$CLIENT_PASSWORD\n" | passwd $CLIENT_USERNAME
# read -p "A volte, qui occorre un controllo..."
adduser $CLIENT_USERNAME adm
adduser $CLIENT_USERNAME cdrom
adduser $CLIENT_USERNAME sudo
adduser $CLIENT_USERNAME dip
adduser $CLIENT_USERNAME plugdev
adduser $CLIENT_USERNAME lpadmin
adduser $CLIENT_USERNAME sambashare

dpkg-divert --remove --rename --quiet /usr/lib/update-notifier/apt-check
dpkg-divert --remove --rename --quiet /usr/sbin/update-initramfs
dpkg-divert --remove --rename --quiet /usr/sbin/anacron
sed 's/MODULES=most/MODULES=netboot/g' /etc/initramfs-tools/initramfs.conf > /tmp/a && mv /tmp/a /etc/initramfs-tools/initramfs.conf
sed 's/BOOT=local/BOOT=nfs/g' /etc/initramfs-tools/initramfs.conf > /tmp/a && mv /tmp/a /etc/initramfs-tools/initramfs.conf
mkinitramfs -o /tmp/initrd.img-$KERNEL
shadowconfig on
rm /root/.ssh -f -r
`;

utils.bashwrite(file, text);
}

tempinstallerExecute(){
  mount -o bind /proc /srv/eggs/littlebird/proc
  mount -o bind /dev /srv/eggs/littlebird/dev
  mount -o bind /sys /srv/eggs/littlebird/sys

  chmod 755 /srv/eggs/littlebird/bin/tempinstallerscript
  chroot /srv/eggs/littlebird bin/tempinstallerscript
  #rm /srv/eggs/littlebird/bin/tempinstallerscript
  rm /srv/eggs/littlebird/bin/tempass

  sleep 1
  umount /srv/eggs/littlebird/proc
  sleep 1
  umount /srv/eggs/littlebird/dev
  sleep 1
  umount /srv/eggs/littlebird/sys
  sleep 1

}


*/
