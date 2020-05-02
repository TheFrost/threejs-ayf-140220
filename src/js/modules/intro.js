import { TweenMax } from 'gsap'
import { pubsub } from '../utils/tools'

export default class Intro {
  constructor () {
    this.DOM = {
      intro: document.querySelector('.intro'),
      rows: [...document.querySelectorAll('.intro__row')]
    }
  }

  init () {
    this.setupState()
    this.bindEvents()
  }

  setupState () {
    const { rows } = this.DOM
    TweenMax.set(rows, { y: '100%' })
  }

  bindEvents () {
    pubsub.suscribe('action:play', () => this.playLeave())
    pubsub.suscribe('action:reload', () => this.reloadHandler())
    pubsub.suscribe('canvas:translatetocentercomplete', () => this.triggerFinal())
    pubsub.suscribe('webgl:entrycomplete', isFirstEntry => {
      if (isFirstEntry) this.playEntry()
    })
  }

  triggerFinal () {
    const { intro } = this.DOM

    intro.classList.remove('entry')
    intro.classList.add('final')

    this.playEntry()
  }

  reloadHandler () {
    this.playLeave()
      .eventCallback('onComplete', () => this.resetIntro())
  }

  resetIntro () {
    const { intro } = this.DOM

    intro.classList.remove('final')
    intro.classList.add('entry')
  }

  playEntry () {
    const { rows } = this.DOM

    TweenMax.staggerTo(rows, 2, {
      y: 0,
      ease: 'Expo.easeOut'
    }, 0.1)
  }

  playLeave () {
    const { rows } = this.DOM

    return TweenMax.staggerTo(rows, 1, {
      y: '100%',
      ease: 'Expo.easeIn'
    }, -0.1)
  }
}
