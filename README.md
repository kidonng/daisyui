# daisyUI

> A [UnoCSS](https://github.com/unocss/unocss)-compatible redistribution of [daisyUI](https://github.com/saadeghi/daisyui)

> **Note**: this package is supposed to be used with [unocss-preset-daisy](https://github.com/kidonng/unocss-preset-daisy).

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

To only import what you need, always import `base` first:

```css
@import '@kidonng/daisyui/base/index.css';
/* Other imports */
```

Read on to see how to import components, utilities and themes.

### Components

```css
/* Import all components */
@import '@kidonng/daisyui/components/index.css';

/* Import all unstyled & styled components (same as above) */
@import '@kidonng/daisyui/components/unstyled/index.css';
@import '@kidonng/daisyui/components/styled/index.css';

/* Import components one by one */
@import '@kidonng/daisyui/components/unstyled/button.css';
/* `styled` components should be imported after `unstyled` components */
@import '@kidonng/daisyui/components/styled/button.css';
```

### Utilities

Utility styles should be imported after component styles.

```css
/* Import all utilities */
@import '@kidonng/daisyui/utilities/index.css';

/* Import global, unstyled & styled utilties (same as above) */
@import '@kidonng/daisyui/utilities/global/index.css';
@import '@kidonng/daisyui/utilities/unstyled/index.css';
@import '@kidonng/daisyui/utilities/styled/index.css';

/* Import utility one by one */
@import '@kidonng/daisyui/utilities/unstyled/button.css';
/* `styled` utilities should be imported after `unstyled` utilities */
@import '@kidonng/daisyui/utilities/styled/button.css';
```

### Themes

```css
/* Import all themes */
@import '@kidonng/daisyui/themes/index.css';

/* Import themes one by one */
@import '@kidonng/daisyui/themes/cupcake.css';
@import '@kidonng/daisyui/themes/lemonade.css';

/* Import auto theme (uses light or dark theme based on `prefers-color-scheme`) */
@import '@kidonng/daisyui/themes/auto.css';
```

Refer to [daisyUI documentation](https://daisyui.com/docs/themes/) for the list of themes.

To use a theme other than `auto`, you need to also specify `[data-theme]` attribute in HTML:

```html
<body data-theme="cupcake"></body>
```

### Single file build

A single file build `full.css` (and `full.min.css`) is available if you want to [use the runtime version of UnoCSS](https://github.com//unocss/unocss/issues/1470#issuecomment-1228071668).
