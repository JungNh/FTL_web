declare namespace StylesScssNamespace {
  export interface IStylesScss {
    button__back: string
    card__question: string
    div__with__text: string
    image__text: string
    lession__fillPic: string
    question__holder: string
    question__row: string
    title__lession: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
