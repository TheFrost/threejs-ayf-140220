import { TweenMax } from 'gsap'
import { pubsub } from '../utils/tools'

export default class Action {
  constructor () {
    this.DOM = {
      actionControl: document.querySelector('.action')
    }
  }

  init () {
    this.setupState()
    this.bindEvents()
  }

  setupState () {
    const { actionControl } = this.DOM
    TweenMax.set(actionControl, { y: '-125%' })
  }

  bindEvents () {
    const { actionControl } = this.DOM

    actionControl.addEventListener('click', () => this.actionHandler())
    pubsub.suscribe('letters:end', () => this.triggerChangeActionTo('reload'))
    pubsub.suscribe('webgl:entrycomplete', isFirstEntry => {
      if (isFirstEntry) this.play('show')
    })
  }

  actionHandler () {
    const { actionControl } = this.DOM
    const { actionType } = actionControl.dataset

    pubsub.publish(`action:${actionType}`)

    if (actionType === 'play') this.triggerChangeActionTo('next')
    if (actionType === 'reload') this.triggerChangeActionTo('play')
  }

  triggerChangeActionTo (action) {
    const { actionControl } = this.DOM

    this.play('hide')
      .eventCallback('onComplete', () => {
        actionControl.setAttribute('data-action-type', action)
        this.play('show')
      })
  }

  play (action) { // show | hide
    const { actionControl } = this.DOM
    const values = {
      show: 0,
      showEase: 'Out',
      showTime: 2,
      hide: '-125%',
      hideEase: 'In',
      hideTime: 1
    }

    return TweenMax.to(actionControl, values[`${action}Time`], {
      y: values[action],
      ease: `Expo.ease${values[`${action}Ease`]}`
    })
  }
}
