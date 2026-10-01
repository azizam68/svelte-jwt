<script lang="ts">
  let { data } = $props();
</script>

<h1>Dashboard</h1>
<form method="POST" action="?/logout">
  <button>Se déconnecter</button>
</form>
<pre>{JSON.stringify(data.user, null, 2)}</pre>