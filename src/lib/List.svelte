<script lang="ts">
  export let id: string;
  export let name: string;
</script>

<section>
<p>{name}</p>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
  }
</style>