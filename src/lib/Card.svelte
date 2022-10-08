<script lang="ts">
  export let id: string;
  export let name: string;
</script>

<card>
  <p>{name}</p>
</card>

<style>
  card {
    background-color: rgba(0, 0, 0, 0.2);
    width: 90%;

    border-radius: var(--curvy);

    margin: 3px 0px 3px 0px;
  }

  p {
    margin: 10px;
  }
</style>