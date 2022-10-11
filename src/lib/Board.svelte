<script lang="ts">
  import {flip} from "svelte/animate";
  import { overrideItemIdKeyNameBeforeInitialisingDndZones, dndzone } from 'svelte-dnd-action';
  import { user as userStore } from './stores.js';
  import type { IList } from './types.js';
  import { loadLists, createList } from './board.js';
  import List from './List.svelte';

  overrideItemIdKeyNameBeforeInitialisingDndZones("order");

  export let id = '';

  let lists: IList[] = [];

  let user: any;

  userStore.subscribe(val => user = val);

  loadLists(boardId).then(() => {
    supabase.from('lists').on('*', async () => await loadLists(boardId)).subscribe();
  });

  async function updateOrder() {
    for(let i = 0; i < lists.length; i++) {
      lists[i].order = i
      const { data, error } = await supabase
        .from('lists')
        .update({ order: lists[i].order })
        .eq('id', lists[i].id);
    }
  }

  const flipDurationMs = 300;
  function handleDndConsider(e) {
    lists = e.detail.items;
  }
  async function handleDndFinalize(e) {
    lists = e.detail.items;
    await updateOrder();
  }
</script>

<button on:click={() => lists = createList(id, lists)}>Add List</button>

<section use:dndzone={{items: lists, flipDurationMs}} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
  {#each lists as list(list.order)}
  <List id={list.id} name={list.name} cards={list.cards}/>
  {/each}
</section>

<style>
  section {
    position: absolute;
    top: 100px;
    right: 0px;
    left: 0px;
    bottom: 0px;

    display: flex;
    flex-direction: row;

    margin-top: 10px;

    padding-left: 10px;
  }
</style>