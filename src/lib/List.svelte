<script lang="ts">
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
</script>

<section>
  <p>{name}</p>
  <cards>
  {#each cards as card (card.order)}
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