<script context="module">
    import type { LoadInput } from "@sveltejs/kit";

    export async function load({ page }: LoadInput){
        return {
            props: {
                setId: page.params.id
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
    import { fly } from "svelte/transition";

    interface INextPage {
        end: boolean,
        next: number,
        isLoaded: boolean
    }

    interface ISetRequest {
        data: ICard[],
        totalCount: number,
        page: number
    }

    // Get props :
    export let setId: string;

    // Bind div variables :
    let serieDiv: HTMLDivElement;
    let cardsDiv: HTMLDivElement;

    // Card loading configuration :
    const pageSize = 50;
    
    let currentCardCount = 0;
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
    $: currentCardCount = 0, setId;

    // Functions :
    async function reloadPage(){
        // Remove old cards :
        if(cardsDiv) cardsDiv.innerHTML = "";

        // Load new cards :
        loadCards();
    }

    async function loadCards(page = 1){
        jsonFetch<any>(Endpoints.cards + "?page=" + page + "&pageSize=" + pageSize + "&q=set.id:" + setId)
            .then((json: ISetRequest) => {
            // Add news cards :
            if(cardsDiv){
                json.data.forEach((element: ICard) => {
                    new Card({
                        target: cardsDiv, 
                        props: { card: element },
                        intro: true
                    });
                });
            }

            // Get current card loaded and total card count for this set :
            currentCardCount += json.data.length;
            totalCard = json.totalCount;

            // Update next page config :
            nextPage.end = currentCardCount >= totalCard;
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
    {#if $currentSet && currentCardCount > 0}
        <img src={$currentSet.images.logo} alt="serie logo" class="header" in:fly={{ y: -200 }}>
    {/if}

    <div class="cards" bind:this={cardsDiv}>
        <!-- Card place -->
    </div>

    <div class={"load " + (currentCardCount < totalCard && currentCardCount > 0 ? "" : "not-active")}>
        <img src="/img/loading.svg" alt="loading">    
    </div>
</div>

<style>
    .serie {
        display: flex;
        align-items: center;
        flex-direction: column;

        width: 100%;

        overflow-y: scroll;

        .header {
            margin: 40px 0;

            width: 450px;

            @media (max-width: $responsive-bp-tablet) {
                width: 95%;
            }
        }

        .cards {
            max-width: 310px * 8;

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

        .not-active {
            display: none;
        }
    }
</style>