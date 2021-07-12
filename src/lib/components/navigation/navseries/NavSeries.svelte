<script>
    import type { ISet } from "$lib/pokemontcg/interfaces/Set";
    import SerieSets from "$lib/components/navigation/navseries/SerieSets.svelte";
    import { onMount } from "svelte";

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
</script>

<div class="nav-sets">
    {#each series as serie}
        <SerieSets serie={serie} sets={setsBySeries[serie]} isOpen={serie === openSerieName}/>
    {/each}
</div>

<style>
    .nav-sets {
        width: max-content;

        background-color: $color-white;

        overflow-y: scroll;

        margin: 0;
    }
</style>