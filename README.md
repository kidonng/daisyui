# daisyUI

This is a redistribution of [daisyUI](https://github.com/saadeghi/daisyui). It is intended to be used with [UnoCSS](https://github.com/kidonng/unocss-preset-daisy).

- [Nested rules are unwrapped](https://github.com/kidonng/daisyui/blob/5c8e03665b59dcd2646bb284f6639d240a066c13/build.ts#L9)
- `@apply` directives are preserved (to be processed by [@unocss/transformer-directives](https://github.com/unocss/unocss/tree/main/packages/transformer-directives))
- [Theme](https://github.com/kidonng/daisyui/blob/5c8e03665b59dcd2646bb284f6639d240a066c13/build.ts#L75-L79) and [`hsla()`](https://github.com/kidonng/daisyui/blob/5c8e03665b59dcd2646bb284f6639d240a066c13/build.ts#L34) variables are comma separated (instead of space)
- [`--tw-*-` variables are renamed to `--un-*`](https://github.com/kidonng/daisyui/blob/5c8e03665b59dcd2646bb284f6639d240a066c13/build.ts#L33)

## Installation

```sh
npm installl @kidonng/daisyui
```

## Usage

The easiest way to use this package is to import all the styles:

```css
@import '@kidonng/daisyui/index.css';
```

If you want to selectively import them, remember to always import `base`, which is just a few rules anyway:

```css
@import '@kidonng/daisyui/base/index.css';
```

## Components

`styled` components should be imported after `unstyled` components.

```css
/* Import all components */
@import '@kidonng/daisyui/components/index.css';

/* Entrypoints */
@import '@kidonng/daisyui/components/unstyled/index.css';
@import '@kidonng/daisyui/components/styled/index.css';

/* à la carte */
@import '@kidonng/daisyui/components/unstyled/button.css';
@import '@kidonng/daisyui/components/styled/button.css';
```

### Utilities

Utility styles should be imported after component styles in order to take effect.

Same as components, `styled` utilities should be imported after `unstyled` utilities.

```css
/* Import all utilities */
@import '@kidonng/daisyui/utilities/index.css';

/* Entrypoints */
@import '@kidonng/daisyui/utilities/global/index.css';
@import '@kidonng/daisyui/utilities/unstyled/index.css';
@import '@kidonng/daisyui/utilities/styled/index.css';

/* à la carte */
@import '@kidonng/daisyui/utilities/unstyled/button.css';
@import '@kidonng/daisyui/utilities/styled/button.css';
```

### Themes

Unlike [`themes.css`](https://unpkg.com/browse/daisyui@2.24.0/dist/themes.css) in official `daisyui` package, this distribution split each theme into individual files.

```css
/* Import all themes */
@import '@kidonng/daisyui/themes/index.css';

/* à la carte */
@import '@kidonng/daisyui/themes/cupcake.css';
@import '@kidonng/daisyui/themes/lemonade.css';

/* Auto theme (uses light or dark theme based on `prefers-color-scheme`) */
@import '@kidonng/daisyui/themes/auto.css';
```

To apply a theme other than `auto`, use `[data-theme]` attribute:

```html
<body data-theme="cupcake"></body>
```

### Full build

A single file build `full.css` (and `full.min.css`) is available if you want to [use the runtime version of UnoCSS](https://github.com//unocss/unocss/issues/1470#issuecomment-1228071668).
