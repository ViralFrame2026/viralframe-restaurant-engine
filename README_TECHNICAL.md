# Technical README

## Install

```powershell
npm install
```

## Commands

```powershell
npm run dev
npm run preview
npm run sync
npm run build
npm run validate
npm run template
npm run smoke
```

## Notes

- No React, Vue, Next, or bundler.
- The site is still deployable as plain static files.
- `sync-client-assets.mjs` resolves `template`, language pack, and client config before writing static output.
- `site-config.js` remains compatible with V1-style client edits.
