declare namespace StylesScssNamespace {
  export interface IStylesScss {
    activeSound: string
    answer__box: string
    answer_btn: string
    answers__section: string
    audioPlayer_custom: string
    'bg-success': string
    button__back: string
    correct: string
    'd-hidden': string
    effect__sound: string
    error: string
    fast__snail: string
    'lession__listen--sentenceOrder': string
    main__image: string
    'main__image--container': string
    main__question: string
    placeHolder__text: string
    progress__time: string
    'rhap_progress-bar': string
    'rhap_progress-container': string
    'rhap_progress-filled': string
    'rhap_progress-indicator': string
    'rhap_progress-section': string
    'snail-btn': string
    subTitle__lession: string
    title__lession: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
