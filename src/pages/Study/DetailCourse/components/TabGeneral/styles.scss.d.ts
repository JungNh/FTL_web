declare namespace StylesScssNamespace {
  export interface IStylesScss {
    good: string
    greate: string
    lesson__index: string
    not__active: string
    not__done: string
    not__yet: string
    part__list: string
    part__title: string
    tab__general: string
    text__info: string
    text__title: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
