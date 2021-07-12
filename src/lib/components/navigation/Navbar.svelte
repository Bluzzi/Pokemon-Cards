<script>
    import { onDestroy, onMount } from "svelte";
    import { navigating } from "$app/stores";

    // Pages :
    const navItems = [
        {name: "Home", route: "/"}
    ];

    // Get current active page :
    let currentPage = "";

    onMount(() => currentPage = location.pathname);

    const unSubscribe = navigating.subscribe(value => {
        if(value) currentPage = value.to.path;
    });

    onDestroy(unSubscribe);
</script>

<nav>
    <img src="/img/icon.png" alt="logo">

    <div class="links">
        {#each navItems as item}
            <a href={item.route} class={currentPage === item.route ? "active" : ""}>{item.name}</a>    
        {/each}
    </div>
</nav>

<style>
    nav {
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: 0 5%;

        height: $navbar-height;

        background-color: $color-primary;

        img {
            height: 80%;
            width: auto;
        }

        a {
            font-size: 1.3em;
            text-decoration: none;
            color: $color-white;
            
            margin-left: 15px;

            &:hover, &.active {
                border-bottom: solid 4px $color-white;
            }
        }
    }
</style>