<script lang="ts">
  import { supabase, createThing } from './supabase.js';
  import Card from "./Card.svelte";

  export let id: string;
  export let name: string;

  let cards = [];

  async function createCard() {
    await createThing('cards', 'list', id, 'card');
  }

  async function loadCards() {
    let { data, error } = await supabase.from('cards').select('*').eq('list', id);

    if(!error) {
      cards = data;
    }
  }

  loadCards().then(() => {
    supabase.from('lists').on('*', loadCards);
  });
</script>

<section>
  <p>{name}</p>
  <cards>
  {#each cards as card}
    <Card id={card.id} name={card.name}/>
  {/each}
    <button on:click={createCard}>Create Card</button>
  </cards>
</section>

<style>
  section {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: var(--curvy);
    margin-right: 10px;
  }

  section, cards {
    height: 100%;
    display: flex;
    flex-direction: column;

    align-items: center;
  }

  cards {
    width: 300px;
    overflow-y: scroll;
  }
</style>