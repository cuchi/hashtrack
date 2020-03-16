import { Injectable } from '@angular/core';
import { createTrack, removeTrack, getTracks } from '../lib/track'

export type Track = {
    hashtagName: string
    prettyName: string
    createdAt: string
}

@Injectable({ providedIn: 'root' })
export class TrackService {
  async create(name: string): Promise<Track> {
    return createTrack(name)
  }

  async remove(name: string): Promise<Track> {
      return removeTrack(name)
  }

  async getAll(): Promise<Track[]> {
      return getTracks()
  }
}
