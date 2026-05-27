import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';

const jsObjectFileTemplate = `// AUTO GENERATED FILE - DO NOT EDIT

const assetData = {
[[NAMES]]
};

export function useAsset(assetName) {
  return assetData[assetName];
}

`;

const tsObjectFileTemplate = `// AUTO GENERATED FILE - DO NOT EDIT

const assetData = {
[[NAMES]]
} as const;

export type AssetName = (keyof typeof assetData);

export function useAsset(assetName: AssetName): string {
  return assetData[assetName];
}

`;

function extractName(path) {
  const parts = path.split('/');
  const fileName = parts[parts.length - 1];
  const nameWithoutExt = fileName.split('.').slice(0, -1).join('.');
  return nameWithoutExt;
}

function sanitizeName(path) {
  let result = "";

  for (const char of path) {
    if (/[a-zA-Z0-9_-]/.test(char)) {
      result += char;
    } else {
      result += '_';
    }
  }
  
  return result;
}

async function resolveAssets(src) {  
  const assets = [];
  const files = await readdir(src);

  for (const file of files) {
    const fstat = await stat(join(src, file));
    if (fstat.isDirectory()) {
      const dirSrc = join(src, file);
      const dirRAN = await resolveAssets(dirSrc);

      assets.push(...dirRAN);
      continue;
    }

    assets.push(file);
  }

  return assets;
}

async function buildObjectFile(assets, rootUrl, templateLang="js") {
  const templates = {
    js: jsObjectFileTemplate,
    ts: tsObjectFileTemplate
  };

  const fileContent = templates[templateLang].replace(
    '[[NAMES]]',
    assets.map(
      name => `  '${name}': '${rootUrl}/assets/${name}'`
    ).join(',\n')
  );

  return fileContent;
}

export async function buildAssets(assetDir, codeDir, rootUrl, templateLang="js") {
  const resolvedAssets = await resolveAssets(assetDir);
  const objectFile = await buildObjectFile(resolvedAssets, rootUrl, templateLang);
  const filePath = join(codeDir, `assets.${templateLang}`);
  
  await writeFile(filePath, objectFile);
}

