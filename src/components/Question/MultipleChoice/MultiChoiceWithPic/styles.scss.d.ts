declare namespace StylesScssNamespace {
  export interface IStylesScss {
    activeSound: string
    answers__section: string
    audioPlayer_custom: string
    'bg-success': string
    button__back: string
    card__lession: string
    image__text: string
    lession__translate: string
    main__question: string
    progress__time: string
    'rhap_progress-bar': string
    'rhap_progress-container': string
    'rhap_progress-filled': string
    'rhap_progress-indicator': string
    'rhap_progress-section': string
    subTitle__lession: string
    title__lession: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
