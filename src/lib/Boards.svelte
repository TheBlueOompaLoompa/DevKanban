<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { user as userStore } from './stores.js';
    import { supabase, createThing } from './supabase.js';
    
    const dispatch = createEventDispatcher();

    let user: any;

    userStore.subscribe(val => user = val);

    async function createBoard() {
        await createThing('cards', 'list', user.id, 'card');
    }

    async function loadBoards() {
        let boards = [];

        const res = await supabase.from('boards').select('*');

        if(res.status.toString().startsWith('20')) {
            boards = res.body;
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