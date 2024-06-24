import * as React from "react";
import type { FC } from "react";
import ReactHlsPlayer from 'react-hls-player';

type Props = {
  src: string;
};

const Video: FC<Props> = ({ src }) => {
  const ref = React.useRef<HTMLVideoElement>(null);
  const isStream = src?.includes(".m3u8")
  React.useEffect(() => {
    if (ref.current) {
      ref.current.pause();
      ref.current.load();
      ref.current.currentTime = 0;
    }
  }, [src])

  return isStream ? (
    <ReactHlsPlayer
      playerRef={ref}
      width="320"
      controls
      src="https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
    />
  ) : (
    <video 
      width="320" 
      controls 
      ref={ref}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};

export default Video;
