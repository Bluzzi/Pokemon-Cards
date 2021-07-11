<script context="module">
    import type { LoadInput } from "@sveltejs/kit";

    export async function load({ page }: LoadInput){
        return {
            props: {
                setId: page.params.id,
                cardsList: []
            }
        }
    }
</script>

<script>
    import Card from "$lib/components/elements/Card.svelte";
    import { jsonFetch } from "$lib/utils/Fetch";
    import Endpoints from "$lib/pokemontcg/Endpoints";
    import { currentSet } from "$lib/stores/Store";
    import type { ICard } from "$lib/pokemontcg/interfaces/Card";

    interface INextPage {
        end: boolean,
        next: number,
        isLoaded: boolean
    }

    // Get props :
    export let setId: string;
    export let cardsList: ICard[];

    // Bind div variables :
    let serieDiv: HTMLDivElement;
    let cardsDiv: HTMLDivElement;

    // Card loading configuration :
    const pageSize = 50;

    let totalCard: number;
    let nextPage: INextPage;

    // If the visitor has accessed this page without going through the navigation, 
    // an additional request must be made to obtain the set information :
    if(!$currentSet){
        (async () => currentSet.set((await jsonFetch<any>(Endpoints.sets + "/" + setId)).data))();
    }

    // Calls on every page load, not just the first one :
    $: nextPage = {
        end: false,
        next: 1,
        isLoaded: true
    }, setId;
    $: reloadPage(), setId;

    // Functions :
    async function reloadPage(){
        // Remove old cards :
        if(cardsDiv) cardsDiv.innerHTML = "";

        // Scroll to the page top :
        if(serieDiv) serieDiv.scrollTo(0, 0);

        // Load new cards :
        loadCards();
    }

    async function loadCards(page = 1){
        jsonFetch<any>(Endpoints.cards + "?page=" + page + "&pageSize=" + pageSize + "&q=set.id:" + setId)
        .then(json => {
            cardsList = cardsList.concat(json.data);

            totalCard = json.totalCount;

            nextPage.end = cardsList.length >= totalCard;
            nextPage.next = json.page + 1;
            nextPage.isLoaded = false;
        });
    }

    async function scrollLoader(event: UIEvent){
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

<div class="serie" on:scroll={scrollLoader} bind:this={serieDiv}>
    <p id="tgm">{cardsList.length}/{totalCard}</p>

    {#if $currentSet}
        <img src={$currentSet.images.logo} alt="serie logo" class="header">
    {/if}

    <div class="cards" bind:this={cardsDiv}>
        {#each cardsList as card}
            <Card card={card}/>
        {/each}

        {#if cardsList.length < totalCard}
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

        width: 100%;

        overflow-y: scroll;

        #tgm {
            position: fixed;

            top: 0;
            left: 10px;

            background-color: $color-yellow;
        }

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