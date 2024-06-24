declare namespace StylesScssNamespace {
  export interface IStylesScss {
    'bg-success': string
    btn_date: string
    chart__graph: string
    down: string
    info__bottom: string
    info__card: string
    info__number: string
    info__percent: string
    info__top: string
    info__type: string
    info__updown: string
    lession__text: string
    progress__bar: string
    progress__lession: string
    progress__page: string
    progress__title: string
    section__wrap: string
    time__text: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
