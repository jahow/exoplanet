export enum KeyCode {
  ENTER = 13,
  UP = 38,
  DOWN = 40,
  LEFT = 37,
  RIGHT = 39,
  ESCAPE = 27,
  SPACE = 32,
  CTRL = 17,
  ALT = 18,
  TAB = 9,
  SHIFT = 16,
  CAPSLOCK = 20,
  BACKSPACE = 8,
  HOME = 36,
  END = 35,
  INS = 45,
  DEL = 46,
  PGUP = 33,
  PGDOWN = 34,
  F1 = 112,
  F2 = 113,
  F3 = 114,
  F4 = 115,
  F5 = 116,
  F6 = 117,
  F7 = 118,
  F8 = 119,
  F9 = 120,
  F10 = 121,
  F11 = 122,
  F12 = 123
}

enum KeyState {
  RELEASED,
  PRESSED
}
interface GlobalInputState {
  keyboard: {[key: string]: KeyState},
  pointer: any
}
const inputState: GlobalInputState = {
  keyboard: {},
  pointer: {}
}

export function initInput() {
  // bind events
  window.addEventListener('keydown', evt => {
    inputState.keyboard[evt.keyCode] = KeyState.PRESSED
  })
  window.addEventListener('keyup', evt => {
    inputState.keyboard[evt.keyCode] = KeyState.RELEASED
  })
}

export function updateInputState() {
  // Object.keys(inputState.keyboard).forEach(key => {
  //  inputState.keyboard[key] = KeyState.RELEASED
  // })
}

export function isKeyPressed(keyCode: KeyCode) {
  return inputState.keyboard[keyCode] === KeyState.PRESSED
}