import { useState, useEffect } from 'react'

const useKeyPress = () => {
  const [keyPressed, setKeyPressed] = useState<string | null>(null)

  const downHandler = ({ key }: { key: string }) => {
    setKeyPressed(key)
  }
  // If released key is our target key then set to false
  const upHandler = () => {
    setKeyPressed(null)
  }
  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [])
  return keyPressed
}

export default useKeyPress
