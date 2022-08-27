# daisyUI

This is a redistribution of [daisyUI](https://github.com/saadeghi/daisyui). It is intended to be used with frameworks other than Tailwind CSS, such as [UnoCSS](https://github.com/kidonng/unocss-preset-daisy).

- Nested rules are unwrapped
- `@apply` directives are preserved
- Theme variables are comma separated (instead of space)

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
