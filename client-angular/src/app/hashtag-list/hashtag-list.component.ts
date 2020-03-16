import { Component, OnInit } from '@angular/core';
import { TrackService, Track } from 'src/services/track.service';

@Component({
  selector: 'app-hashtag-list',
  templateUrl: './hashtag-list.component.html',
  styleUrls: ['./hashtag-list.component.scss']
})
export class HashtagListComponent implements OnInit {

  hashtagName = ''
  selectedSuggestion: string
  tracks?: Track[]

  constructor(
    private trackService: TrackService
  ) {
    const suggestions = [
      '#Svelte', '#NodeJs', '#TypeScript', '#Terraform', '#NPM', '#RollupJS',
      '#FullStack', '#PostgreSQL'
    ]
    this.selectedSuggestion = suggestions[
      Math.floor(Math.random() * suggestions.length)
    ]
  }

  ngOnInit(): void {
    this.getTracks()
  }

  async getTracks() {
    this.tracks = await this.trackService.getAll()
  }

  async track() {
    const track = await this.trackService.create(this.hashtagName)
    this.tracks?.push(track)
  }

  async untrack(name: string) {
    const removedTrack = await this.trackService.remove(name)
    this.tracks = this.tracks
      ?.filter(track => track.hashtagName !== removedTrack.hashtagName)
  }

}
