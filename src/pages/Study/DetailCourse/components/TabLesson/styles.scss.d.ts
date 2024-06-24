declare namespace StylesScssNamespace {
  export interface IStylesScss {
    item__child: string
    item__lesson: string
    lesson__des: string
    lesson__title: string
    part__title: string
    'part__title--wrapper': string
    tab__lesson: string
    score__btn: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
