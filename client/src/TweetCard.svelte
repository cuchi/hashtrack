<script>
    import { formatRelative } from 'date-fns'

    export let id
    export let text
    export let authorName
    export let publishedAt

    let relativeDate = formatRelative(new Date(publishedAt), new Date())

    setInterval(() => {
        relativeDate = formatRelative(new Date(publishedAt), new Date())
    }, 10000);

    function open() {
        window.open(`https://twitter.com/${authorName}/status/${id}`, '_blank')
    }
</script>

<div 
    class="uk-card uk-card-default uk-card-body uk-margin-bottom uk-card-hover"
    on:click={open}>
    <p>
        <b>@{authorName}</b> 
        - {text} <span class="uk-badge">{relativeDate}</span>
    </p>
</div>
