import { TweenMax } from 'gsap'
import { pubsub } from '../utils/tools'
import { letters } from '../resources/letters'

export default class Letters {
  constructor () {
    this.DOM = {
      container: document.querySelector('.letters'),
      letter: document.querySelector('.letters__text')
    }

    this.step = 0
  }

  init () {
    this.setupState()
    this.bindEvents()
  }

  setupState () {
    const { container } = this.DOM
    TweenMax.set(container, {
      y: 50,
      opacity: 0
    })
  }

  bindEvents () {
    pubsub.suscribe('canvas:translatetosidecomplete', () => this.play('entry'))
    pubsub.suscribe('action:next', () => this.playNext())
    pubsub.suscribe('action:reload', () => this.resetLetters())
  }

  resetLetters () {
    this.step = 0
    this.setNextLetter()
  }

  playNext () {
    this.play('leave')
      .eventCallback('onComplete', () => {
        if (this.step < letters.length - 1) {
          this.step += 1
          this.setNextLetter()
          this.play('entry')
          pubsub.publish('letters:step', this.step)
        } else {
          pubsub.publish('letters:end')
        }
      })
  }

  setNextLetter () {
    const { letter } = this.DOM
    letter.textContent = letters[this.step]
  }

  play (action) {
    const { container } = this.DOM
    const values = {
      entryY: 0,
      entryOpacity: 1,
      entryTime: 2,
      entryEase: 'InOut',
      leaveY: 10,
      leaveOpacity: 0,
      leaveTime: 1,
      leaveEase: 'In'
    }

    return TweenMax.to(container, values[`${action}Time`], {
      opacity: values[`${action}Opacity`],
      y: values[`${action}Y`]
    })
  }
}
