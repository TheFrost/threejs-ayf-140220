import { pubsub } from '../utils/tools'

export default class Audio {
  constructor () {
    this.DOM = {
      audio: document.querySelector('.audio')
    }
  }

  init () {
    this.bindEvents()
  }

  bindEvents () {
    pubsub.suscribe('action:play', () => this.playHandler())
  }

  playHandler () {
    this.DOM.audio.play()
  }
}
