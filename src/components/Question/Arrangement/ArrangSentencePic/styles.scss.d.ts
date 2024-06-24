declare namespace StylesScssNamespace {
  export interface IStylesScss {
    answer__box: string
    answer_btn: string
    answers__section: string
    background__text: string
    button__back: string
    correct: string
    'd-hidden': string
    error: string
    'lession__translate--sentence': string
    main__question: string
    placeHolder__text: string
    'question_text-holder': string
    subTitle__lession: string
    title__lession: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
