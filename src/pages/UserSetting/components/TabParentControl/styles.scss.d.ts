declare namespace StylesScssNamespace {
  export interface IStylesScss {
    avatar__holder: string
    'bg-success': string
    btn_date: string
    chart__graph: string
    dot: string
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
    progress__title: string
    section__wrap: string
    'sub__acc--item': string
    sub__status: string
    sub__text: string
    tab_parent_control: string
    time__text: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
