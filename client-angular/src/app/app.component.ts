import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'hashtrack'
  sessionStatus: string

  constructor(
    private userService: UserService, 
    private sessionService: SessionService
  ) {
    this.sessionStatus = 'pending'
  }

  ngOnInit() {
    this.checkStatus()
  }

  private async checkStatus() {
    try {
      await this.userService.getCurrent()
      this.sessionStatus = 'logged-in'
    } catch {
      this.sessionStatus = 'logged-out'
    }
  }

  onLogin() {
    this.sessionStatus = 'logged-in'
  }

  onLogout() {
    this.sessionService.destroy()
    this.sessionStatus = 'logged-out'
  }
}
