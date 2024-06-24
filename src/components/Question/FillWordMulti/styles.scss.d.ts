declare namespace StylesScssNamespace {
  export interface IStylesScss {
    button__back: string
    lession__fillWordMulti: string
    question__holder: string
    subTitle__lession: string
    title__lession: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
