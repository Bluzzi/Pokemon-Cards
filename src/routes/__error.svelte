<script context="module">
	import type { LoadOutput } from "@sveltejs/kit";

	export function load({ error, status }: LoadOutput){
		return {
			props: {
				errorCode: status,
				message: typeof error === "string" ? error : error.message.toLowerCase()
			}
		};
	}
</script>

<script>
	export let errorCode: number;
	export let message: string;
</script>

<svelte:head>
	<title>Pokemon Cards - Error {errorCode}</title>
</svelte:head>

<div class="error">
	<img src="/img/pokemon/error-page.png" alt="pokémon error">
	
	<div class="description">
		<p class="code">Error {errorCode}</p>
		<p class="message">{message}</p>
	</div>
</div>

<style>
	.error {
		display: flex;
		align-items: center;
		justify-content: center;
		align-content: center;
		flex-wrap: wrap-reverse;

		img {
			height: auto;
			max-width: 100%;
		}

		.description {
			max-width: $responsive-bp-mobile;

			p {
				margin: 5px;

				&.code {
					font-weight: bold;
					font-size: 2em;
				}

				&.message {
					font-size: 1.3em;
					color: $color-gray;
				}
			}
		}
	}
</style>