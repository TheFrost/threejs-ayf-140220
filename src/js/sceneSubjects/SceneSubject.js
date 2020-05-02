import * as THREE from 'three'
import Guify from 'guify'
import { TweenMax } from 'gsap'
import { textureLoader, pubsub } from '../utils/tools'

// shaders
import vertexShader from '../../shaders/vertexShader.glsl'
import fragmentShader from '../../shaders/fragmentShader.glsl'

// assets
import texture from '../../assets/marmol.jpg'

export default class SceneSubject {
  constructor (scene) {
    this.numControls = 6
    this.stepUniforms = Array.from(Array(this.numControls)).map(() => ({ value: 0 }))

    this.uniformsEntry = {
      opacity: 0,
      scale: 0.7
    }

    const geometry = new THREE.SphereBufferGeometry(15, 32, 32)
    const material = new THREE.ShaderMaterial({
      wireframe: true,
      transparent: true,
      uniforms: {
        texture: {
          type: 't',
          value: textureLoader.load(texture)
        },
        time: {
          type: 'f',
          value: 0.0
        },
        opacity: {
          type: 'f',
          value: this.uniformsEntry.opacity
        },
        scaleEntry: {
          type: 'f',
          value: this.uniformsEntry.scale
        },
        step1control: {
          type: 'f',
          value: this.stepUniforms[0].value
        },
        step2control: {
          type: 'f',
          value: this.stepUniforms[1].value
        },
        step3control: {
          type: 'f',
          value: this.stepUniforms[2].value
        },
        step4control: {
          type: 'f',
          value: this.stepUniforms[3].value
        },
        step5control: {
          type: 'f',
          value: this.stepUniforms[4].value
        },
        step6control: {
          type: 'f',
          value: this.stepUniforms[5].value
        }
      },
      vertexShader,
      fragmentShader
    })

    this.mesh = new THREE.Mesh(geometry, material)

    scene.add(this.mesh)

    this.isFirstEntry = true

    // this.buildGuiControls()
    this.bindEvents()
  }

  bindEvents () {
    pubsub.suscribe('action:reload', () => this.reloadHandler())
    pubsub.suscribe('letters:step', step => this.playStep(step))
  }

  playStep (step) {
    const localStep = step - 1

    if (localStep === 0) {
      this.play('leave')
        .eventCallback('onComplete', () => {
          this.setWireframeState(false)
          this.play('entry')
        })

      return
    }

    const uniform = `step${localStep}control`

    TweenMax.to(this.stepUniforms[localStep - 1], 2, {
      value: 1,
      ease: 'Expo.easeInOut'
    })
      .eventCallback('onUpdate', () => {
        this.mesh.material.uniforms[uniform].value = this.stepUniforms[localStep - 1].value
      })
  }

  reloadHandler () {
    this.play('leave')
      .eventCallback('onComplete', () => {
        this.setWireframeState(true)
        this.resetStepUniforms()
        this.isFirstEntry = true
        this.play('entry')
      })
  }

  resetStepUniforms () {
    this.stepUniforms.map((uniform, i) => {
      uniform.value = 0
      this.mesh.material.uniforms[`step${i + 1}control`].value = uniform.value
      return uniform
    })
  }

  setWireframeState (action) {
    this.mesh.material.wireframe = action
  }

  update (_, time) {
    this.mesh.material.uniforms.time.value = time
  }

  play (action) {
    const values = {
      entryOpacity: 1,
      entryScale: 1,
      entryTime: 2,
      entryEase: 'InOut',
      leaveOpacity: 0,
      leaveScale: 0.7,
      leaveTime: 1,
      leaveEase: 'In'
    }

    return TweenMax.to(this.uniforms, values[`${action}Time`], {
      opacity: values[`${action}Opacity`],
      scaleEntry: values[`${action}Scale`],
      ease: `Expo.ease${values[`${action}Ease`]}`
    })
      .eventCallback('onUpdate', () => {
        this.mesh.material.uniforms.opacity.value = this.uniformsEntry.opacity
        this.mesh.material.uniforms.scaleEntry.value = this.uniformsEntry.scale
      })
      .eventCallback('onComplete', () => {
        pubsub.publish(`webgl:${action}complete`, this.isFirstEntry)
        if (this.isFirstEntry) this.isFirstEntry = false
      })
  }

  buildGuiControls () {
    const gui = new Guify({
      root: document.body,
      align: 'right',
      open: false
    })

    for (let i = 1; i <= 6; i++) {
      gui.Register({
        type: 'range',
        min: 0,
        max: 1,
        label: `Step ${i} Control`,
        object: this.uniforms[`step${i}control`],
        property: 'value',
        onChange: () => {
          this.mesh.material.uniforms[`step${i}control`].value = this.uniforms[`step${i}control`].value
        }
      })
    }
  }
}
