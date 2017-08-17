# Attuale

// object ->System ->Uefi ->Fabricator ->Eggs

## Mappa attuale delle classi
class System {
*  systemErase
*  systemCopy
*  systemClean
*  systemEdit
*  systeFileIso
}

class Uefi extend System{
}

class Fabricator extend Uefi{
  homeDir
  workDirs
}

class Eggs extend Uefi{
  fstab
  hostname
  resolvConf
  interfaces
  hosts
  vmlinux
  =======
  initramfs
  eggsErase
  pxelinux
  exports
  dnsmasq
}

class Iso{
  dropIso
  isoDirs
  isoLinuxCopy
  vmlinuz
  initramfs
}
