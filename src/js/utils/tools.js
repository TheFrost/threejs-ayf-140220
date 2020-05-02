import * as THREE from 'three'
import Pubsub from './pubsub'

export const textureLoader = new THREE.TextureLoader()

/**
 * Pubsub pattern custom events
 */
export const pubsub = new Pubsub()
