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

<div class="error">
	<p>Error {errorCode}</p>
	<p>{message}</p>
</div>

<style>
	.error {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		p {
			margin: 5px;
		}
	}
</style>