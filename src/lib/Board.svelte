<script lang="ts">
  //import { dndzone } from 'svelte-dnd-action';
  import type { IList } from './types.ts';
  import List from './List.svelte';

  //export let id = '';

  let lists: IList = [];
</script>

<section>
  {#each lists as list(list.id)}
  <List id={list.id} name={list.name}></List>
  {/each}
</section>

<style>
  section {
    display: flex;
    flex-direction: row;
  }
</style>