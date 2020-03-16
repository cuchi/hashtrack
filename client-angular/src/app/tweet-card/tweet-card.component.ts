import { Component, OnInit, Input } from '@angular/core';
import he from 'he'
import { format } from '../../lib/timeago'

@Component({
  selector: 'app-tweet-card',
  templateUrl: './tweet-card.component.html',
  styleUrls: ['./tweet-card.component.scss']
})
export class TweetCardComponent implements OnInit {

  @Input() authorName: string
  @Input() text: string
  @Input() publishedAt: string
  @Input() id: string
  decodedText: string
  relativeDate: string

  ngOnInit(): void {
    this.decodedText = he.decode(this.text)
    this.relativeDate = format(new Date(this.publishedAt), 'en_US')
    setInterval(() => {
      this.relativeDate = format(new Date(this.publishedAt), 'en_US')
    }, 10000);
  }

  open() {
    window.open(`https://twitter.com/${this.authorName}/status/${this.id}`, '_blank')
  }

}
