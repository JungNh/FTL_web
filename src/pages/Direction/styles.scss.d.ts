declare namespace StylesScssNamespace {
  export interface IStylesScss {
    active: string
    age__section: string
    btn__options: string
    button__back: string
    button__cancel: string
    button__oke: string
    button__subTitle: string
    button__title: string
    continue__btn: string
    day__part: string
    direction__page: string
    'fade-enter': string
    'fade-enter-active': string
    'fade-exit': string
    'fade-exit-active': string
    image__age: string
    image__flag: string
    image__holder: string
    image__language: string
    language__section: string
    learn__section: string
    level__section: string
    main__text: string
    marathon__btn: string
    marathon__content: string
    'modal-content': string
    modal__time: string
    options__purpose: string
    options__target: string
    options_btn: string
    progess__line: string
    progress__container: string
    'section--subTitle': string
    'section--title': string
    select__age: string
    select__control: string
    'select__control--is-focused': string
    'select__indicator-separator': string
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
