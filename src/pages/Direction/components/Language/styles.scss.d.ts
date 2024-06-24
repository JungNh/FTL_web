declare namespace StylesScssNamespace {
  export interface IStylesScss {
    btn__options: string
    direction__page: string
    'fade-enter': string
    'fade-enter-active': string
    'fade-exit': string
    'fade-exit-active': string
    image__flag: string
    image__holder: string
    image__language: string
    language__section: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
