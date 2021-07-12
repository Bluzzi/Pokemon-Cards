<script context="module">
    import Endpoints from "$lib/pokemontcg/Endpoints";
    import { jsonFetch } from "$lib/utils/Fetch";
    import type { LoadInput } from "@sveltejs/kit";

    export async function load({ page }: LoadInput){
        console.log(Endpoints.cards + "?q=id:" + page.params.id); // TODO : remove this
        try {
            return {
                props: {
                    card: (await jsonFetch<any>(Endpoints.cards + "?q=id:" + page.params.id)).data[0]
                }
            }
        } catch(err){
            return {
                status: 400,
                error: new Error("Loading card failed")
            }
        }
    }
</script>

<script>
    import type { ICard } from "$lib/pokemontcg/interfaces/Card";
    import { fly } from "svelte/transition";

    export let card: ICard;
</script>

<svelte:head>
    <title>Pokemon Cards - {card.name}</title>
</svelte:head>

<div class="card">
    <img 
        class="card-image"
        src={card.images.large} 
        alt={card.name + " card"} 
        in:fly={{ x: -200, duration: 1000 }}>

    <div class="card-information" in:fly={{ x: 200, duration: 1000 }}>
        <h3>{card.name}</h3>
        <p>{card.supertype} - {card.subtypes.join(", ")}</p>

        <hr>

        <p>Prices</p>
        <p><a href="/tgm">Buy here</a></p>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa id placeat laboriosam. Tenetur consequatur sapiente hic, magni tempora porro velit possimus beatae reiciendis ipsum dolor laudantium nihil commodi rerum animi!</p>

        <hr>

        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe mollitia animi beatae quia. Repellendus culpa voluptate animi ab, nobis qui totam veniam magnam dignissimos maiores aperiam pariatur. Vel, molestias reiciendis</p>

        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, corporis quas mollitia ex reiciendis alias eos dolorum necessitatibus inventore eum debitis atque hic iste quaerat expedita consequatur amet sunt iusto</p>
    </div>
</div>

<style>
    .card {
        width: inherit;

        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-wrap: wrap;

        overflow-y: scroll;

        padding: 55px 0;

        .card-information, .card-image {
            margin: 10px;
        }

        .card-information {
            height: 80%;
            width: 450px;

            @media (max-width: $responsive-bp-mobile) {
                height: auto;
                width: 95%;
            }

            a {
                color: $color-secondary;
            }

            hr {
                background-color: $color-primary;

                height: 4px;

                border: none;
            }
        }

        .card-image {
            height: 80%;
            width: auto;

            @media (max-width: $responsive-bp-mobile) {
                width: 95%;
                height: auto;
            }
        }
    }
</style>