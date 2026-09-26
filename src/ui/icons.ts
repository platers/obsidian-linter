// icon sources

// https://lucide.dev/icons/file-cog
const lintFileSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-cog">
  <circle cx="6" cy="13" r="3"/>
  <path d="m9.7 14.4-.9-.3"/>
  <path d="m3.2 11.9-.9-.3"/>
  <path d="m4.6 16.7.3-.9"/>
  <path d="m7.6 16.7-.4-1"/>
  <path d="m4.8 10.3-.4-1"/>
  <path d="m2.3 14.6 1-.4"/>
  <path d="m8.7 11.8 1-.4"/>
  <path d="m7.4 9.3-.3.9"/>
  <path d="M14 2v6h6"/>
  <path d="M4 5.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-1.5"/>
</svg>`;

// https://lucide.dev/icons/folder-cog
const lintFolderSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-cog">
  <circle cx="18" cy="18" r="3"/>
  <path d="M10.5 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v3.5"/>
  <path d="m21.7 19.4-.9-.3"/>
  <path d="m15.2 16.9-.9-.3"/>
  <path d="m16.6 21.7.3-.9"/>
  <path d="m19.1 15.2.3-.9"/>
  <path d="m19.6 21.7-.4-1"/>
  <path d="m16.8 15.3-.4-1"/>
  <path d="m14.3 19.6 1-.4"/>
  <path d="m20.7 16.8 1-.4"/>
</svg>`;

// https://lucide.dev/icons/server-cog
const lintVaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-server-cog">
  <circle cx="12" cy="12" r="3"/><path d="M4.5 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-.5"/>
  <path d="M4.5 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-.5"/>
  <path d="M6 6h.01"/><path d="M6 18h.01"/>
  <path d="m15.7 13.4-.9-.3"/>
  <path d="m9.2 10.9-.9-.3"/>
  <path d="m10.6 15.7.3-.9"/>
  <path d="m13.6 15.7-.4-1"/>
  <path d="m10.8 9.3-.4-1"/>
  <path d="m8.3 13.6 1-.4"/>
  <path d="m14.7 10.8 1-.4"/>
  <path d="m13.4 8.3-.3.9"/>
</svg>`;

// https://lucide.dev/icons/file-x
const ignoreFileSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-x">
  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
  <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
  <path d="m14.5 12.5-5 5"/>
  <path d="m9.5 12.5 5 5"/>
</svg>`;

// https://lucide.dev/icons/folder-x
const ignoreFolderSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-x">
  <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
  <path d="m9.5 10.5 5 5"/>
  <path d="m14.5 10.5-5 5"/>
</svg>`;

// exported SVG info
export const iconInfo: Record<string, {id: string, source: string}> = {
  folder: {id: 'lint-folder', source: lintFolderSVG},
  ignoreFolder: {id: 'lint-ignore-folder', source: ignoreFolderSVG},
  file: {id: 'lint-file', source: lintFileSVG},
  ignoreFile: {id: 'lint-ignored-file', source: ignoreFileSVG},
  vault: {id: 'lint-vault', source: lintVaultSVG},
} as const;
