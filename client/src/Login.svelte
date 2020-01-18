<script>
    import UserIcon from "./icons/UserIcon.svelte"
    import LockIcon from "./icons/LockIcon.svelte"
    import { login } from './lib/session'
    import { getErrorMessage } from './lib/graphql-client'

    let email = ''
    let password = ''
    let errorMessage

    async function onLogin() {
        try {
            await login(email, password)
        } catch (error) {
            errorMessage = getErrorMessage(error)
        }
    }
</script>

<div class="uk-width-medium uk-padding-small">
    <fieldset class="uk-fieldset">
        <div class="uk-margin-small">
            <div class="uk-inline uk-width-1-1">
                <UserIcon />
                <input
                    class="uk-input uk-border-pill"
                    placeholder="Email"
                    type="email"
                    bind:value={email} />
            </div>
        </div>
        <div class="uk-margin-small">
            <div class="uk-inline uk-width-1-1">
                <LockIcon />
                <input
                    class="uk-input uk-border-pill"
                    placeholder="Password"
                    type="password"
                    bind:value={password} />
            </div>
        </div>
        <div class="uk-margin-bottom">
            <button
                on:click={onLogin}
                class="uk-button uk-button-primary uk-width-1-1">
                LOG IN
            </button>
        </div>
        {#if errorMessage}
            <div class="uk-alert-warning uk-text-center">
                {errorMessage}
            </div>
        {/if}
    </fieldset>
</div>
