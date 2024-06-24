declare namespace StylesScssNamespace {
  export interface IStylesScss {
    answer__box: string
    answer_btn: string
    answers__section: string
    button__back: string
    card__lession: string
    correct: string
    'd-hidden': string
    error: string
    image__text: string
    'lession__translate--order': string
    main__question: string
    subTitle__lession: string
    title__lession: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
