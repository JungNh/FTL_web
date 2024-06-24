declare namespace StylesScssNamespace {
  export interface IStylesScss {
    active: string
    btn__options: string
    button__back: string
    child_second_lession: string
    'course__general--info': string
    course__name: string
    course__note: string
    course__progress: string
    course__status: string
    course__tag: string
    'courses__page--detail': string
    dot: string
    good: string
    greate: string
    item__child: string
    item__lesson: string
    item__list: string
    item__wrap: string
    lesson__des: string
    lesson__index: string
    lesson__title: string
    logo__container: string
    logo__subtitle: string
    logo__title: string
    'logo__title--text': string
    'logo__title--time': string
    nav__container: string
    not__active: string
    not__done: string
    not__yet: string
    overlay: string
    part__list: string
    part__title: string
    'part__title--wrapper': string
    progess__line: string
    sub__comment: string
    tab__QA: string
    tab__document: string
    tab__general: string
    tab__lesson: string
    tab__note: string
    tag__container: string
    text__info: string
    text__title: string
    yellow__color: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
