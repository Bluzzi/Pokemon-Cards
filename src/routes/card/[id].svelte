<script context="module">
    import Endpoints from "$lib/pokemontcg/Endpoints";
    import { jsonFetch } from "$lib/utils/Fetch";
    import type { LoadInput } from "@sveltejs/kit";

    export async function load({ page }: LoadInput){
        try {
            return {
                props: {
                    card: (await jsonFetch<any>(Endpoints.cards + "?q=id:" + page.params.id)).data[0]
                }
            }
        } catch(err){
            return {
                status: 400,
                error: new Error("Loading card failed")
            }
        }
    }
</script>

<script>
    import type { ICard } from "$lib/pokemontcg/interfaces/Card";
    import { fly } from "svelte/transition";

    export let card: ICard;
</script>

<img src={card.images.large} alt={card.name + " card"} transition:fly={{ x: -200, duration: 1000 }}>