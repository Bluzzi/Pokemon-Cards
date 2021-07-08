<script>
    import type { ISet } from "$lib/pokemontcg/interfaces/Set";
    import { fly } from "svelte/transition";
    import { currentSet, cards } from "$lib/stores/Store";

    export let serie: string;
    export let sets: ISet[];
    export let isOpen = false;

    function updateSet(set: ISet){
        currentSet.set(set);
        cards.set([]);
    }
</script>

<div class="serie">
    <h3 on:click={() => isOpen = !isOpen}>
        <img src="/img/next.svg" alt="open {serie} serie" class={isOpen ? "is-open" : ""}>
        {serie}
    </h3>

    {#if isOpen}
        {#each sets as set}
            <p transition:fly={{y: -15, duration: 500}}>
                <a on:click={() => updateSet(set)} href="/set/{set.id}">{set.name}</a>
            </p>
        {/each}
    {/if}
</div>

<style>
    .serie {
        margin: 30px 20px;

        h3, p {
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

        p {
            font-size: 0.9em;
            
            margin-left: 10px;

            a {
                text-decoration: none;
                color: $color-gray;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
</style>