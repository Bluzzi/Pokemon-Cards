<script>
    import type { ISet } from "$lib/pokemontcg/interfaces/Set";
    import { fly } from "svelte/transition";
    import { currentSet } from "$lib/stores/Store";
    import { onDestroy, onMount } from "svelte";
    import { navigating } from "$app/stores";

    export let serie: string;
    export let sets: ISet[];
    export let isOpen = false;

    sets = sets.reverse();

    let currentActiveSet: string;

    // First status update :
    onMount(() => {
        sets.forEach(set => {
            if(location && location.pathname.includes(set.id)){
                isOpen = true;
                currentActiveSet = set.id;
            }
        });
    });

    // Status updates :
    const unSubscriber = navigating.subscribe(value => {
        if(!value) return;

        let noResult = true;

        sets.forEach(set => {
            if(value && value.to.path.includes(set.id)){
                isOpen = true;
                currentActiveSet = set.id;
                noResult = false;
            }
        });

        if(noResult) currentActiveSet = ""; 
    });

    onDestroy(unSubscriber);
    
    // Functions :
    function updateSet(set: ISet){
        currentSet.set(set);
    }
</script>

<div class="serie">
    <h3 on:click={() => isOpen = !isOpen}>
        <img src="/img/next.svg" alt="open {serie} serie" class:is-open={isOpen}>
        {serie}
    </h3>

    {#if isOpen}
        {#each sets as set}
            <div class="set" transition:fly={{y: -15, duration: 500}}>
                <img src={set.images.symbol} alt="set logo">
                <p>    
                    <a 
                    class:active={currentActiveSet && currentActiveSet === set.id} 
                    on:click={() => updateSet(set)} 
                    href="/set/{set.id}">
                        {set.name}
                    </a>
                </p>
            </div>
        {/each}
    {/if}
</div>

<style>
    .serie {
        margin: 30px 20px;

        h3, .set {
            cursor: pointer;
        }

        h3 {
            text-transform: uppercase;
            font-size: 1em;

            user-select: none;

            img {
                height: 12px;

                transition: transform 0.2s;

                &.is-open {
                    transform: rotate(90deg);
                }
            }
        }

        .set {
            display: flex;
            align-items: center;

            margin-left: 10px;
            
            p {
                font-size: 0.9em;

                margin: 6px 0;

                a {
                    text-decoration: none;
                    color: $color-gray;

                    &:hover, &.active {
                        border-bottom: 4px solid $color-yellow;
                    }
                }
            }

            img {
                height: 20px;
                width: auto;

                margin-right: 5px;
            }
        }
    }
</style>