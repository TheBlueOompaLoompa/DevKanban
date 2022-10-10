<script lang="ts">
  import { user as userStore } from './lib/stores.js';
  import {onMount} from 'svelte';
  import { supabase } from './lib/supabase.js';

  import Nav from './lib/Nav.svelte';
  import Boards from './lib/Boards.svelte'
  import Board from './lib/Board.svelte';
  

  let boardId = '';

  let authProcess = false;

  let user;

  userStore.subscribe(v => {
    user = v;
  });

  onMount(() => {
    const u = supabase.auth.user();
    if(u) userStore.set(u);
    setInterval(() => {
      if(window.location.href.endsWith('#')) window.location.href = '/';
    }, 200)
  });

  function openBoard(bd: any) {
    boardId = bd.detail.id;
  }

  async function signInWithGithub() {
    authProcess = true;

    const { user, session, error } = await supabase.auth.signIn({
      provider: 'github',
    });

    if(!error) userStore.set(user);

    authProcess = false;
  }
</script>

<main>
  <Nav/>
{#if !user}
  <h1>Login</h1>
  {#if !authProcess}
  <button on:click={signInWithGithub}>Sign in with Github</button>
  {/if}
{:else}
  {#if boardId != ''}
  <Board id={boardId}/>
  {:else}
  <Boards on:open={openBoard}/>
  {/if}
{/if}
</main>

<style>
  main {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    
    overflow-x: scroll;
  }
</style>