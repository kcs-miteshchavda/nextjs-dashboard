import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			gridTemplateColumns: {
				'13': 'repeat(13, minmax(0, 1fr))',
			},
			colors: {
				cyan: {
					400: '#22D3EE',
					500: '#06B6D4',
					600: '#0891B2',
				},
			},
		},
		keyframes: {
			shimmer: {
				'100%': {
					transform: 'translateX(100%)',
				},
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
export default config;
