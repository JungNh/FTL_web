import React, { FC } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import loading_image from '../../assets/images/loading.svg'
import 'react-lazy-load-image-component/src/effects/blur.css'
import '../KImage/style.scss'

type Props = {
  src?: string
  alt?: string
  className?: string
  placeHolderSrc?: string
  width?: number
  height?: number
  wrapperClassName?: string
  noti?: number
}

const KImageNoti: FC<Props> = ({
  placeHolderSrc = loading_image,
  src,
  className,
  alt,
  width,
  height,
  wrapperClassName,
  noti
}) => {
  return (
    <div className="bg_btn">
      {noti !== undefined && noti !== 0 && (
        <div className="num_noti">
          <span className="num_text">{noti}</span>
        </div>
      )}

      <LazyLoadImage
        alt={alt}
        className={className}
        width={width}
        height={height}
        src={src}
        placeholderSrc={placeHolderSrc}
        effect="blur"
        wrapperClassName={wrapperClassName}
      />
    </div>
  )
}

export default KImageNoti
