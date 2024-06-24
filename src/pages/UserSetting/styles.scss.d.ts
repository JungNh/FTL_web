declare namespace StylesScssNamespace {
  export interface IStylesScss {
    account__wrap: string
    active: string
    avata_holder: string
    'avata_holder--upload': string
    avatar__holder: string
    'bg-success': string
    blue: string
    'btn--edit': string
    btn__next: string
    btn__password: string
    btn__prev: string
    btn__tutorial: string
    btn_date: string
    button__back: string
    button__chat: string
    button__info: string
    button__subAcc: string
    card__item: string
    'card__item--name': string
    'card__item--time': string
    card__item__bottom: string
    card__item__top: string
    card__wrapper: string
    chart__graph: string
    contact__link: string
    contact__row: string
    country_name: string
    custom__input: string
    'divider_horizontal-white': string
    dot: string
    down: string
    gold: string
    info__bottom: string
    info__card: string
    info__container: string
    info__number: string
    info__percent: string
    info__top: string
    info__type: string
    info__updown: string
    'item-main': string
    'item-sub': string
    item__outDate: string
    language__item: string
    lession__text: string
    progress__bar: string
    progress__lession: string
    progress__title: string
    section__wrap: string
    'sub__acc--item': string
    sub__status: string
    sub__text: string
    tab__contact: string
    tab__info: string
    tab__news: string
    tab__password: string
    tab__tutorial: string
    tab__wrap: string
    tab_card_active: string
    tab_my_acc: string
    tab_notification: string
    tab_parent_control: string
    tab_setting: string
    tab_study_route: string
    tab_sub_acc: string
    tag__text: string
    'text-link': string
    text__contact: string
    time__text: string
    title: string
    userSetting__page: string
    'userSetting_panel-left': string
    'userSetting_panel-right': string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
