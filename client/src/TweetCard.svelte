<script>
    import { format } from './lib/timeago.js'

    export let id
    export let text
    export let authorName
    export let publishedAt
    
    let relativeDate = format(new Date(publishedAt), 'en_US')

    setInterval(() => {
        relativeDate = format(new Date(publishedAt), 'en_US')
    }, 1000);

    function open() {
        window.open(`https://twitter.com/${authorName}/status/${id}`, '_blank')
    }
</script>

<div 
    class="uk-card uk-card-default uk-card-body uk-margin-bottom uk-card-hover"
    on:click={open}>
    <p>
        <b>{authorName}</b> 
        - {text} 
        <span class="uk-text-small uk-text-muted uk-text-nowrap date-hint">
            {relativeDate}
        </span>
    </p>
</div>

<style>
    .uk-card:hover {
        cursor: pointer;
    }

    .date-hint {
        background-color: #EFEFEF;
        border-radius: 10px;
        padding: 3px;
        padding-left: 10px;
        padding-right: 10px;
    }
</style>