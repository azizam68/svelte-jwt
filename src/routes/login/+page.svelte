<script lang="ts">
  import { enhance } from '$app/forms';
  let { form } = $props();
</script>

<h1>Connexion</h1>

<form method="POST" use:enhance>
  <input name="email" type="email" placeholder="Email" value={form?.email ?? ''} required />
  <input name="password" type="password" placeholder="Mot de passe" required />
  <button>Se connecter</button>
</form>

{#if form?.error}
  <p style="color:red">{form.error}</p>
{/if}