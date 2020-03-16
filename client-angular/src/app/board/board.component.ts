import { Component, OnInit, Output, EventEmitter } from '@angular/core';

type BoardTab = 'tweets' | 'hashtags'

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html'
})
export class BoardComponent implements OnInit {

  tab: BoardTab
  
  @Output()
  logout = new EventEmitter<void>()

  constructor() {
    this.tab = 'tweets'
  }

  ngOnInit(): void {
  }

  setTab(tab: BoardTab) {
    this.tab = tab
  }

  onLogout() {
    this.logout.emit()
  }

}
