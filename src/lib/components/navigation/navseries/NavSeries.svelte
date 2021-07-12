<script>
    import type { ISet } from "$lib/pokemontcg/interfaces/Set";
    import SerieSets from "$lib/components/navigation/navseries/SerieSets.svelte";
    import { onDestroy, onMount } from "svelte";
    import { navigating } from "$app/stores";

    export let sets: ISet[];

    // Sorting of sets by their series name :
    const setsBySeries: Record<string, ISet[]> = {};

    sets.forEach(set => {
        if(setsBySeries[set.series]){
            setsBySeries[set.series].push(set);
        } else {
            setsBySeries[set.series] = [set];
        }
    });

    // Get list of series :
    const series = Object.keys(setsBySeries).reverse();

    // Get open serie :
    let openSerieName: string;

    onMount(() => {
        const currentSetId = location.pathname.startsWith("/set/") ?
            location.pathname.substring("/set/".length) : null;

        if(currentSetId){
            openSerieName = sets.filter(set => set.id === currentSetId)[0].id;
        } else {
            openSerieName = series[0];
        }
    });

    // Functions :
    let burgerOpen = false;

    function changeMenuState(state: boolean|null = null){
        burgerOpen = typeof state === "boolean" ? state : !burgerOpen;
    }

    // Change menu state on navigating :
    const unSubscriber = navigating.subscribe(() => {
        changeMenuState(false);
    });

    onDestroy(unSubscriber);
</script>

<div class="burger" on:click={() => changeMenuState()} class:burger-active={burgerOpen}>
    <span></span>
    <span></span>
    <span></span>
</div>

<div class="nav-sets" class:nav-active={burgerOpen} class:nav-inactive={!burgerOpen}>
    {#each series as serie}
        <SerieSets serie={serie} sets={setsBySeries[serie]} isOpen={serie === openSerieName}/>
    {/each}
</div>

<style>
    // Burger :
    $bar-margin: 8px;

    $bar-height: 5px;
    $bar-width: ($bar-margin * 2) + ($bar-height * 3);

    .burger {
        height: $bar-width;
        width: $bar-width;

        margin: 10px;
        padding: 10px;

        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;

        position: absolute;
        right: 0;

        z-index: $z-burger;

        background-color: $color-primary;
        
        border-radius: 5px;

        cursor: pointer;

        span {
            height: $bar-height;
            width: $bar-width;

            background-color: $color-yellow;

            border-radius: 2px;

            transition: all 0.5s;
        }

        @media (min-width: $responsive-bp-mobile) {
            display: none;
        }
    }

    .burger-active span {
        &:nth-child(1) {
            transform: translateY($bar-margin + $bar-height) rotate(45deg);
        }

        &:nth-child(2) {
            opacity: 0;
        }

        &:nth-child(3) {
            transform: translateY(-($bar-margin + $bar-height)) rotate(-45deg);
        }
    }

    // Nav :
    .nav-sets {
        width: max-content;

        background-color: $color-white;

        overflow-y: scroll;
    }

    .nav-active {
        position: fixed;

        top: $navbar-height;
        bottom: $footer-line-height;

        height: calc(100% - #{$navbar-height} - #{$footer-line-height});
        width: 100vw;

        z-index: $z-serie-menu;
    }

    .nav-inactive {
        @media (max-width: $responsive-bp-mobile) {
            display: none;
        }
    }
</style>