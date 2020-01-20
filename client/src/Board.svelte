<script>
    import { createEventDispatcher } from "svelte";
    import TweetList from "./TweetList.svelte";
    import HashtagList from "./HashtagList.svelte";

    let tab = 'tweets'

    const dispatch = createEventDispatcher();

    function onLogout() {
        dispatch("sessionDestroyed", { token: undefined });
    }

    function setTab(id) {
        tab = id
    }
</script>

<div class="uk-width-xlarge uk-margin-top">
    <nav class="uk-navbar-container" uk-navbar>
        <div class="uk-navbar-left">
            <ul class="uk-navbar-nav">
                <li class={tab === 'tweets' ? 'uk-active' : ''}>
                    <a 
                        href="javascript:void(0);"
                        on:click={() => setTab('tweets')}>
                        Tweets
                    </a>
                </li>
                <li class={tab === 'hashtags' ? 'uk-active' : ''}>
                    <a 
                        href="javascript:void(0);"
                        on:click={() => setTab('hashtags')}>
                        Hashstags
                    </a>
                </li>
            </ul>
        </div>
        <div class="uk-navbar-right">
            <ul class="uk-navbar-nav">
                <li>
                    <a 
                        href="javascript:void(0);"
                        on:click={onLogout}>
                        Logout
                    </a>
                </li>
            </ul>
        </div>
    </nav>
    {#if tab === 'tweets'}
        <TweetList/>
    {:else}
        <HashtagList/>
    {/if}
</div>
