<script>
    import type { ICard } from "$lib/pokemontcg/interfaces/Card";

    export let card: ICard;

    const link = "https://assets.pokemon.com/assets/cms2-fr-fr/img/cards/web/" + card.set.id.toUpperCase() +
        "/" + card.set.id.toUpperCase() + "_FR_" + card.number + ".png";
</script>

<img src={card.images.small} alt="{card.name} card" loading="lazy">

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