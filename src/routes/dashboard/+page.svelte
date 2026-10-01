<script lang="ts">
  let { data } = $props();
</script>

<h1>Dashboard</h1>

<pre>{JSON.stringify(data.user, null, 2)}</pre>