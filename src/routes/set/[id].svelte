<script context="module" lang="ts">
    import type { LoadInput } from "@sveltejs/kit";

    export async function load({ params }: LoadInput){
        return {
            props: {
                setId: params.id
            }
        }
    }
</script>

<script lang="ts">
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
        <div class="header">
            <img 
                src={$currentSet.images.logo} 
                alt="serie logo" class="set-logo" 
                in:fly={{ x: -200 }}
            >

            <span class="line"></span>

            <div class="information" in:fly={{ x: 200 }}>
                <p><span>Serie name :</span> {$currentSet.series}</p>
                <p><span>Set name :</span> {$currentSet.name}</p>
                <p><span>Released date :</span> {$currentSet.releaseDate}</p>
                <p><span>Number of cards :</span> {$currentSet.total}</p>
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

<style lang="scss">
    .set {
        width: inherit;
        
        display: flex;
        align-items: center;
        flex-direction: column;

        overflow-y: scroll;

        padding: 55px 0;

        .header {
            width: inherit;

            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;

            margin-bottom: 40px;

            .set-logo {
                width: 450px;

                @media (max-width: $responsive-bp-tablet) {
                    width: 95%;
                }
            }

            .line {
                height: 150px;
                width: 4px;

                background-color: $color-primary;

                margin: 0 50px;
            }

            .information {
                p {
                    margin: 3px 0;

                    color: $color-gray;

                    span {
                        font-weight: bold;
                    }
                }
            }

            @media (max-width: $responsive-bp-desktop) {
                flex-direction: column;

                .line {
                    height: 0px;

                    margin: 25px 0;
                }
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