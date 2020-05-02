import { TimelineMax } from 'gsap'
import { pubsub } from '../utils/tools'

export default class Splash {
  constructor () {
    this.DOM = {
      splash: document.querySelector('.splash'),
      chars: document.querySelectorAll('.splash__char')
    }
  }

  playLeave () {
    const { splash, chars } = this.DOM

    window.setTimeout(() => {
      new TimelineMax()
        .to(chars, 2, {
          y: '100%',
          ease: 'Expo.easeInOut'
        })
        .to(splash, 1, {
          autoAlpha: 0,
          ease: 'Expo.easeInOut'
        })
        .eventCallback('onComplete', () => {
          pubsub.publish('splash:leavecomplete')
        })
    }, 1000)
  }
}
