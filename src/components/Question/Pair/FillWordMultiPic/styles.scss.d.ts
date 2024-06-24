declare namespace StylesScssNamespace {
  export interface IStylesScss {
    button__back: string
    card__question: string
    image__text: string
    lession__fillWordMultiPic: string
    question__holder: string
    span__with__text: string
    subTitle__lession: string
    title__lession: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
