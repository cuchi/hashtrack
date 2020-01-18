<script>
    import { createEventDispatcher } from 'svelte'
    import UserIcon from "./icons/UserIcon.svelte"
    import LockIcon from "./icons/LockIcon.svelte"
    import MailIcon from "./icons/MailIcon.svelte"
    import { createSession } from './lib/session'
    import { createUser } from './lib/user'
    import { fade } from 'svelte/transition'

    let name
    let email
    let password
    let errorMessage
    let isAccountCreation = false

    const dispatch = createEventDispatcher()

    function verifyFields() {
        const ensureExists = (field, name) => {
            if (!field) {
                throw new Error(`The field ${name} is required!`)
            }
        }
            
        if (isAccountCreation) {
            ensureExists(name, 'name')
        }
        ensureExists(email, 'email')
        ensureExists(password, 'password')
    }

    async function onConfirm() {
        errorMessage = undefined
        try {
            verifyFields()
            if (isAccountCreation) {
                await createUser(name, email, password)
            }   
            const session = await createSession(email, password)
            dispatch('sessionCreated', session)
        } catch (error) {
            errorMessage = error.message
        }
    }

    function onSwitch() {
        isAccountCreation = !isAccountCreation
        errorMessage = undefined
    }
</script>

<div class="uk-width-medium uk-padding-small">
    <fieldset class="uk-fieldset" in:fade>
        {#if isAccountCreation}
            <div class="uk-margin-small" in:fade>
                <div class="uk-inline uk-width-1-1">
                    <UserIcon />
                    <input
                        class="uk-input uk-border-pill"
                        placeholder="Name"
                        type="text"
                        bind:value={name} />
                </div>
            </div>
        {/if}
        <div class="uk-margin-small">
            <div class="uk-inline uk-width-1-1">
                <MailIcon />
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
                on:click={onConfirm}
                class="uk-button uk-button-primary uk-width-1-1">
                {#if isAccountCreation}
                    CREATE ACCOUNT
                {:else}
                    LOG IN
                {/if}
            </button>
        </div>
        <div class="uk-text-center uk-margin-bottom">
            <a 
                href="javascript:void(0);"
                on:click={onSwitch}
                class="uk-link-muted uk-width-1-1">
                {#if isAccountCreation}
                    Go to login
                {:else}
                    I don't have an account
                {/if}
            </a>
        </div>
        {#if errorMessage}
            <div class="uk-alert-warning uk-text-center" in:fade>
                {errorMessage}
            </div>
        {/if}
    </fieldset>
</div>
