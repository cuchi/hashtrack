<script>
    import Login from './Login.svelte'
    import Board from './Board.svelte'
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

    function logout() {
        localStorage.removeItem('token')
        sessionStatus = 'logged-out'
    }
</script>

{#if sessionStatus === 'pending'}
    <main 
        class="uk-flex uk-flex-center uk-flex-middle uk-background-muted uk-height-viewport">
        <div uk-spinner="ratio: 5" />
    </main>
{:else if sessionStatus === 'logged-in'}
    <main 
        class="uk-flex uk-flex-center uk-background-muted uk-height-viewport">
        <Board on:sessionDestroyed={logout} />
    </main>
{:else}
    <main 
        class="uk-flex uk-flex-center uk-flex-middle uk-background-muted uk-height-viewport">
        <Login on:sessionCreated={checkStatus} />
    </main>
{/if}

