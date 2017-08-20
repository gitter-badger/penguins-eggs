# eggs

Eggs is a library in development, at moment rudimentary (and needing a GUI counterpart) but it work well with Debian 8 Jessie and Debian 9 Stretch, and let You to remaster your system and, for now, give You the possibility to replicate it with remote boot.

Eggs, will be the library back  to [incubator](http://github.com/pieroproietti/incubator) the project to implement the GUI for the process of remastering your version of Linux, generate an ISO image, burn it on a DVD/install on usb key or performing remote boot from the net.

Eggs, at the moment august 17, is under construction and can have same troubles for people not in confidence with Linux system administration, but in same ways it is already usefull: imagine to install it on an lan and start to manage the computers with it, You can easily install on the system clonezilla and clone, restore and repair all Your machines.

To experiment now, give a look at the file Eggs.js and adapt the internal variables at yours needs.

## Testing Eggs

To test it, you need a functional installation of Linux Debian version 8 or 9, download eggs from github:
``` bash
 git clone https://github.com/pieroproietti/eggs
 cd eggs
 yarn
```
(give a look at Eggs.js in the src/lib folder, and run it
``` bash
 sudo yarn run dev
```
Eggs, will copy your entire fs in the directory /srv/incubator/[your distro name in my case littlebird], and will create the structure for tftp boot.

## Install nfs, tftp, apache2 and other stuffs
Eggs to boot the littlebirds, need to install apache2, dnsmasq and nfs. Other syslinux and pxelinux. Don't worry too much, is just a question to open the terminal and write the following lines:
``` bash
sudo apt-get update
sudo apt-get install apache2 dnsmasq nfs-kernel-server syslinux pxelinux
```
No need other configurations, or better, all the necessary configurations will be created from eggs.

## development
If you want the branch develop, give this command before to try:
```
 git checkout develop
```
## [history](src/lib/README.md)

For other informations, write me.

The author
piero.proietti@gmail.com
