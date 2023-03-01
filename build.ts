import {readFileSync, writeFileSync, readdirSync} from 'node:fs'
import {dirname, basename} from 'node:path'
import {globbySync} from 'globby'
import {emptyDirSync, ensureDirSync} from 'fs-extra'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import nested from 'postcss-nested'
import stripIndent from 'strip-indent'
import themes from 'daisyui/src/colors/themes.js'
import functions from 'daisyui/src/colors/functions.js'
import {replacePrefix, replaceSlash, writeIndex} from './utils.js'

const processor = postcss.default([autoprefixer, nested])

const root = 'node_modules/daisyui-src/src'
const stripRoot = (path: string) => path.replace(`${root}/`, '')

// Utilities should go last
const dirs = ['base', 'themes', 'components', 'utilities'] as const
const [baseDir, themesDir, ...styleDirs] = dirs

/* Root index */
for (const dir of dirs) {
	emptyDirSync(dir)
	writeIndex('.', `${dir}/index.css`, dir !== dirs[0])
}

/* `base` */
for (const path of globbySync(`${root}/${baseDir}/*.css`)) {
	const dest = stripRoot(path)
	const css = replaceSlash(replacePrefix(readFileSync(path, 'utf8')))

	console.log('Writing', dest)
	writeFileSync(dest, css)
	writeIndex(baseDir, basename(dest))
}

/* `components` & `utilities` */
for (const path of globbySync(`${root}/{${styleDirs.join(',')}}/**/*.css`)) {
	const dest = stripRoot(path)
	const destDir = dirname(dest)
	ensureDirSync(destDir)

	const rawCss = replaceSlash(replacePrefix(readFileSync(path, 'utf8')))
	const {css} = processor.process(rawCss)

	console.log('Writing', dest)
	writeFileSync(dest, css)
	writeIndex(destDir, basename(dest))
}

/* `components` & `utilities` index */
const order = new Map([
	['global', 0],
	['unstyled', 1],
	['styled', 2],
])

for (const dir of styleDirs) {
	const ordered: string[] = []
	const unordered: string[] = []

	for (const name of readdirSync(dir)) {
		if (order.has(name)) {
			ordered[order.get(name)!] = name
		} else {
			unordered.push(name)
		}
	}

	for (const name of [...ordered.filter(Boolean), ...unordered])
		writeIndex(dir, `${name}/index.css`)
}

/* `themes` */
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
				// So replace space separator with comma
				.map(([prop, value]) => [prop, value.replaceAll(' ', ', ')].join(': '))
				.join(';\n\t\t\t')};
		}
	`).trim()

	const file = `${name!}.css`
	const dest = `${themesDir}/${file}`

	console.log('Writing', dest)
	writeFileSync(dest, css)
	writeIndex(themesDir, file)

	if (name === 'dark' || name === 'light')
		auto.set(name, css.replace(selector, ':root'))
}

/* `auto` theme */
const autoDest = `${themesDir}/${autoCss}`
console.log('Writing', autoDest)
writeFileSync(
	autoDest,
	// Dark style should go after light style
	`${auto.get('light')!}\n@media (prefers-color-scheme: dark) {\n${auto.get(
		'dark',
	)!}\n}`,
)
