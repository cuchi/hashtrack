import { register } from 'timeago.js'

register('en_US', (number, index, totalSec) => [
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
    ][index])

export { format } from 'timeago.js'