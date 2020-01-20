<script>
	import Login from './Login.svelte'
	import Board from './Board.svelte'
	import { getCurrentUser } from './lib/user'

	let sessionStatus = 'pending'
	checkStatus()

	async function checkStatus(event) {
		if (event) {
			if (!event.detail.token) {
				localStorage.removeItem('token')
			} else {
				localStorage.setItem('token', event.detail.token)
			}
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
		<Board on:sessionDestroyed={checkStatus} />
	{:else}
		<Login on:sessionCreated={checkStatus} />
	{/if}
</main>