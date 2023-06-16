import { ManifestType } from './manifest-type';

const manifestDev = (manifest: ManifestType): ManifestType => {
  manifest.permissions = [...(manifest.permissions || [])];

  manifest.host_permissions = [...(manifest.host_permissions || [])];

  return manifest;
};

export default manifestDev;
