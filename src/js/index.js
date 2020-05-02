import SceneManager from './SceneManager'

// modules
import Intro from './modules/intro'
import Action from './modules/action'
import Audio from './modules/audio'
import Canvas from './modules/canvas'
import Letters from './modules/letters'
import Splash from './modules/splash'

// setup modules ans resources
const canvas = document.getElementById('canvas')
const sceneManager = new SceneManager(canvas)

// init modules
const intro = new Intro()
intro.init()

const action = new Action()
action.init()

const audio = new Audio()
audio.init()

const canvasScene = new Canvas()
canvasScene.init()

const letters = new Letters()
letters.init()

const splash = new Splash()

// logic
const resizeCanvas = () => {
  canvas.style.width = '100%'
  canvas.style.height = '100%'

  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight

  sceneManager.resizeHandler()
}

const bindEvents = () => {
  window.onresize = resizeCanvas
  window.onload = () => splash.playLeave()
  resizeCanvas()
}

const render = () => {
  window.requestAnimationFrame(render)
  sceneManager.update()
}

bindEvents()
render()
