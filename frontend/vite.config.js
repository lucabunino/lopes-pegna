import { fileURLToPath, URL } from 'node:url';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	resolve: {
		alias: {
			$lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
		},
	},
	plugins: [
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['url', 'cookie', 'baseLocale'],
			urlPatterns: [
				{
					pattern: "/beads",
					localized: [
						["it", "/perle"],
						["en", "/en/beads"],
					],
				},
				{
					pattern: "/contacts",
					localized: [
						["it", "/contatti"],
						["en", "/en/contacts"],
					],
				},
				{
					pattern: "/:path(.*)?",
					localized: [
						["en", "/en/:path(.*)?"],
						["it", "/:path(.*)?"],
					],
				},
			],
		})
	]
});
