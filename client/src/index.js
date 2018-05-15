import init from './main'

document.addEventListener(
  'DOMContentLoaded',
  function() {
    if (BABYLON.Engine.isSupported()) {
      init()
    }
  },
  false
)
