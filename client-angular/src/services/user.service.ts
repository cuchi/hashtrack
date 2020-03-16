import { Injectable } from '@angular/core';
import { createUser, getCurrentUser } from '../lib/user'

@Injectable({ providedIn: 'root' })
export class UserService {
  async create(name: string, email: string, password: string) {
    return createUser(name, email, password)
  }

  async getCurrent() {
      return getCurrentUser()
  }
}
