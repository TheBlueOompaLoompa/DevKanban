<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { supabase } from './supabase.js';
    
    const dispatch = createEventDispatcher();

    async function loadBoards() {
        let boards = [];

        const res = await supabase.from('boards').select('*');

        if(res.status.toString().startsWith('20')) {
            boards = res.body;
        }

        return boards;
    }
</script>

<button>Create Board</button>

{#await loadBoards()}
    <p>Loading</p>
{:then boards} 
    {#each boards as board }
        <p on:click={() => dispatch('open', board)}>{board.name}</p>
    {/each}
{/await}
