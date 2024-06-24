declare namespace StylesScssNamespace {
  export interface IStylesScss {
    'again-container-text': string
    'again-game-fish': string
    'again-text': string
    'answer-animation': string
    'back-button': string
    bg1: string
    bg2: string
    'box-finish-summary': string
    'box-summary-fish': string
    'chat-game': string
    'chat-text-game': string
    'container-again': string
    'container-chat-game': string
    'container-correct-game-fish': string
    'container-game': string
    'container-point-game-fish': string
    'container-result-game': string
    'continue-game': string
    'correct-answer': string
    fish__game: string
    'font-text': string
    'game-answer': string
    'game-button': string
    'game-logo': string
    'header-game': string
    header__wrapper: string
    'heart-icon': string
    'icon-incorrect-game': string
    'image-box-summary': string
    'incorrect-game': string
    'left-chat-game': string
    popup: string
    'result-game': string
    'result-image-game': string
    'result-text-game': string
    results__container: string
    'sound-game-fish': string
    'sound-result-game': string
    'start-button': string
    'summary-text': string
    'table-summary-fish': string
    'text-box-summary': string
    'text-exp': string
    'user-drag--none': string
    'user-select--none': string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
