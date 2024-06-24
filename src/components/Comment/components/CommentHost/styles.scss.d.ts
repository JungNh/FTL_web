declare namespace StylesScssNamespace {
  export interface IStylesScss {
    action__item: string
    'action__item--icon': string
    avata__holder: string
    'comment__component--host': string
    comment__content: string
    host__name: string
    host__text: string
    host__time: string
    host__title: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
