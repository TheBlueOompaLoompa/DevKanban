<script lang="ts">
  import {flip} from "svelte/animate";
  import { overrideItemIdKeyNameBeforeInitialisingDndZones, dndzone } from 'svelte-dnd-action';
  import { user as userStore } from './stores.js';
  import type { IList } from './types.js';
  import { loadLists, createList, updateListOrder, createCard, loadCards, updateCardOrder } from './board.js';
  import { supabase } from './supabase.js';
  import Card from "./Card.svelte";

  overrideItemIdKeyNameBeforeInitialisingDndZones("order");

  export let id = '';

  let lists: IList[] = [];

  let user: any;

  userStore.subscribe(val => user = val);

  let cardSubscriptions = [];

  function resetCardSubscriptions() {
    cardSubscriptions.forEach(sub => supabase.removeSubscription(sub));
  }

  function createCardSubscription(listId) {
    const listIdx = lists.findIndex(list => list.id == listId);
    cardSubscriptions.push(supabase.from('cards').on('*', async () => {
      lists[listIdx].cards = [...await loadCards(lists[listIdx].id)];
    }).subscribe());
  }

  loadLists(id).then((data) => {
    lists = data;
    supabase.from('lists').on('INSERT,UPDATE,DELETE', async () => {
      resetCardSubscriptions();
      lists = [...(await loadLists(id))];
    }).subscribe();

    for(let idx = 0; idx < lists.length; idx++) {
      loadCards(lists[idx].id).then(data => {
        lists[idx].cards = data;
        createCardSubscription(lists[idx].id);
      });
    }
  });

  const flipDurationMs = 300;
  function handleDndConsider(e) {
    lists = e.detail.items;
  }
  async function handleDndFinalize(e) {
    const temp = e.detail.items;
    lists = await updateListOrder(temp);
  }

  function handleDndConsiderCards(listId, e) {
    const listIdx = lists.findIndex(list => {return list.id === listId});
    lists[listIdx].cards = e.detail.items;
    lists = [...lists];
  }
  async function handleDndFinalizeCards(listId, e) {
    const temp = e.detail.items;

    const listIdx = lists.findIndex(list => list.id == listId);
    lists[listIdx].cards = [...(await updateCardOrder(listId, temp))];
    lists = [...lists];
  }
</script>

<button on:click={() => lists = createList(id, lists)}>Add List</button>

<board use:dndzone={{items: lists, flipDurationMs, type:'columns'}} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
  {#each lists as list(list.order)}
  <list>
    <p>{list.name}</p>
    <cards use:dndzone={{items: list.cards, flipDurationMs}} on:consider={(e) => handleDndConsiderCards(list.id, e)} on:finalize={(e) => handleDndFinalizeCards(list.id, e)}>
    {#each list.cards as card(card.order)}
      <Card id={card.id} name={card.name}/>
    {/each}
    </cards>
    <button on:click={() => createCard(list.id, list.cards)} style="margin-bottom: 5px;">Create Card</button>
  </list>
  {/each}
</board>

<style>
  board {
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

  list {
    display: flex;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: var(--curvy);
    margin-right: 10px;

    max-height: 97%;

    height: fit-content;
  }

  list, cards {
    display: flex;
    flex-direction: column;

    align-items: center;
  }

  cards {
    height: 100%;
    width: 300px;
    overflow-y: scroll;
  }
</style>