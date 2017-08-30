# tux-eggs (Tux's eggs)

tux-eggs is a console utility in development, at moment rudimentary (and needing a GUI counterpart) but it work well with Debian 8 Jessie and Debian 9 Stretch, and let You to remaster your system and, for now, give You the possibility to replicate it with remote boot.

tux-eggs, will be the library back  to [incubator](http://github.com/pieroproietti/incubator) the project to implement the GUI for the process of remastering your version of Linux, generate an ISO image, burn it on a DVD/install on usb key or performing remote boot from the net.

tux-eggs, at the moment august 30, is under construction and can have again same troubles for people not in confidence with Linux system administration, but in same ways it is already usefull: imagine to install it on an lan and start to manage the computers with it, You can easily install on the system clonezilla and clone, restore and repair all Your machines.

To experiment now, give a look at the file Eggs.js and try to use it.

## Testing tux-eggs

To test it, you need a functional installation of Linux Debian version 8 or 9, download eggs from github:
``` bash
 git clone https://github.com/pieroproietti/tux-eggs
 cd tux-eggs
 yarn
```
(give a look at tux-eggs.js in the src/lib folder, and run it
``` bash
 sudo yarn start
```
tux-eggs, will copy your entire fs in the directory /srv/incubator/[your distro name]
 default=littlebird, will create the structure for tftp boot and nfs.

## Build tux-eggs
```
yarn build
```

## Compiling tux-eggs (with nexe)

Install nexe, the version '''2.0.0-beta.7''', please:
```
sudo npm i nexe@2.0.0-beta.7 -g
cd tux-eggs/
nexe -i build/tux-eggs.js -o bin/tux-eggs
```

## Usage
Installation of netboot stuffs
```
sudo node tux-eggs netboot install
```
Creation of a remote distro
```
sudo node tux-eggs create netboot --distroname littlebird
```
Starting netboot boot

```
sudo node tux-eggs start
```

No need other configurations, or better, all the necessary configurations will be created from tux-eggs.

## development
If you want the branch develop, give this command before to try:
```
 git clone http://github.com/pieroproietti/tux-eggs
 cd tux-eggs
 git checkout develop

 yarn

 sudo yarn netboot install
 sudo yarn create
```
## [version](src/lib/README.md)
* master at V.0.3.x

## informations
For other informations, write me.

The author
piero.proietti@gmail.com
