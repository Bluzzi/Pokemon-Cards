<script context="module" lang="ts">
    import Endpoints from "$lib/pokemontcg/Endpoints";
    import { jsonFetch } from "$lib/utils/Fetch";

	export async function load(){
        try {
            return {
                props: {
                    sets: (await jsonFetch<any>(Endpoints.sets)).data
                }
            }
        } catch(err){
            return {
                status: 400,
                error: new Error("Loading series list failed")
            }
        }
	}
</script>

<script lang="ts">
    import Navbar from "$lib/components/navigation/Navbar.svelte";
    import NavSeries from "$lib/components/navigation/navseries/NavSeries.svelte";
    import type { ISet } from "$lib/pokemontcg/interfaces/Set";

    export let sets: ISet[];
</script>

<Navbar/>

<div class="content">
    <NavSeries sets={sets}/>
    
    <div class="page">
        <slot></slot>
    </div>
</div>

<span class="footer-line"></span>

<style lang="scss">
    .content {
        height: calc(100vh - #{$navbar-height} - #{$footer-line-height});
        width: 100%;
        
        display: flex;

        .page {
            width: inherit;

            display: flex;
            justify-content: center;

            background-image: url("/img/funky-lines.png");
        }
    }

    .footer-line {
        display: block;

        height: $footer-line-height;
        width: 100%;

        background-color: $color-primary;
    }
</style>