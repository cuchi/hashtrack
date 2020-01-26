<script>
    import TweetCard from './TweetCard.svelte'
    import SearchIcon from './icons/SearchIcon.svelte'
    import EmptyStateCard from './EmptyStateCard.svelte'
    import { getTweets, listenTweets } from './lib/tweet'
    import { tweetSubscriber } from './stores.js'
    
    const debounceTimeout = 500
    const maxListSize = 50
    let tweets
    let debounce
    let search = ''

    refreshTweets()

    async function refreshTweets() {
        tweets = await getTweets(search)
        tweetSubscriber.update(refreshSubscriber)
    }

    async function refreshSubscriber(oldSubscriber) {
        const subscriber = await oldSubscriber
        if (subscriber) {
            subscriber.unsubscribe()
        }
        return listenTweets(search, tweet => {
            tweets = [tweet, ...tweets].slice(0, maxListSize)
        })
    }

    async function searchTweets() {
        clearTimeout(debounce)
        debounce = setTimeout(() => { refreshTweets() }, debounceTimeout)
    }
</script>

<div class="uk-margin uk-inline">
    <SearchIcon />
    <input
        class="uk-input uk-form-width-medium"
        bind:value={search}
        on:input={searchTweets}/>
</div>

{#if !tweets}
    <EmptyStateCard>Loading...</EmptyStateCard>
{:else if tweets.length === 0}
    <EmptyStateCard>
        No tweets to display, try including a new hashtag
    </EmptyStateCard>
{:else}
    {#each tweets as tweet (tweet.id)}
        <TweetCard {...tweet} />
    {/each}
{/if}
