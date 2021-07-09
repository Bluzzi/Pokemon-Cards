import sveltePreprocess from "svelte-preprocess";
import autoprefixer from "autoprefixer";
import adapter from "@sveltejs/adapter-static";
import node from "@sveltejs/adapter-node";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sveltePreprocess({
		defaults: {
			style: "scss",
			script: "ts"
		},
		scss: {
			outputStyle: "compressed",
			prependData: "@import './src/lib/scss/variables.scss';"
		},
		postcss: {
			plugins: [autoprefixer]
		}
	}),
	kit: {
		adapter: adapter()
		//adapter: node()
	}
};

export default config;
