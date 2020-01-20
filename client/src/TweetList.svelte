<script>
    import TweetCard from './TweetCard.svelte'
    import EmptyStateCard from './EmptyStateCard.svelte'
    import { getTweets } from './lib/tweet'

    let tweets
    refreshTweets()

    async function refreshTweets() {
        tweets = await getTweets()
    }
</script>

{#if !tweets}
    <EmptyStateCard>Loading...</EmptyStateCard>
{:else if tweets.length === 0}
    <EmptyStateCard>
        No tweets to display, try including a hashtag
    </EmptyStateCard>
{:else}
    {#each tweets as tweet (tweet.id)}
        <TweetCard {...tweet} />
    {/each}
{/if}