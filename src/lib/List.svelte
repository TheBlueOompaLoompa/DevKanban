<script lang="ts">
  import { flip } from "svelte/animate";
  import { overrideItemIdKeyNameBeforeInitialisingDndZones, dndzone } from 'svelte-dnd-action';
  import { supabase, createThing } from './supabase.js';
  import Card from "./Card.svelte";

  export let id: string;
  export let name: string;

  let cards = [];

  async function createCard() {
    let { data, error } = await createThing('cards', 'list', id, 'card', {order: cards[0] ? cards[cards.length - 1].order + 1 : 0});
    cards = [...cards, ...data]
  }

  async function loadCards() {
    let { data, error } = await supabase.from('cards').select('*').eq('list', id);

    if(!error) {
      cards = data;
      cards = cards.sort(function(a, b){return a.order-b.order});
    }else{
      console.error(error);
    }
  }

  loadCards().then(() => {
    supabase.from('cards').on('*', loadCards).subscribe();
  });

  async function updateOrder() {
    for(let i = 0; i < cards.length; i++) {
      cards[i].order = i
      const { data, error } = await supabase
        .from('cards')
        .update({ list: id, order: cards[i].order })
        .eq('id', cards[i].id);
    }
  }

  const flipDurationMs = 300;
  function handleDndConsider(e) {
    cards = e.detail.items;
  }
  async function handleDndFinalize(e) {
    cards = e.detail.items;
    await updateOrder();
  }
</script>

<section>
  <p>{name}</p>
  <cards use:dndzone={{items: cards, flipDurationMs}} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
  {#each cards as card(card.order)}
    <Card id={card.id} name={card.name}/>
  {/each}
  </cards>
  <button on:click={createCard} style="margin-bottom: 5px;">Create Card</button>
</section>

<style>
  section {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: var(--curvy);
    margin-right: 10px;

    max-height: 97%;

    height: fit-content;
  }

  section, cards {
    display: flex;
    flex-direction: column;

    align-items: center;
  }

  cards {
    width: 300px;
    overflow-y: scroll;
  }
</style>