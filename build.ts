import {expandGlobSync, emptyDirSync, ensureDirSync} from 'std/fs/mod.ts'
import {dirname, basename} from 'std/path/mod.ts'
import postcss from 'postcss'
import nested from 'postcss-nested'
import stripIndent from 'strip-indent'
import themes from 'daisyui/src/colors/themes'
import functions from 'daisyui/src/colors/functions'

const processor = postcss([nested])
const root = 'daisyui/src'
const stripRoot = (path: string) => path.replace(`${Deno.cwd()}/${root}/`, '')

// Utilities should go last
const dirs = ['base', 'themes', 'components', 'utilities']
const [baseDir, themesDir, ...styleDirs] = dirs

const replacePrefix = (css: string) => css.replace(/--tw-([\w-]+)/g, '--un-$1')

const writeIndex = (dir: string, file: string, append = true) =>
	Deno.writeTextFileSync(`${dir}/index.css`, `@import "./${file}";\n`, {
		append,
	})

for (const dir of dirs) {
	emptyDirSync(dir)
	writeIndex('.', `${dir}/index.css`, dir !== dirs[0])
}

for (const {path} of expandGlobSync(`${root}/${baseDir}/*.css`)) {
	const dest = stripRoot(path)
	const css = replacePrefix(Deno.readTextFileSync(path))

	console.log('Writing', dest)
	Deno.writeTextFileSync(dest, css)
	writeIndex(baseDir, basename(dest))
}

for (const {path} of expandGlobSync(
	`${root}/{${styleDirs.join(',')}}/**/*.css`,
)) {
	if (
		[
			// Does anyone actually use this?
			// See https://github.com/saadeghi/daisyui/issues/1069
			'utilities/global/fontSize.css',
			// Already comes with UnoCSS
			// Example: https://uno.antfu.me/?s=min-h-6
			'utilities/global/sizing.css',
		].some((file) => path.endsWith(file))
	)
		continue

	const dest = stripRoot(path)
	const destDir = dirname(dest)
	ensureDirSync(destDir)

	const rawCss = replacePrefix(Deno.readTextFileSync(path)).replace(
		/(hsla?\(var\([-\w]+\)) ?\//g,
		'$1,',
	)
	const {css} = processor.process(rawCss)

	console.log('Writing', dest)
	Deno.writeTextFileSync(dest, css)
	writeIndex(destDir, basename(dest))
}

const order = new Map([
	['global', 0],
	['unstyled', 1],
	['styled', 2],
])

for (const dir of styleDirs) {
	const ordered: string[] = []
	const unordered: string[] = []

	for (const {name} of Deno.readDirSync(dir)) {
		if (order.has(name)) {
			ordered[order.get(name)!] = name
		} else {
			unordered.push(name)
		}
	}

	for (const name of [...ordered.filter(Boolean), ...unordered])
		writeIndex(dir, `${name}/index.css`)
}

const auto = new Map<string, string>()
const autoCss = 'auto.css'

writeIndex(themesDir, autoCss)

for (const [selector, theme] of Object.entries(themes)) {
	const [, name] = /\[data-theme=(.+)]/.exec(selector)!
	const vars = functions.convertToHsl(theme)
	const css = stripIndent(`
		${selector} {
			${Object.entries(vars)
				// UnoCSS transforms `hsl(var(--foo))` to `hsla(var(--foo), var(--un-bar))`
				// So use command to separate values
				.map(([prop, value]) =>
					[prop, (value as string).replaceAll(' ', ', ')].join(': '),
				)
				.join(';\n\t\t\t')};
		}
	`).trim()

	const file = `${name}.css`
	const dest = `${themesDir}/${file}`

	console.log('Writing', dest)
	Deno.writeTextFileSync(dest, css)
	writeIndex(themesDir, file)

	if (name === 'dark' || name === 'light')
		auto.set(name, css.replace(selector, ':root'))
}

const autoDest = `${themesDir}/${autoCss}`
console.log('Writing', autoDest)
Deno.writeTextFileSync(
	autoDest,
	// Dark style should go after light style
	`${auto.get('light')}\n@media (prefers-color-scheme: dark) {\n${auto.get(
		'dark',
	)}\n}`,
)
