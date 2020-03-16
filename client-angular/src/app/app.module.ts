import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { BoardComponent } from './board/board.component';
import { TweetListComponent } from './tweet-list/tweet-list.component';
import { HashtagListComponent } from './hashtag-list/hashtag-list.component';
import { TweetCardComponent } from './tweet-card/tweet-card.component';
import { EmptyStateCardComponent } from './empty-state-card/empty-state-card.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BoardComponent,
    TweetListComponent,
    HashtagListComponent,
    TweetCardComponent,
    EmptyStateCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
