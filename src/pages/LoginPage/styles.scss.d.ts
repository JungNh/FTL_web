declare namespace StylesScssNamespace {
  export interface IStylesScss {
    auto__update: string
    avata__holder: string
    avata__image: string
    button__facebook: string
    button__google: string
    hidden_height: string
    label__form: string
    login__button: string
    login__link: string
    login__page: string
    'login__page--panel': string
    login__subtitle: string
    login__title: string
    progress__update: string
    rule__text: string
    'rule__text--container': string
    sub__text: string
    user__group: string
    user__name: string
    version__info: string
    version__no: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
