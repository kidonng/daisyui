# daisyUI

This is a redistribution of [daisyUI](https://github.com/saadeghi/daisyui). It is intended to be used with frameworks other than Tailwind CSS, such as [UnoCSS](https://github.com/unocss/unocss).

- Nested rules are unwrapped
- `@apply` directives are preserved
- Theme variables are comma separated (instead of space)

## Usage

Selectively import styles:

```css
@import '@kidonng/daisyui/components/unstyled/button.css';
@import '@kidonng/daisyui/components/styled/button.css';
/* Light/dark based on system color scheme */
@import '@kidonng/daisyui/themes/auto.css';
@import '@kidonng/daisyui/utilities/unstyled/button.css';
```

Import all styles:

```css
@import '@kidonng/daisyui/components/unstyled/index.css';
@import '@kidonng/daisyui/components/styled/index.css';
@import '@kidonng/daisyui/themes/index.css';
@import '@kidonng/daisyui/utilities/unstyled/index.css';
@import '@kidonng/daisyui/utilities/styled/index.css';
```

To apply a theme, specify it in the markup:

```html
<body data-theme="cupcake"></body>
```
