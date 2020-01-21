<script>
    import { format, register } from 'timeago.js'

    export let id
    export let text
    export let authorName
    export let publishedAt

    const localeFunc = (number, index, totalSec) => {
        return [
            ['just now', 'right now'],
            ['< 1 minute', 'in %s seconds'],
            ['1 minute ago', 'in 1 minute'],
            ['%s minutes ago', 'in %s minutes'],
            ['1 hour ago', 'in 1 hour'],
            ['%s hours ago', 'in %s hours'],
            ['1 day ago', 'in 1 day'],
            ['%s days ago', 'in %s days'],
            ['1 week ago', 'in 1 week'],
            ['%s weeks ago', 'in %s weeks'],
            ['1 month ago', 'in 1 month'],
            ['%s months ago', 'in %s months'],
            ['1 year ago', 'in 1 year'],
            ['%s years ago', 'in %s years']
        ][index];
    }
    register('en_US', localeFunc)
    
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