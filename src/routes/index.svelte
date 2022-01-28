<script context="module" lang="ts">
    import Endpoints from "$lib/pokemontcg/Endpoints";
    import { jsonFetch } from "$lib/utils/Fetch";

    export async function load(){
        try {
            const randomInt = Math.floor(Math.random() * 2730);

            return {
                props: {
                    cards: (await jsonFetch<any>(Endpoints.cards + "?pageSize=5&page=" + randomInt)).data
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

<script lang="ts">
    import Card from "$lib/components/elements/Card.svelte";
    import type { ICard } from "$lib/pokemontcg/interfaces/Card";

    export let cards: ICard[];
</script>

<svelte:head>
    <title>Pokemon Cards</title>
</svelte:head>

<div class="container">
    <img class="logo" src="/img/icon.png" alt="logo">
    <p>Bienvenue sur Pokemon Cards !</p>
    
    <p>Quelques cartes aléatoires...</p>
    <div class="random-cards">
        {#each cards as card}
            <Card card={card}/>
        {/each}
    </div>
</div>

<style lang="scss">
    .container {
        width: inherit;

        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        overflow-y: scroll;

        .logo {
            height: 100px;
        }

        .random-cards {
            width: 100%;

            display: flex;
            align-items: center;
            justify-content: space-evenly;
            flex-wrap: wrap;
        }
    }
</style>