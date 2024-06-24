declare namespace StylesScssNamespace {
  export interface IStylesScss {
    'course__item--big': string
    'course__item--description': string
    'course__item--level': string
    'course__item--name': string
    'course__item--text': string
    description__container: string
    logo__course: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
