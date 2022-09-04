export const replacePrefix = (css: string) =>
	css.replace(/--tw-([\w-]+)/g, '--un-$1')

// Space separator is replaced with comma below
// So we can only use comma instead of slash
export const replaceSlash = (css: string) =>
	css.replace(/(hsla?\(var\([-\w]+\)) ?\//g, '$1,')

export const writeIndex = (dir: string, file: string, append = true) =>
	Deno.writeTextFileSync(`${dir}/index.css`, `@import "./${file}";\n`, {
		append,
	})
