<script context="module">
    import type { LoadInput } from "@sveltejs/kit";

    export async function load({ page }: LoadInput){
        return {
            props: {
                setId: page.params.id,
            }
        }
    }
</script>

<script>
    import Card from "$lib/components/elements/Card.svelte";
    import { jsonFetch } from "$lib/utils/Fetch";
    import Endpoints from "$lib/pokemontcg/Endpoints";
    import { currentSet, cards } from "$lib/stores/Store";
    import { onMount } from "svelte";

    // Get props :
    export let setId: string;

    // If the visitor has accessed this page without going through the navigation, 
    // an additional request must be made to obtain the set information :
    if(!$currentSet){
        (async () => currentSet.set((await jsonFetch<any>(Endpoints.sets + "/" + setId)).data))();
    }

    // Calls on every page load, not just the first one :
    $: loadCards(), setId;

    // Create a scroll event on the .cards div,
    // because Svelte's on:scroll event does not work on an overflow-y div :
    onMount(() => {
        (document.querySelector(".cards") as HTMLDivElement).onscroll = scrollLoader;
    });

    // Functions :
    const pageSize = 50;

    let totalCard: number;
    let nextPage = {
        end: false,
        next: 1,
        isLoaded: true
    };

    async function loadCards(page = 1){
        jsonFetch<any>(Endpoints.cards + "?page=" + page + "&pageSize=" + pageSize + "&q=set.id:" + setId)
        .then(json => {
            cards.update(cards => cards.concat(json.data));

            totalCard = json.totalCount;
            nextPage = {
                end: $cards.length >= totalCard,
                next: json.page + 1,
                isLoaded: false
            };
        });
    }

    function scrollLoader(event: UIEvent){
        const scrollDiv = <HTMLDivElement>event.target;

        if(scrollDiv.scrollTop + window.innerHeight >= scrollDiv.scrollHeight){
            if(!nextPage.end && !nextPage.isLoaded){
                loadCards(nextPage.next);

                nextPage.isLoaded = true;
            }
        }
    }
</script>

<svelte:head>
    <title>Pokemon Cards - {$currentSet?.series}</title>
</svelte:head>

<div class="serie">
    {#if $currentSet?.images?.logo}
        <img src={$currentSet.images.logo} alt="serie logo" class="header">
    {/if}

    <div class="cards">
        {#each $cards as card}
            <Card card={card}/>
        {/each}

        {#if $cards.length < totalCard}
            <div class="load">
                <img src="/img/loading.svg" alt="loading">    
            </div>
        {/if}
    </div>
</div>

<style>
    .serie {
        display: flex;
        align-items: center;
        flex-direction: column;
        
        .header {
            margin: 40px 0;

            width: 450px;

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

        .load {
            width: 100%;

            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>