<script>
    import EmptyStateCard from './EmptyStateCard.svelte'
    import { getTracks, createTrack } from './lib/track'

    let tracks
    let hashtagName
    refreshTracks()

    const suggestions = [
        '#Svelte', '#NodeJs', '#TypeScript', '#Terraform', '#NPM', '#RollupJS',
        '@FullStack', '#PostgreSQL'
    ]
    const selectedSuggestion = suggestions[
        Math.floor(Math.random() * suggestions.length)
    ]

    async function refreshTracks() {
        tracks = await getTracks()
    }

    async function track() {
        const createdtrack = await createTrack(hashtagName)
        // Insert ordered into tracks
    }
</script>

<div class="uk-margin" uk-margin>
    <input 
        class="uk-input uk-form-width-medium" 
        placeholder="{selectedSuggestion}"
        type="text"
        bind:value={hashtagName}>
    <button 
        class="uk-button uk-button-default"
        on:click={track}
        disabled={!hashtagName}>
        Track
    </button>
</div>

{#if !tracks}
    <EmptyStateCard>Loading...</EmptyStateCard>
{:else if tracks.length === 0}
    <EmptyStateCard>
        You are not tracking any hashtags at the moment...
    </EmptyStateCard>
{:else}
    {#each tracks as track (track.hashtagName)}
        {track.hashtagName}
    {/each}
{/if}
