<script>
    import EmptyStateCard from './EmptyStateCard.svelte'
    import { getTracks, createTrack, removeTrack } from './lib/track'

    let tracks
    let hashtagName
    refreshTracks()

    const suggestions = [
        '#Svelte', '#NodeJs', '#TypeScript', '#Terraform', '#NPM', '#RollupJS',
        '#FullStack', '#PostgreSQL'
    ]
    const selectedSuggestion = suggestions[
        Math.floor(Math.random() * suggestions.length)
    ]

    async function refreshTracks() {
        tracks = await getTracks()
    }

    async function track() {
        const name = hashtagName
        hashtagName = ''
        const createdTrack = await createTrack(name)
        tracks = [...tracks, createdTrack]
    }

    async function untrack(name) {
        await removeTrack(name)
        tracks = tracks.filter(({ hashtagName }) => hashtagName !== name)
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
    <div class="uk-flex uk-flex-wrap uk-flex-wrap-around">
        {#each tracks as track (track.hashtagName)}
            <div 
                class="uk-card uk-card-default uk-card-body uk-card-small card"
                on:click={() => untrack(track.hashtagName)}>
                {track.prettyName}
            </div>
        {/each}
    </div>
{/if}

<style>
    .card {
        margin: 0.1em;
    }
    .card:hover {
        text-decoration: line-through;
        opacity: 0.5;
        transition: opacity 0.1s ease-in-out;
        cursor: pointer;
    }
</style>