declare namespace StylesScssNamespace {
  export interface IStylesScss {
    'custom-control-input': string
    'custom-control-label': string
    custom__switch: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
