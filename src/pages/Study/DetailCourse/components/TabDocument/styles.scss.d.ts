declare namespace StylesScssNamespace {
  export interface IStylesScss {
    part__list: string
    tab__document: string
    text__info: string
    text__title: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
