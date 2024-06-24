declare namespace StylesScssNamespace {
  export interface IStylesScss {
    button__back: string
    button__rules: string
    'leaderBoard__page--detail': string
    'leaderBoard__ranking--left': string
    'leaderBoard__ranking--right': string
    leaderBoard__header: string
    leaderBoard_time: string
    leaderBoard_change_time: string
    leaderBoard__logo: string
    leaderBoard__title: string
    leaderBoard__ranking: string
    leaderBoard__list: string
    triangle_right: string
    triangle_left: string
    'd-flex-center': string
    'leaderBoard__list--header': string
    'leaderBoard__list--item': string
    diamond_item: string
    'modal-rules': string
    'leader__no_data': string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
