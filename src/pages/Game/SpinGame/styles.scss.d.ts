declare namespace StylesScssNamespace {
  export interface IStylesScss {
    'again-container-text': string
    'again-game': string
    'again-text': string
    'answer-animation': string
    'answer-border': string
    'answer-spin': string
    'back-button': string
    'box-finish-summary': string
    'box-summary-spin': string
    box__border: string
    'button-spin': string
    'chat-game': string
    'chat-text-game': string
    'container-again': string
    'container-anwsers': string
    'container-chat-game': string
    'container-correct-game-spin': string
    'container-game': string
    'container-point-game': string
    'container-result-game': string
    'container-spin-answer': string
    'container-spin-answer__left': string
    'container-spin-answer__right': string
    'container-spinner': string
    'continue-game': string
    'correct-answer': string
    correct__box: string
    effect__scale: string
    'font-text': string
    'game-background-logo': string
    'game-button': string
    'game-logo': string
    'game-spinner': string
    'game-spinner-btn': string
    'header-game': string
    heart__icon: string
    high__light: string
    'icon-incorrect-game': string
    'image-box-summary': string
    'incorrect-game': string
    'left-chat-game': string
    light: string
    lightUp: string
    light_1: string
    light_10: string
    light_11: string
    light_2: string
    light_3: string
    light_4: string
    light_5: string
    light_6: string
    light_7: string
    light_8: string
    light_9: string
    'lucky-item': string
    popup: string
    'result-game': string
    'result-game-spin': string
    'result-image-game': string
    'result-text-game': string
    results__container: string
    scaleUp: string
    'sound-game': string
    'sound-result-game': string
    spin__game: string
    'start-button': string
    'summary-text': string
    'table-summary-spin': string
    'text-box-summary': string
    'text-exp': string
    'text-spinner': string
    'user-drag--none': string
    'user-select--none': string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
