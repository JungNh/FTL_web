import React, { FC } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import loading_image from '../../assets/images/loading.svg'
import 'react-lazy-load-image-component/src/effects/blur.css'

type Props = {
  src?: string
  alt?: string
  className?: string
  placeHolderSrc?: string
  width?: number
  height?: number
  wrapperClassName?: string
}

const KImage: FC<Props> = ({
  placeHolderSrc = loading_image,
  src,
  className,
  alt,
  width,
  height,
  wrapperClassName
}) => (
  <LazyLoadImage
    alt={alt}
    className={className}
    width={width}
    height={height}
    src={src}
    placeholderSrc={placeHolderSrc}
    effect="blur"
    wrapperClassName={wrapperClassName}
    style={{ maxWidth: '450px', maxHeight: '250px' }}
  />
)

export default KImage
