declare namespace StylesScssNamespace {
  export interface IStylesScss {
    direction__page: string
    learn__section: string
    options__purpose: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
