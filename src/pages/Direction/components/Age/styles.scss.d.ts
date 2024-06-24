declare namespace StylesScssNamespace {
  export interface IStylesScss {
    age__section: string
    btn__options: string
    direction__page: string
    'fade-enter': string
    'fade-enter-active': string
    'fade-exit': string
    'fade-exit-active': string
    image__age: string
    image__holder: string
    select__age: string
    select__control: string
    'select__control--is-focused': string
    'select__indicator-separator': string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
