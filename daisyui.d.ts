declare module 'daisyui/src/colors/themes.js' {
	const themes: Record<string, Record<string, string>>
	export default themes
}

declare module 'daisyui/src/colors/functions.js' {
	export function convertToHsl(
		input: Record<string, string>,
	): Record<string, string>
}
