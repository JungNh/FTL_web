import * as React from 'react'
import { clearInterval as clearI, setInterval as setI } from 'worker-timers';
import './styles.scss'

import countdown from "../../../../assets/images/countdown.gif"

type Props = {
  start: number,
  onRedirect: any,
}

const CountDown: React.FC<Props> = ({ start, onRedirect }) => {
  const [open, setOpen] = React.useState(false);
  const [tick, setTick] = React.useState(start);

  React.useEffect(() => {
    if (!start) return;
    setTick(start);
    const interval = setI(() => {
      setTick(tick => Math.max(tick - 1, 0))
    }, 1000);
    return () => clearI(interval);
  }, [start])

  React.useEffect(() => {
    if (tick <= 5) {
      setOpen(true)
      if (tick === 0) {
        setTimeout(() => {
          onRedirect()
        }, 1500)
      }
    }
  }, [tick])

  return open ? (
    <div className="countdown__component">
      {tick === 0 ? <p>Đang lấy dữ liệu vòng thi</p> : <img src={countdown} alt="countdown" />}
    </div>
  ) : null;
}

export default CountDown
