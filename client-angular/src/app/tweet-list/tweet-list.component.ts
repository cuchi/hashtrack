import { Component, OnInit } from '@angular/core';
import { Tweet, TweetService } from 'src/services/tweet.service';

@Component({
  selector: 'app-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.scss']
})
export class TweetListComponent implements OnInit {

  debounceTimeout = 500
  debounce?: any
  search = ''
  tweets?: Tweet[]

  constructor(
    private tweetService: TweetService
  ) { }

  ngOnInit(): void {
    this.refreshTweets()
  }

  async refreshTweets() {
    this.tweets = await this.tweetService.getLatest(this.search)
    this.tweetService.listen(this.search, tweet => {
      this.tweets = [tweet, ...this.tweets].slice(0, 50)
    })
  }

  async searchTweets() {
    clearTimeout(this.debounce)
    this.debounce = setTimeout(() => { this.refreshTweets() }, this.debounceTimeout)
  }
}
