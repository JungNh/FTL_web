declare namespace StylesScssNamespace {
  export interface IStylesScss {
    'again-container-text': string
    'again-game-fish': string
    'again-text': string
    'answer-animation': string
    'back-button': string
    'back__ground--1': string
    'back__ground--2': string
    'back__ground--3': string
    'back__ground--4': string
    blur: string
    'box-finish-summary-action': string
    'box-finish-summary-train': string
    'box-summary-train': string
    box__border: string
    box__end: string
    'chat-game': string
    'chat-text-game': string
    'container-again': string
    'container-chat-game': string
    'container-correct-game-train': string
    'container-game': string
    'container-point-game-train': string
    'container-result-game': string
    'continue-game': string
    'correct-answer': string
    correct__box: string
    disapear: string
    'font-text': string
    'game-answer-container': string
    'game-answer-train': string
    'game-answer-train-inside': string
    'game-button': string
    'game-logo': string
    'game-train-text': string
    'game-train-train': string
    game__background: string
    heart__container: string
    ico__smoke: string
    'ico__smoke--image': string
    'icon-incorrect-game': string
    'image-box-summary': string
    'incorrect-game': string
    'left-chat-game': string
    moveLeft: string
    'number-in-answer': string
    popup: string
    'result-game': string
    'result-image-game': string
    'result-text-game': string
    results__container: string
    shake: string
    'sound-game-train': string
    'sound-result-game': string
    'start-button': string
    start__game: string
    'summary-text': string
    'table-summary-train': string
    'text-box-summary': string
    'text-exp': string
    'train-contain': string
    'train-container': string
    'train-number': string
    'train-result': string
    'train-wheel': string
    train___game: string
    'user-drag--none': string
    'user-select--none': string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
