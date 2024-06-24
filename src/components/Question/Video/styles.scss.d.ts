declare namespace StylesScssNamespace {
  export interface IStylesScss {
    active: string
    button__back: string
    collapsed: string
    continue__btn: string
    custor: string
    ico__menu: string
    lession__title: string
    lession__video: string
    lesson__des: string
    lesson__title: string
    list__lesson: string
    menu__back: string
    menu__close: string
    parent__player: string
    part__title: string
    player__wrapper: string
    progess__line: string
    'react-player': string
    sideBar: string
    single__item: string
    text__process: string
    'text__process--percent': string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
