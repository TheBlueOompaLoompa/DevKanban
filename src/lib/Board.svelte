<script lang="ts">
  //import { dndzone } from 'svelte-dnd-action';
  import { supabase } from './supabase.js';
  import type { IList } from './types.js';
  import List from './List.svelte';

  export let id = '';

  let lists: IList[] = [];

  async function loadLists() {
    const res = await supabase.from('lists').select('*').eq('board', id);

    if(res.status.toString().startsWith('20')) {
      lists = res.body;
    }
  }

  loadLists().then(() => {
    supabase.from('lists').on('*', loadLists);
  })
</script>

<section>
  {#each lists as list(list.id)}
  <List id={list.id} name={list.name}/>
  {/each}
</section>

<style>
  section {
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
  }
</style>