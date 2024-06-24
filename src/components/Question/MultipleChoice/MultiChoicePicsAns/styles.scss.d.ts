declare namespace StylesScssNamespace {
  export interface IStylesScss {
    active: string
    answer_0: string
    answer_2: string
    answers__section: string
    'bg-success': string
    button__back: string
    card__lession: string
    image__text: string
    lession__correctVocabulary: string
    progress__time: string
    subTitle__lession: string
    title__lession: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
