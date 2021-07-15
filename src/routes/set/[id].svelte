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
    import { fly, fade } from "svelte/transition";

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
    <title>Pokemon Cards - {$currentSet?.name}</title>
</svelte:head>

<div class="set" on:scroll={scrollLoader}>
    {#if $currentSet && currentCardCount > 0}
        <img src={$currentSet.images.logo} alt="serie logo" class="set-logo" in:fly={{ y: -200 }}>

        <div class="information" in:fade>
            <img src={$currentSet.images.symbol} alt={$currentSet.name + " symbol"}>

            <div class="name-and-release">
                <h3>{$currentSet.series} <span>/</span> {$currentSet.name}</h3>

                <p>Released {$currentSet.releaseDate}</p>
                <p>Number of cards : {$currentSet.total}</p>
            </div>
        </div>
    {/if}

    <div class="cards" bind:this={cardsDiv}>
        <!-- Card place -->
    </div>

    <div class="load" class:not-active={currentCardCount >= totalCard || currentCardCount === 0}>
        <img src="/img/loading.svg" alt="loading">    
    </div>
</div>

<style>
    .set {
        display: flex;
        align-items: center;
        flex-direction: column;

        width: inherit;

        overflow-y: scroll;

        padding: 55px 0;

        .set-logo {
            width: 450px;

            @media (max-width: $responsive-bp-tablet) {
                width: 95%;
            }
        }

        .information {
            margin: 44px 0;
            padding: 15px 20px;

            display: flex;
            align-items: center;

            background-color: rgba($color: #f1f1f12f, $alpha: 1.0);

            border-radius: 20px;

            box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.1);

            img {
                height: 50px;
                width: auto;

                margin-right: 30px;
            }

            h3 {
                margin: 10px 0;

                font-size: 1.1em;

                display: flex;
                align-items: center;

                span {
                    margin: 0 6px;

                    font-size: 1.3em;
                }
            }

            p {
                margin: 3px 0;

                color: $color-gray;
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