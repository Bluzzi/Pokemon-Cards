<script>
    import { onDestroy, onMount } from "svelte";
    import { navigating } from "$app/stores";

    // Pages :
    const navItems = [
        { name: "Home", route: "/" },
        { name: "About", route: "/about" }
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
    <h1>Pokemon Cards</h1>

    <div class="links">
        {#each navItems as item}
            <a href={item.route} class:active={currentPage === item.route}>{item.name}</a>    
        {/each}
    </div>
</nav>

<style>
    nav {
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: 0 2%;

        height: $navbar-height;

        background-color: $color-primary;

        h1 {
            color: white;
            font-size: 1.3em;

            margin-right: 20px;
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