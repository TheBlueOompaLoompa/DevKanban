<script lang="ts">
  import { supabase } from './lib/supabase.ts';
  import Board from './lib/Board.svelte';
  import { session as sessionStore } from './lib/stores.ts';
  import {onMount} from 'svelte';

  let board = '';

  let authProcess = false;

  let session;

  sessionStore.subscribe(v => {
    session = v;
    alert(session == undefined)
  });

  onMount(() => {
    supabase.auth.getSession().then(({ data }) => {
      sessionStore.set(data.session)
    });

    supabase.auth.onAuthStateChange((_event, _session) => {
      sessionStore.set(data._session)
    });
  });

  async function signInWithGithub() {
    authProcess = true;

    const { user, _session, error } = await supabase.auth.signIn({
      provider: 'github',
    });

    if(!error) sessionStore.set(_session)

    authProcess = false;
  }
</script>

<main>
{#if !session}
  <h1>Login</h1>
  {#if !authProcess}
  <button on:click={signInWithGithub}>Sign in with Github</button>
  {/if}
{:else}
  {#if board != ''}
  <Board/>
  {:else}
  <h1>Boards</h1>
  {/if}
{/if}
</main>

<style>
</style>