declare namespace StylesScssNamespace {
  export interface IStylesScss {
    account__wrap: string
    avata_holder: string
    'avata_holder--upload': string
    'btn--edit': string
    btn__cancel: string
    btn__password: string
    btn__save: string
    button__subAcc: string
    has__error: string
    info__container: string
    select__address: string
    select__control: string
    'select__control--is-focused': string
    select__placeholder: string
    tab_my_acc: string
    tag__text: string
    'text-link': string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
