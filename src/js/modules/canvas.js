import { TweenMax } from 'gsap'
import { pubsub } from '../utils/tools'

export default class Canvas {
  constructor () {
    this.DOM = {
      scene: document.querySelector('.webgl')
    }
  }

  init () {
    this.bindEvents()
  }

  bindEvents () {
    pubsub.suscribe('action:play', () => this.playTranslateToSide())
    pubsub.suscribe('letters:end', () => this.playTranslateToCenter())
  }

  playTranslateToSide () {
    const { scene } = this.DOM

    TweenMax.to(scene, 2, {
      x: '45%',
      ease: 'Expo.easeInOut'
    })
      .eventCallback('onComplete', () => {
        pubsub.publish('canvas:translatetosidecomplete')
      })
  }

  playTranslateToCenter () {
    const { scene } = this.DOM

    TweenMax.to(scene, 2, {
      x: '0%',
      ease: 'Expo.easeInOut'
    })
      .eventCallback('onComplete', () => {
        pubsub.publish('canvas:translatetocentercomplete')
      })
  }
}
