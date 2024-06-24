import React, { useEffect, useState } from 'react'

const Bubble = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShow(true), 4000)
    return () => clearTimeout(timer1)
  }, [])

  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}
    >
      {[...new Array(30).keys()].map((__item: any, index: number) => {
        const size = Math.random() * 60
        return (
          <span
            className="bubble"
            key={index}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}vw`,
              top: `calc(${Math.random() * 100}vh + 100vh)`,
            }}
          />
        )
      })}
      {show
        && [...new Array(30).keys()].map((__item: any, index: number) => {
          const size = Math.random() * 60
          return (
            <span
              className="bubble"
              key={index}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}vw`,
                top: `calc(${Math.random() * 100}vh + 100vh)`,
              }}
            />
          )
        })}
    </div>
  )
}

export default Bubble
