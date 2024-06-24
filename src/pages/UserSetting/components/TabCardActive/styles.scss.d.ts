declare namespace StylesScssNamespace {
  export interface IStylesScss {
    blue: string
    btn__next: string
    btn__prev: string
    card__item: string
    'card__item--name': string
    'card__item--time': string
    card__item__bottom: string
    card__item__top: string
    card__wrapper: string
    gold: string
    item__outDate: string
    tab_card_active: string
    title: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
