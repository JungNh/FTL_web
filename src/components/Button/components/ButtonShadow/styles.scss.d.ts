declare namespace StylesScssNamespace {
  export interface IStylesScss {
    answer_btn: string
    'btn-blue': string
    'btn-gray': string
    'btn-malibu': string
    btn__small: string
    button__shadow: string
    upperCase: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
