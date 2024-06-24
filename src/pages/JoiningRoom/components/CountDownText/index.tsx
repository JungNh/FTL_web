import * as React from 'react'
import { clearInterval as clearI, setInterval as setI } from 'worker-timers';
import type { FC } from 'react'
import './styles.scss'

type Props = {
  start: number
}

function convertSeconds(sec: number) {
  const total_minutes = Math.floor(sec / 60);
  const total_hours = Math.floor(total_minutes / 60);
  const days = Math.floor(total_hours / 24);
  const seconds = sec % 60;
  const minutes = total_minutes % 60;
  const hours = total_hours % 24;
  return { d: days, h: hours, m: minutes, s: seconds };
};

const CountDownText: FC<Props> = ({ start }) => {
  const [tick, setTick] = React.useState(start);
  const time = convertSeconds(tick);

  React.useEffect(() => {
    if (!start) return;
    setTick(start);
    const interval = setI(() => {
      setTick(tick => Math.max(tick - 1, 0))
    }, 1000);
    return () => clearI(interval);
  }, [start])

  return (
    <div className="timmer__wrapper">
      <div className="timmer__wrapper-item">
        <div>{time.d}</div>
        <p>NGÀY</p>
      </div>

      <div className="timmer__wrapper-item">
        <div>{time.h}</div>
        <p>GIỜ</p>
      </div>

      <div className="timmer__wrapper-item">
        <div>{time.m}</div>
        <p>PHÚT</p>
      </div>

      <div className="timmer__wrapper-item">
        <div>{time.s}</div>
        <p>GIÂY</p>
      </div>
    </div>
  );
}

export default CountDownText
