<script lang="ts">
  import { flip } from "svelte/animate";
  import { overrideItemIdKeyNameBeforeInitialisingDndZones, dndzone } from 'svelte-dnd-action';
  import { supabase } from './supabase.js';

  export let id: string;
  export let name: string;
  export let cards: any[] = [];

  const flipDurationMs = 300;
</script>