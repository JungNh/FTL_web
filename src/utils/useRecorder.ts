import { useCallback, useEffect, useState } from 'react'
// import { desktopCapturer } from 'electron'
// import MicRecorder from 'mic-recorder-to-mp3'
import Swal from 'sweetalert2'

const useRecorder = ({ maxRecordTime }: { maxRecordTime: number }) => {
  const [audioURL, setAudioURL] = useState('')
  const [audioFile, setAudioFile] = useState<any>(null)
  const [isRecording, setIsRecording] = useState<boolean | null>(null)
  const [recorder, setRecorder] = useState<any>(null)
  const [localStream, setLocalStream] = useState<any>(null)
  const [deviceId, setDeviceId] = useState<string | null>(null)

  useEffect(() => {
    const micId = localStorage.getItem('micId')
    if (micId) setDeviceId(micId)
  }, [])

  // stop when silence
  const detectSilence = useCallback(
    (
      stream: any,
      onSoundEnd = () => {},
      __onSoundStart,
      silence_delay = 2000,
      min_decibels = -80
    ) => {
      console.log('%cStart dectect slience', 'border: 1px solid green')
      const ctx = new AudioContext()
      const analyser = ctx.createAnalyser()
      const streamNode = ctx.createMediaStreamSource(stream)
      streamNode.connect(analyser)
      analyser.minDecibels = min_decibels

      const data = new Uint8Array(analyser.frequencyBinCount) // will hold our data
      let silenceStart = performance.now()
      const startRecord = performance.now()
      let triggered = false // trigger only once per silence event

      const loop = (time?: any) => {
        console.log('%cis detect silent', 'background: yellow', triggered)
        analyser.getByteFrequencyData(data) // get current data
        if (!triggered) {
          requestAnimationFrame(loop) // we'll loop every 60th of a second to check
        }

        if (data.some((v) => v)) {
          // if there is data above the given db limit
          // if (triggered) {
          //   triggered = false
          //   onSoundStart()
          // }
          silenceStart = time // set it to now
        }
        // max time dectecion
        if (!triggered && time - startRecord >= maxRecordTime) {
          console.log('%cmaxRecordTime', 'background: red', time - startRecord)
          triggered = true
          onSoundEnd()
        }
        if (!triggered && time - silenceStart > silence_delay) {
          console.log('%cSilent detected', 'background: red', time - silenceStart)

          triggered = true
          onSoundEnd()
        }
      }
      loop()
    },
    [maxRecordTime]
  )

  // useEffect(() => {
  //   if (isRecording === false && recorder !== null && localStream === null) {
  //     setLocalStream(null)
  //     recorder
  //       ?.stop()
  //       ?.getMp3()
  //       ?.then(async ([buffer, blob]: any) => {
  //         const file = new File(buffer, 'userVoice.mp3', {
  //           type: blob.type,
  //           lastModified: Date.now()
  //         })
  //         const url = await URL.createObjectURL(blob)
  //         setAudioURL(url)
  //         setAudioFile(file)
  //         return ''
  //       })
  //       ?.catch((e: any) => {
  //         console.error(e)
  //       })
  //   }
  // }, [recorder, isRecording, localStream])

  // useEffect(() => {
  //   if (isRecording === true && recorder !== null) {
  //     recorder
  //       ?.start()
  //       .then((stream: MediaStream) => {
  //         setLocalStream(stream)
  //         return ''
  //       })
  //       .catch((e: any) => {
  //         console.error(e)
  //       })
  //   }
  // }, [isRecording, recorder])

  const startRecording = useCallback(() => {
    // if (recorder !== null) {
    //   recorder
    //     ?.start()
    //     .then((stream: MediaStream) => {
    //       setIsRecording(true)
    //       setLocalStream(stream)
    //       return ''
    //     })
    //     .catch((e: any) => {
    //       console.error(e)
    //       localStorage.removeItem('micId')
    //       setDeviceId(null)
    //     })
    // } else {
    //   Swal.fire('mic is prepare', '', 'warning')
    // }
  }, [recorder])

  const stopRecording = useCallback(() => {
    setIsRecording(false)
    setLocalStream(null)
  }, [])

  useEffect(() => {
    if (localStream !== null) {
      console.log('run effect dectect')
      detectSilence(
        localStream,
        () => {
          setLocalStream(null)
          setIsRecording(false)
        },
        () => console.log('is Speaking')
      )
    }
  }, [detectSilence, localStream])

  const removeRecorder = useCallback(() => {}, [])

  // const requestRecorder = useCallback(async () => {
  // return desktopCapturer
  //   .getSources({ types: ['window', 'screen'] })
  //   .then(async (sources) => {
  //     const source = sources.find((item: any) => item?.name === 'FutureLang')
  //     if (source) {
  //       try {
  //         // const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  //         // setLocalStream(stream)
  //         return new MicRecorder({
  //           bitRate: 128,
  //           startRecordingAt: 0,
  //           deviceId
  //         })
  //       } catch (e) {
  //         console.error(e)
  //         localStorage.removeItem('micId')
  //         return null
  //       }
  //     }
  //     return null
  //   })
  //   .catch((e) => {
  //     console.error(e)
  //   })
  // }, [deviceId])

  // useEffect(() => {
  // if (recorder === null) {
  //   requestRecorder()
  //     .then((media) => {
  //       console.log('init react mic done', media)
  //       return setRecorder(media)
  //     })
  //     .catch((err) => console.error(err))
  // }
  // }, [recorder, requestRecorder])

  return [
    isRecording,
    startRecording,
    stopRecording,
    audioFile,
    setAudioFile,
    audioURL,
    setAudioURL,
    removeRecorder,
  ]
}

export default useRecorder
