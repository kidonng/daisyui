import {expandGlobSync, emptyDirSync, ensureDirSync} from 'std/fs/mod.ts'
import {dirname, basename} from 'std/path/mod.ts'
import postcss from 'postcss'
import nested from 'postcss-nested'
import stripIndent from 'strip-indent'
import themes from 'daisyui/src/colors/themes'
import functions from 'daisyui/src/colors/functions'

const processor = postcss([nested])
const root = 'daisyui/src'
const dirs = ['themes', 'components', 'utilities']
const [themesDir] = dirs

const writeIndex = (dir: string, file: string) =>
	Deno.writeTextFileSync(`${dir}/index.css`, `@import "./${file}";\n`, {
		append: true,
	})

for (const dir of dirs) emptyDirSync(dir)

for (const {path} of expandGlobSync(
	`${root}/{${dirs.slice(1).join(',')}}/**/*.css`,
)) {
	const dest = path.replace(`${Deno.cwd()}/${root}/`, '')
	const destDir = dirname(dest)
	ensureDirSync(destDir)

	const rawCss = Deno.readTextFileSync(path)
		.replace(/--tw-([\w-]+)/g, '--un-$1')
		.replace(/(hsla?\(var\([-\w]+\)) ?\//g, '$1,')
	const {css} = processor.process(rawCss)

	console.log('Writing', dest)
	Deno.writeTextFileSync(dest, css)
	writeIndex(destDir, basename(dest))
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
