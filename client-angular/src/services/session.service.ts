import { Injectable } from '@angular/core';
import { createSession } from '../lib/session'

@Injectable({ providedIn: 'root' })
export class SessionService {
  async create(email: string, password: string) {
    const { token } = await createSession(email, password)
    localStorage.setItem('token', token)
    return token
  }

  destroy() {
    localStorage.removeItem('token')
  }
}
