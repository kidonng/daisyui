# daisyUI

This is a redistribution of [daisyUI](https://github.com/saadeghi/daisyui). It is intended to be used with frameworks other than Tailwind CSS, such as [UnoCSS](https://github.com/kidonng/unocss-preset-daisy).

- [Nested rules are unwrapped](https://github.com/kidonng/daisyui/blob/5c8e03665b59dcd2646bb284f6639d240a066c13/build.ts#L9)
- `@apply` directives are preserved (to be processed by [@unocss/transformer-directives](https://github.com/unocss/unocss/tree/main/packages/transformer-directives))
- [Theme](https://github.com/kidonng/daisyui/blob/5c8e03665b59dcd2646bb284f6639d240a066c13/build.ts#L75-L79) and [`hsla()`](https://github.com/kidonng/daisyui/blob/5c8e03665b59dcd2646bb284f6639d240a066c13/build.ts#L34) variables are comma separated (instead of space)
- [`--tw-*-` variables are renamed to `--un-*`](https://github.com/kidonng/daisyui/blob/5c8e03665b59dcd2646bb284f6639d240a066c13/build.ts#L33)

## Installation

```sh
npm installl @kidonng/daisyui
```

## Usage

Import all styles:

```css
@import '@kidonng/daisyui/index.css';

/* Equivalent */
@import '@kidonng/daisyui/components/index.css';
@import '@kidonng/daisyui/themes/index.css';
@import '@kidonng/daisyui/utilities/index.css';

/* Equivalent */
@import '@kidonng/daisyui/components/unstyled/index.css';
@import '@kidonng/daisyui/components/styled/index.css';
@import '@kidonng/daisyui/themes/index.css';
@import '@kidonng/daisyui/utilities/unstyled/index.css';
@import '@kidonng/daisyui/utilities/styled/index.css';
```

Selectively import styles:

```css
@import '@kidonng/daisyui/components/unstyled/button.css';
@import '@kidonng/daisyui/components/styled/button.css';

/* Light/dark theme based on system color scheme */
@import '@kidonng/daisyui/themes/auto.css';

/* Utilities should go last */
@import '@kidonng/daisyui/utilities/unstyled/button.css';
```

To apply a theme, specify it in the markup:

```html
<body data-theme="cupcake"></body>
```
