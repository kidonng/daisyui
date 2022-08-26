import {expandGlobSync, emptyDirSync} from 'std/fs/mod.ts'
import postcss from 'postcss'
import nested from 'postcss-nested'
import stripIndent from 'strip-indent'
import themes from 'daisyui/src/colors/themes'
import functions from 'daisyui/src/colors/functions'

const processor = postcss([nested])
const root = 'daisyui/src'
const dirs = [...expandGlobSync(`${root}/{components,utilities}/*`)]
	.filter((i) => i.isDirectory)
	.map((i) => i.path)

for (const dir of dirs) {
	const destDir = dir.replace(`${Deno.cwd()}/${root}/`, '')
	emptyDirSync(destDir)

	for (const {name} of Deno.readDirSync(dir)) {
		if (!name.endsWith('.css')) continue

		const file = `${dir}/${name}`
		const {css} = processor.process(Deno.readTextFileSync(file))
		const dest = `${destDir}/${name}`

		console.log('Writing', dest)
		Deno.writeTextFileSync(dest, css)
		Deno.writeTextFileSync(`${destDir}/index.css`, `@import "./${name}";\n`, {
			append: true,
		})
	}
}

const themesDir = 'themes'
emptyDirSync(themesDir)

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
				.join(';\n\t\t\t')}
		}
	`).trim()

	const file = `${name}.css`
	const dest = `${themesDir}/${file}`

	console.log('Writing', dest)
	Deno.writeTextFileSync(dest, css)
	Deno.writeTextFileSync(`${themesDir}/index.css`, `@import "./${file}";\n`, {
		append: true,
	})
}
