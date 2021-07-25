<script>
    import type { ICard } from "$lib/pokemontcg/interfaces/Card";
    import { fade } from "svelte/transition";

    export let card: ICard;
</script>

<a href={"/card/" + card.id}>
    <img src={card.images.small} alt="{card.name} card" loading="lazy" transition:fade>
</a>

<style>
    img {
        margin: 30px;

        width: 230px;

        filter: drop-shadow(0 0 3px rgba($color: $color-gray, $alpha: 0.4));

        transition: transform 0.2s;

        &:hover {
            transform: scale(1.1);
        }
    }
</style>