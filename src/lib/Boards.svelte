<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { user as userStore } from './stores.js';
    import { supabase, createThing } from './supabase.js';
    
    const dispatch = createEventDispatcher();

    let user: any;

    userStore.subscribe(val => user = val);

    async function createBoard() {
        let { data, error} = await createThing('boards', 'owner', user.id, 'board');

        if(!error) dispatch('open', data[0].id);
    }

    async function loadBoards() {
        let boards = [];

        let { data, error } = await supabase.from('boards').select('*');

        if(!error) {
            boards = data;
        }else {
            alert('Failed to load boards!');
        }

        return boards;
    }
</script>

<button on:click={createBoard}>Create Board</button>

<boards>
{#await loadBoards()}
    <p>Loading</p>
{:then boards} 
    {#each boards as board }
        <button on:click={() => dispatch('open', board)}>{board.name}</button>
    {/each}
{/await}
</boards>

<style>
    boards {
        display: grid;
        grid-auto-rows: auto;
    }

    boards button {
        max-width: 200px;
        margin-top: 10px;
    }
</style>