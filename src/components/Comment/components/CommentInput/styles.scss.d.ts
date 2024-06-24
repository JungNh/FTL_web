declare namespace StylesScssNamespace {
  export interface IStylesScss {
    avata__holder: string
    'comment__component--input': string
    'comment__input-custom': string
    'host__input--container': string
    host__text: string
    small__avata: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
