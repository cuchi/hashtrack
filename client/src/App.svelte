<script>
	import Login from './Login.svelte'
	import { getCurrentUser } from './lib/user'

	let sessionStatus = 'pending'
	checkStatus()

	async function checkStatus(event) {
		if (event) {
			localStorage.setItem('token', event.detail.token)
		}

		try {
			await getCurrentUser()
			sessionStatus = 'logged-in'
		} catch(error) {
			sessionStatus = 'logged-out'
		}
	}
</script>

<main class="uk-flex uk-flex-center uk-flex-middle uk-background-muted uk-height-viewport">
	{#if sessionStatus === 'pending'}
		<div uk-spinner="ratio: 5" />
	{:else if sessionStatus === 'logged-in'}
		<h1>Logged in!</h1>
	{:else}
		<Login on:sessionCreated={checkStatus} />
	{/if}
</main>