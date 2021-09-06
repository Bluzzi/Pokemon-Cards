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

    // Functions :
    function onSearch(event: KeyboardEvent){
        if(event.key === "Enter"){
            console.log("SEARCH !!");

            return;
        }

        console.log((event.target as HTMLInputElement).value); // TODO
    }
</script>

<nav>
    <h1>Pokemon Cards</h1>

    <input type="text" placeholder="Search a Pokemon 🔍" on:keyup={onSearch} id="search-bar">

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

        input {
            height: 55%;
            width: 50%;

            padding: 0 15px;

            border: none;
            border-radius: 3px;
            outline: none;

            &:focus {
                border: solid 3px $color-yellow;
            }
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