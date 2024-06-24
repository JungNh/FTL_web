declare namespace StylesScssNamespace {
  export interface IStylesScss {
    FREE: string
    OPEN: string
    VIP: string
    'alice-carousel': string
    'alice-carousel__dots': string
    allCourses__page: string
    bannerHome: string
     btn__left: string
     btn__left__prev:string
    btn__right: string
    button__back: string
    carousel__wrapper: string
    content__item: string
    disabled: string
    english__child: string
    flag__vip: string
    homePage: string
    ico__next: string
    ico__prev: string
    image__baner: string
    image__course: string
    item__baner: string
    item__course: string
    'item__course--wrapper': string
    link__child: string
    list__course: string
    list__first: string
    tag__image: string
    tag__item: string
    tag__text: string
    text__course: string
    title__child: string
    support__btn: string
    'content-rules': string
    'list-ranking': string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
