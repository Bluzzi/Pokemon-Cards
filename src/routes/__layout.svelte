<script context="module">
    import Endpoints from "$lib/pokemontcg/Endpoints";
    import { jsonFetch } from "$lib/utils/Fetch";

	export async function load(){
        try {
            const json = await jsonFetch<any>(Endpoints.sets);

            return {
                props: {
                    sets: json.data
                }
            }
        } catch(err){
            return {
                status: 400,
                error: new Error(err)
            }
        }
	}
</script>

<script>
    import Navbar from "$lib/components/Navbar.svelte";
    import SerieSet from "$lib/components/elements/SerieSets.svelte";
    import type { ISet } from "$lib/pokemontcg/interfaces/Set";

    export let sets: ISet[];
    const setsBySeries: Record<string, ISet[]> = {};

    sets.forEach(set => {
        if(setsBySeries[set.series]){
            setsBySeries[set.series].push(set);
        } else {
            setsBySeries[set.series] = [set];
        }
    });

    const series = Object.keys(setsBySeries).reverse();
</script>

<Navbar/>

<div class="content">
    <div class="nav-sets">
        {#each series as serie, i}
            <SerieSet serie={serie} sets={setsBySeries[serie]} isOpen={i === 0}/>
        {/each}
    </div>
    <div class="cards">
        <slot></slot>
    </div>
</div>

<footer>
    <p>Pokémon Cards - Created by the <a href="https://royaume.world">Royaume</a></p>
</footer>

<style>
    .content {
        height: calc(100vh - 60px - 40px);
        width: 100%;
        
        display: flex;

        .nav-sets {
            width: max-content;

            background-color: $color-white;

            overflow-y: scroll;

            margin: 0;
        }

        .cards {
            overflow-y: scroll;

            width: inherit;

            @media (max-width: $responsive-bp-tablet){
                padding: 30px $space-4;
            }

            display: flex;
            justify-content: center;
        }
    }

    footer {
        display: flex;
        align-items: center;
        justify-content: center;

        background-color: $color-primary;

        height: 40px;

        p, a {
            color: white;
        }
        
        a {
            text-decoration: underline;
        }
    }
</style>