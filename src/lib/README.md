// Attuale
// object ->System ->Uefi ->Fabricator ->Eggs


Egg.erase <- systemErase
Egg.fstab <- Eggs.fstab


class Egg extend object
  homeDir
  workDirs
}
class System extend Egg {
  systemErase
  systemCopy
  systemClean
  systemEdit
  systeFileIso
}

class Config extend Egg{
  fstab
  hostname
  resolvConf
  interfaces
  hosts
  vmlinux
  initramfs
}

class Incubator extend Egg{
  eggsErase
  pxelinux
  exports
  dnsmasq
}

class Iso {
  dropIso
  isoDirs
  isoLinuxCopy
  //kernelCopy
    vmlinuz
    initramfs


}
