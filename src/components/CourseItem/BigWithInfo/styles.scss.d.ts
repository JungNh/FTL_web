declare namespace StylesScssNamespace {
  export interface IStylesScss {
    'course__item--bigInfo': string
    'course__item--content': string
    'course__item--logo': string
    'course__item--text': string
    'course__item--title': string
    course__tag: string
    tag__container: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
