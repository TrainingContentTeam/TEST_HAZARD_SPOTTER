# Spot the Hazard

Interactive firefighter safety activity for iframe embedding in Articulate Rise.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

On completion of all required hotspots, the app sends:

```js
window.parent.postMessage({ type: 'complete' }, '*');
```
