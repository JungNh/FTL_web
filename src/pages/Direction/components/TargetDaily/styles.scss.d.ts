declare namespace StylesScssNamespace {
  export interface IStylesScss {
    active: string
    button__cancel: string
    button__oke: string
    button__subTitle: string
    button__title: string
    day__part: string
    direction__page: string
    main__text: string
    marathon__btn: string
    marathon__content: string
    'modal-content': string
    modal__time: string
    options__target: string
    options_btn: string
    sub__text: string
    target__btn: string
    target__section: string
    time__btn: string
    time__content: string
    time__section: string
    time__text: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
