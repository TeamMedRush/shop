// AUTO GENERATED FILE - DO NOT EDIT

const assetData = {
  'logo.png': '/assets/logo.png'
} as const;

export type AssetName = (keyof typeof assetData);

export function useAsset(assetName: AssetName): string {
  return assetData[assetName];
}

