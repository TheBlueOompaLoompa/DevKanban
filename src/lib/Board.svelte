<script lang="ts">
  //import { dndzone } from 'svelte-dnd-action';
  import { supabase, createThing } from './supabase.js';
  import { user as userStore } from './stores.js';
  import type { IList } from './types.js';
  import List from './List.svelte';

  export let id = '';

  let lists: IList[] = [];

  let user: any;

  userStore.subscribe(val => user = val);

  async function createList() {
    await createThing('lists', 'board', id, 'list');
  }

  async function loadLists() {
    let { data, error } = await supabase.from('lists').select('*').eq('board', id);

    if(!error) {
      lists = data;
    }
  }

  loadLists().then(() => {
    supabase.from('lists').on('*', loadLists).subscribe();
  })
</script>

<button on:click={createList}>Add List</button>

<section>
  {#each lists as list(list.id)}
  <List id={list.id} name={list.name}/>
  {/each}
</section>

<style>
  section {
    display: flex;
    flex-direction: row;

    margin-top: 10px;

    padding-left: 10px;
  }
</style>