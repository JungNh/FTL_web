declare namespace StylesScssNamespace {
  export interface IStylesScss {
    has__error: string
    input__textarea__component: string
    'resize-none': string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
