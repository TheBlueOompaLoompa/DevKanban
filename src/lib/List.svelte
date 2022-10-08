<script lang="ts">
  import { supabase } from './supabase.js';
  import Card from "./Card.svelte";

  export let id: string;
  export let name: string;

  let cards = [];

  async function loadCards() {
    const res = await supabase.from('cards').select('*').eq('list', id);

    if(res.status.toString().startsWith('20')) {
      console.log(res.body)
      cards = res.body;
    }
  }

  loadCards().then(() => {
    supabase.from('lists').on('*', loadCards);
  })
</script>

<section>
  <p>{name}</p>
  <cards>
  {#each cards as card}
    <Card id={card.id} title={card.title}/>
  {/each}
  </cards>
</section>

<style>
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