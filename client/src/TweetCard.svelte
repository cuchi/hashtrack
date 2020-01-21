<script>
    import { format } from 'timeago.js'

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
        <b>@{authorName}</b> 
        - {text} <span class="uk-text-muted">{relativeDate}</span>
    </p>
</div>
