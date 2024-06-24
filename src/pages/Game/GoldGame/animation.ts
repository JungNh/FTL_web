export const animationBtnStart = [
  {
    scale: 1.1,
  },
]

/**
 * ROPE ANIMATION
 * */

export const aniRopeNorm = [
  {
    type: 'set' as 'set' | 'to' | 'from',
    transformOrigin: 'top',
    height: 25,
    rotate: -50,
  },
  {
    repeat: -1,
    duration: 2000,
    rotate: 50,
    yoyo: true,
  },
]
export const aniRope1 = [
  {
    rotate: 60,
    duration: 500,
  },
  {
    height: 400,
    duration: 2000,
  },
  {
    height: 25,
    duration: 2000,
  },
]
export const aniRope2 = [
  {
    rotate: 25,
    duration: 500,
  },
  {
    height: 300,
    duration: 2000,
  },
  {
    height: 25,
    duration: 2000,
  },
]
export const aniRope3 = [
  {
    rotate: -30,
    duration: 500,
  },
  {
    height: 300,
    duration: 2000,
  },
  {
    height: 25,
    duration: 2000,
  },
]
export const aniRope4 = [
  {
    rotate: -60,
    duration: 500,
  },
  {
    height: 450,
    duration: 2000,
  },
  {
    height: 25,
    duration: 2000,
  },
]
export const aniWrongRope1 = [
  {
    rotate: 60,
    duration: 500,
  },
  {
    height: 400,
    duration: 2000,
  },
  {
    height: 400,
    duration: 2000,
  },
]
export const aniWrongRope2 = [
  {
    rotate: 25,
    duration: 500,
  },
  {
    height: 300,
    duration: 2000,
  },
  {
    height: 300,
    duration: 2000,
  },
]
export const aniWrongRope3 = [
  {
    rotate: -30,
    duration: 500,
  },
  {
    height: 300,
    duration: 2000,
  },
  {
    height: 300,
    duration: 2000,
  },
]
export const aniWrongRope4 = [
  {
    rotate: -60,
    duration: 500,
  },
  {
    height: 450,
    duration: 2000,
  },
  {
    height: 450,
    duration: 2000,
  },
]

/**
 * HOOK ANIMATION
 * */
export const aniHookNorm = [
  {
    type: 'set' as 'set' | 'from' | 'to',
    paddingTop: 25,
    rotate: -50,
  },
  {
    rotate: 50,
    repeat: -1,
    yoyo: true,
    duration: 2000,
  },
]
export const aniHook1 = [
  {
    rotate: 60,
    duration: 500,
  },
  {
    paddingTop: 400,
    duration: 2000,
  },
  {
    paddingTop: 25,
    duration: 2000,
  },
]
export const aniHook2 = [
  {
    rotate: 25,
    duration: 500,
  },
  {
    paddingTop: 300,
    duration: 2000,
  },
  {
    paddingTop: 25,
    duration: 2000,
  },
]
export const aniHook3 = [
  {
    rotate: -30,
    duration: 500,
  },
  {
    paddingTop: 300,
    duration: 2000,
  },
  {
    paddingTop: 25,
    duration: 2000,
  },
]
export const aniHook4 = [
  {
    rotate: -60,
    duration: 500,
  },
  {
    paddingTop: 450,
    duration: 2000,
  },
  {
    paddingTop: 25,
    duration: 2000,
  },
]
export const aniWrongHook1 = [
  {
    rotate: 60,
    duration: 500,
  },
  {
    paddingTop: 400,
    duration: 2000,
  },
  {
    paddingTop: 400,
    duration: 2000,
  },
]
export const aniWrongHook2 = [
  {
    rotate: 25,
    duration: 500,
  },
  {
    paddingTop: 300,
    duration: 2000,
  },
  {
    paddingTop: 300,
    duration: 2000,
  },
]
export const aniWrongHook3 = [
  {
    rotate: -30,
    duration: 500,
  },
  {
    paddingTop: 300,
    duration: 2000,
  },
  {
    paddingTop: 300,
    duration: 2000,
  },
]
export const aniWrongHook4 = [
  {
    rotate: -60,
    duration: 500,
  },
  {
    paddingTop: 450,
    duration: 2000,
  },
  {
    paddingTop: 450,
    duration: 2000,
  },
]

/**
 * GOLD PIECE ANIMATION
 */
export const aniGoldNorm1 = [
  {
    type: 'set' as 'set',
    top: '30%',
    left: '50%',
    translateX: -500,
    duration: 0,
    yoyo: true,
  },
]
export const aniGoldNorm2 = [
  {
    type: 'set' as 'set',
    top: '40%',
    left: '50%',
    translateX: -250,
    duration: 0,
    yoyo: true,
  },
]
export const aniGoldNorm3 = [
  {
    type: 'set' as 'set',
    top: '40%',
    left: '50%',
    translateX: 50,
    duration: 0,
    yoyo: true,
  },
]
export const aniGoldNorm4 = [
  {
    type: 'set' as 'set',
    top: '30%',
    left: '50%',
    translateX: 300,
    duration: 0,
    yoyo: true,
  },
]
export const aniGold1 = (onComplete: () => void) => [
  {
    type: 'set' as 'set',
    top: '30%',
    left: '50%',
    translateX: -500,
  },
  {
    top: 0,
    translateX: -200,
    delay: 2500,
    duration: 2000,
    onComplete,
  },
]
export const aniGold2 = (onComplete: () => void) => [
  {
    type: 'set' as 'set',
    top: '40%',
    left: '50%',
    translateX: -250,
  },
  {
    top: 0,
    translateX: -150,
    delay: 2500,
    duration: 2000,
    onComplete: () => onComplete(),
  },
]
export const aniGold3 = (onComplete: () => void) => [
  {
    type: 'set' as 'set',
    top: '40%',
    left: '50%',
    translateX: 50,
  },
  {
    top: 0,
    translateX: -50,
    delay: 2500,
    duration: 2000,
    onComplete: () => onComplete(),
  },
]
export const aniGold4 = (onComplete: () => void) => [
  {
    type: 'set' as 'set',
    top: '30%',
    left: '50%',
    translateX: 300,
  },
  {
    top: 0,
    left: '50%',
    translateX: 0,
    delay: 2500,
    duration: 2000,
    onComplete: () => onComplete(),
  },
]
export const aniWrongGold1 = (onComplete: () => void) => [
  {
    type: 'set' as 'set',
    top: '30%',
    left: '50%',
    translateX: -500,
  },
  {
    delay: 2500,
    duration: 2000,
    onComplete,
  },
]
export const aniWrongGold2 = (onComplete: () => void) => [
  {
    type: 'set' as 'set',
    top: '40%',
    left: '50%',
    translateX: -250,
  },
  {
    delay: 2500,
    duration: 2000,
    onComplete: () => onComplete(),
  },
]
export const aniWrongGold3 = (onComplete: () => void) => [
  {
    type: 'set' as 'set',
    top: '40%',
    left: '50%',
    translateX: 50,
  },
  {
    delay: 2500,
    duration: 2000,
    onComplete: () => onComplete(),
  },
]
export const aniWrongGold4 = (onComplete: () => void) => [
  {
    type: 'set' as 'set',
    top: '30%',
    left: '50%',
    translateX: 300,
  },
  {
    delay: 2500,
    duration: 2000,
    onComplete: () => onComplete(),
  },
]
