import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SessionService } from 'src/services/session.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isAccountCreation: boolean
  actionText: string
  secondaryActionText: string
  errorMessage?: string

  name = ''
  email = ''
  password = ''

  @Output()
  successfulLogin = new EventEmitter<void>()

  constructor(private sessionService: SessionService, private userService: UserService) {
    this.isAccountCreation = false
    this.switchToLogin()
  }

  ngOnInit(): void { }

  onSwitch() {
    if (this.isAccountCreation) {
      this.isAccountCreation = false
      return this.switchToLogin()
    }
    this.isAccountCreation = true
    return this.switchToAccountCreation()
  }

  async onConfirm() {
    this.errorMessage = null
    if (this.isAccountCreation) {
      try {
        await this.createAccount()
      } catch (error) {
        this.errorMessage = error.message
        return
      }
    }

    try {
      await this.login()
    } catch (error) {
      this.errorMessage = error.message
    }
  }

  private async login() {
    const token = await this.sessionService.create(this.email, this.password)
    this.successfulLogin.emit()
  }

  private async createAccount() {
    const user = await this.userService.create(this.name, this.email, this.password)
  }

  private switchToAccountCreation() {
    this.actionText = "CREATE ACCOUNT"
    this.secondaryActionText = "Go to login"
  }

  private switchToLogin() {
    this.actionText = "LOGIN"
    this.secondaryActionText = "I don't have an account"
  }

}
