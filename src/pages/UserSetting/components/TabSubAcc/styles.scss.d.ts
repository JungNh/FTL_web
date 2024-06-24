declare namespace StylesScssNamespace {
  export interface IStylesScss {
    account__wrap: string
    avata_holder: string
    'avata_holder--upload': string
    'btn--edit': string
    btn__password: string
    button__subAcc: string
    info__container: string
    tab__wrap: string
    tab_sub_acc: string
    tag__text: string
    'text-link': string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
