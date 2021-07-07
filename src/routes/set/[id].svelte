<script context="module">
    import Endpoints from "$lib/pokemontcg/Endpoints";

    export async function load({page, fetch, session, context}){
        const setId = page.params.id;

        const resSet = await fetch(Endpoints.sets + "/" + setId);
        const resCard = await fetch(Endpoints.cards + "?q=set.id:" + setId);

        if(resSet.ok && resCard.ok){
            const set = (await resSet.json()).data;

            const data = await resCard.json();
            const cards = data.data;

            if(data.totalCount > 250){
                const resCard2 = await fetch(Endpoints.cards + "?page=2&q=set.id:" + setId);

                if(resCard2.ok) cards.push(...(await resCard2.json()).data);
            }

            return {
                props: {
                    set: set,
                    cards: cards
                }
            }
        }
        
        return {
            status: resCard.status,
            error: new Error("Pokémon API don't work")
        }
    }
</script>

<script>
    import type { ISet } from "$lib/pokemontcg/interfaces/Set";
    import type { ICard } from "$lib/pokemontcg/interfaces/Card";
    import Card from "$lib/components/elements/Card.svelte";

    export let set: ISet;
    export let cards: ICard[];
</script>

<svelte:head>
    <title>Pokemon Cards - {set.series}</title>
</svelte:head>

<div class="serie">
    <img src={set.images.logo} alt="serie logo" class="header">

    <div class="cards">
        {#each cards as card}
            <Card card={card}/>
        {/each}    
    </div>
</div>

<style>
    .serie {
        display: flex;
        align-items: center;
        flex-direction: column;
        
        .header {
            margin: 40px 0;

            height: max-content;
            width: 50%;

            @media (max-width: $responsive-bp-tablet) {
                width: 95%;
            }
        }

        .cards {
            max-width: 310px * 3;

            display: flex;
            justify-content: center;
            flex-wrap: wrap;

            margin-bottom: 40px;
        }
    }
</style>