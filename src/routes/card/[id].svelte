<script context="module">
    import Endpoints from "$lib/pokemontcg/Endpoints";
    import { jsonFetch } from "$lib/utils/Fetch";
    import type { LoadInput } from "@sveltejs/kit";

    export async function load({ page }: LoadInput){
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
        <div class="info-top">
            <div class="top-left">
                <h3>{card.name}</h3>
                <p>{card.supertype} - {card.subtypes.join(", ")}</p>                
            </div>

            {#if card.supertype === "Pokémon"}
                <div class="top-right">
                    <p>HP {card.hp}</p>
                    
                    {#each card.types as type}
                        <img 
                            src={"/img/pokemon/element/" + type.toLowerCase() + ".png"} 
                            alt={"element " + type}
                        >
                    {/each}
                </div>
            {/if}
        </div>

        <hr>

        <p>Prices</p>
        <p><a href="/tgm">Buy here</a></p>
        {JSON.stringify(card.tcgplayer)}

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

            // Base :
            @media (max-width: $responsive-bp-mobile) {
                height: auto;
                width: 95%;
            }

            h3, p {
                margin: 5px 0;
            }

            p {
                font-size: 1.1em;
            }

            a {
                color: $color-secondary;
            }

            hr {
                background-color: $color-primary;

                height: 4px;

                border: none;
            }

            // Parts :
            .info-top {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;

                .top-right {
                    display: flex;
                    align-items: center;

                    img {
                        height: 25px;
                        width: auto;

                        margin-left: 6px;
                    }
                }
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