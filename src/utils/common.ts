// import bg1 from '../assets/images/1.jpg'
// import bg2 from '../assets/images/course_background.jpg'
import Swal from 'sweetalert2'
import _ from 'lodash'
import background1 from '../assets/images/bg1.jpeg'
// import background2 from '../assets/images/bg2.jpeg'
import background3 from '../assets/images/bg3.jpeg'
import background4 from '../assets/images/bg4.jpeg'
import background5 from '../assets/images/bg5.jpeg'
// import background6 from '../assets/images/bg6.jpeg'
// import background7 from '../assets/images/bg7.jpeg'
// import background8 from '../assets/images/bg8.jpeg'
// import backgroundGame1 from '../assets/game-images/bg1.png'
// import backgroundGame2 from '../assets/game-images/bg2.png'
import icoAvaDemo from '../assets/images/ico_robot-head.svg'

import logoFuture from '../assets/icon.png'
import icoFubo from '../assets/images/ico_fubo.svg'
import icoWarning from '../assets/images/ico__warning.svg'
// fish
// import fish1 from '../assets/game-images/fish-1.png'
// import fish2 from '../assets/game-images/fish-2.png'
// import fish3 from '../assets/game-images/fish-3.png'
// import fish4 from '../assets/game-images/fish-4.png'
// import fish5 from '../assets/game-images/fish-5.png'
// import fish6 from '../assets/game-images/fish-6.png'
// import fish7 from '../assets/game-images/fish-7.png'
// import fish8 from '../assets/game-images/fish-8.png'
// import fish9 from '../assets/game-images/fish-9.png'
// import fish10 from '../assets/game-images/fish-10.png'

export const numberTwoDigits = (number: number | string) => {
  if (Number(number) < 10 && Number(number) >= 0) return `0${number}`
  return String(number)
}
export const randomBG = () => {
  const index = Math.floor(Math.random() * 4)
  const arrayBg = [
    background1,
    // background2,
    background3,
    background4,
    background5
    // background6,
    // background7,
    // background8
  ]
  return arrayBg[index]
  // return background1
}

// export const getUrlFish = (index?: string) => {
//   switch (index) {
//     case '0':
//       return fish1
//     case '1':
//       return fish2
//     case '2':
//       return fish3
//     case '3':
//       return fish4
//     case '4':
//       return fish5
//     case '5':
//       return fish6
//     case '6':
//       return fish7
//     case '7':
//       return fish8
//     case '8':
//       return fish9
//     case '9':
//       return fish10
//     default:
//       return undefined
//   }
// }

// export const randomGameBG = () => {
//   const index = Math.floor(Math.random() * 2)
//   const arrayBg = [backgroundGame1, backgroundGame2]

//   return arrayBg[index]
// }

export const randomItem = (array: any, remove?: any[]) => {
  const newArray = remove ? _.difference(array, remove) : array
  const index = Math.floor(Math.random() * newArray?.length)
  return newArray[index]
}

export const randomItems = (array: any, remove: any[], numberOfItems: number) => {
  const newArray = remove ? _.difference(array, remove) : array
  const newRandomList = newArray.sort(() => Math.random() - 0.5)
  return newRandomList.slice(0, numberOfItems)
}

export const randomPosition = (array: any) => array.sort(() => Math.random() - 0.5)

export const openError = (message: string) => {
  if (message) {
    Swal.fire({
      showCloseButton: false,
      title: message,
      icon: 'error'
    })
  }
}
export const openSuccess = (message: string) => {
  if (message) {
    Swal.fire({
      showCloseButton: false,
      title: message,
      icon: 'success'
    })
  }
}

export const openActiveCode = (message: string, action: any) => {
  if (message) {
    Swal.fire({
      title: message,
      icon: 'info',

      confirmButtonText: 'Kích hoạt ngay'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        action()
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }
}

export const openConfirm = (
  custom: {
    header?: string
    title: string
    cancelButtonText: string
    confirmButtonText: string
  },
  action: any,
  actionCancel?: any
) => {
  Swal.fire({
    title: custom?.header,
    text: custom?.title,
    showCancelButton: true,
    cancelButtonText: custom?.cancelButtonText,
    confirmButtonText: custom?.confirmButtonText,
    imageUrl: icoFubo,
    reverseButtons: true,
    customClass: {
      confirmButton: 'btn__confirm',
      cancelButton: 'btn__cancel--confirm'
    }
  })
    .then((result) => {
      if (result.value) {
        action()
      } else if (result.dismiss) {
        actionCancel()
      }
      return ''
    })
    .catch(() => {})
}

export const openWarning = (
  custom: {
    header?: string
    title: string
    cancelButtonText: string
    confirmButtonText: string
  },
  action: any,
  actionCancel?: any
) => {
  Swal.fire({
    title: custom?.header,
    text: custom?.title,
    showCancelButton: true,
    cancelButtonText: custom?.cancelButtonText,
    confirmButtonText: custom?.confirmButtonText,
    imageUrl: icoWarning,
    reverseButtons: true,
    customClass: {
      confirmButton: 'btn__confirm',
      cancelButton: 'btn__cancel--confirm'
      // header: 'swal__warning--header',
    }
  })
    .then((result) => {
      if (result.value) {
        action()
      } else if (result.dismiss) {
        actionCancel()
      }
      return ''
    })
    .catch(() => {})
}

export const shuffleArray = (array: any[]) => {
  if (!_.isEmpty(array)) {
    for (let i = array.length - 1; i > 0; i--) {
      // Generate random number
      const j = Math.floor(Math.random() * (i + 1))
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  }
  return []
}

export const convertUrl = (url?: string, type?: 'audio' | 'image' | 'avata') => {
  if (!url && type === 'audio') return undefined
  if (!url && type === 'avata') return icoAvaDemo
  if (!url && type === 'image') return logoFuture
  if (!url) return ''
  if (url === 'string' && type === 'avata') return icoAvaDemo
  if (url && url.includes('https')) return url
  return `https://api.futurelang.vn${url}`
}

export const cleanSentence = (string: string) =>
  string
    ?.replaceAll('’', "'")
    ?.replaceAll('-', ' ')
    ?.replaceAll('\n', '')
    ?.replaceAll('\r', '')
    ?.replace(/  +/g, ' ')
    ?.replace(/[&\\/\\#,+()$~%.":*?!<>{}]/g, '')
    ?.trim()
    ?.toLowerCase() || ''

export const cleanAndSplitSentence = (string: string) =>
  string
    ?.replaceAll('’', "'")
    ?.replaceAll('-', ' ')
    ?.replaceAll('\n', '')
    ?.replaceAll('\r', '')
    ?.replace(/[&\\/\\#,+()$~%.":*?!<>{}]/g, '')
    ?.trim()
    ?.toLowerCase()
    ?.split(' ')
    ?.filter((item: any) => item.length) || []

export const getIndexFromKeyBoard = (
  type: '1col' | '2col',
  keyBoard: string,
  currentIndex: number | null
) => {
  /**
   * * 1 => đáp án 0
   * * 2 => đáp án 1
   * * 3 => đáp án 2
   * * 4 => đáp án 3
   */
  if (['1', '2', '3', '4'].includes(keyBoard)) {
    return Number(keyBoard) - 1
  }
  if (type === '2col') {
    /**
     * * ArrowLeft
     * - currentIndex:
     *    + null => return
     *    + 0, 2 => return
     *    + 1, 3 => 0, 2
     */
    if (keyBoard === 'ArrowLeft') {
      if (currentIndex === null || currentIndex === 0 || currentIndex === 2) return null
      if (currentIndex === 1 || currentIndex === 3) return currentIndex - 1
    }

    /**
     * * ArrowRight
     *  - currentIndex:
     *    + null => 0
     *    + 0, 2 => 1, 3
     *    + 1, 3 => return
     */
    if (keyBoard === 'ArrowRight') {
      if (currentIndex === 1 || currentIndex === 3) return null
      if (currentIndex === null) return 0
      if (currentIndex === 0 || currentIndex === 2) return currentIndex + 1
    }

    /**
     * * ArrowRight
     *  - currentIndex:
     *    + null => return
     *    + 0, 1 => return
     *    + 2, 3 => 0, 1
     */
    if (keyBoard === 'ArrowUp') {
      if (currentIndex === null || currentIndex === 0 || currentIndex === 1) return null
      if (currentIndex === 2 || currentIndex === 3) return currentIndex - 2
    }

    /**
     * * ArrowDown
     *  - currentIndex:
     *    + null => 0
     *    + 0, 1 => 2, 3
     *    + 2, 3 => return
     */
    if (keyBoard === 'ArrowDown') {
      if (currentIndex === 2 || currentIndex === 3) return null
      if (currentIndex === null) return 0
      if (currentIndex === 0 || currentIndex === 1) return currentIndex + 2
    }
  }

  if (type === '1col') {
    if (keyBoard === 'ArrowLeft' || keyBoard === 'ArrowUp') {
      if (currentIndex === null || currentIndex === 0) return null
      return currentIndex - 1
    }

    if (keyBoard === 'ArrowRight' || keyBoard === 'ArrowDown') {
      if (currentIndex === null) return 0
      if (currentIndex === 3) return null
      return currentIndex + 1
    }
  }

  return null
}

export const convertIndexToLetter = (index: number) => {
  switch (index) {
    case 0:
      return 'A'
    case 1:
      return 'B'
    case 2:
      return 'C'
    case 3:
      return 'D'
    case 4:
      return 'E'
    case 5:
      return 'F'
    case 6:
      return 'G'
    case 7:
      return 'H'
    default:
      return ''
  }
}

export const htmlSpecialLetter = (string: string) =>
  string
    ?.replaceAll('<u>g</u>', '<span class="underline__letter">g</span>')
    ?.replaceAll('<u>q</u>', '<span class="underline__letter">q</span>')
    ?.replaceAll('<u>p</u>', '<span class="underline__letter">p</span>')
    ?.replaceAll('<u>j</u>', '<span class="underline__letter">j</span>')
    ?.replaceAll('<u>y</u>', '<span class="underline__letter">y</span>')
    ?.replaceAll(String.fromCharCode(160), ' ') || ''

export const float2Number = (number: number) => Math.round(number * 100) / 100

export const errorHandler = (errorObj: any, logout: any) => {
  try {
    if (errorObj?.error === 'Unauthorized' && errorObj?.statusCode === 401) {
      Swal.fire({
        titleText: 'Tài khoản không được phép truy cập.',
        icon: 'error'
      })
        .then(() => {
          logout()
          return null
        })
        .catch(() => {
          logout()
          return null
        })
    }
    console.error(errorObj)
  } catch (error) {
    console.error(error)
  }
}

export const objToQueryString = (object: any) =>
  Object.keys(object)
    .map((item: string) => {
      if (object[item] !== null && object[item] !== undefined) return `${item}=${object[item]}`
      return ''
    })
    .join('&')

export const covertTimeFromNum = (duration: number) => {
  const format2Num = (number: number) => {
    if (number < 10) return `0${number}`
    return number
  }

  const hours: number = Math.floor(duration / 3600)
  const minutes: number = Math.floor((duration - hours * 3600) / 60)
  const seconds: number = Math.floor(duration - hours * 3600 - minutes * 60)
  return `${format2Num(hours)}:${format2Num(minutes)}:${format2Num(seconds)}`
}

export const handleTextCN = (text: any) => {
  // const input = text.replace(/-/g, ' ');
  const str = text?.trim().toLowerCase()
  return str
}

export const handleTextEN = (text: any) => {
  const input = text?.replace(/[&\\/\\#,+()$~%.’'":*?!<>{}-]/g, '');
  const str = input?.trim().toLowerCase();
  return str;
};

export const checkPointChina = (arrAns: any, arrScript: any) => {
  console.log('arrAns', arrAns, arrScript)
  const symbol = '？。，/；：“”（）!-[&\\/\\#,+()$~%.":*?!<>{}-]！《》〈〉、·'
  let typeSymPrev = false
  let numSym = 0 //số các kí tự đặc biệt và khoảng cách trong câu trả lời đúng
  let result = [] //kq trả về màu của từng chữ
  let letterCorrect = 0 //số chữ cái đúng trong đáp án
  for (var i = 0; i < arrAns.length; i++) {
    //khi chữ đang xét là kí tự đặc biệt hoặc khoảng cách
    if (symbol.includes(arrAns[i]?.text) || arrAns[i]?.text == ' ') {
      result.push({
        key: arrAns[i]?.text,
        index: i,
        check: i == 0 || typeSymPrev
      })
      numSym += 1
      typeSymPrev = true
    } else {
      let arrHomo = arrAns[i]?.homo
      let handleArrHomo = arrHomo?.filter((word: string) => arrScript.includes(word))
      let checkHomo = handleArrHomo?.length >= 1
      let isCheck =
        handleTextCN(arrAns[i]?.text) == handleTextCN(arrScript[i - numSym]) || checkHomo
      // if (!isCheck) {
      //   console.log('ischeck', handleTextCN(arrAns[i]?.text), handleTextCN(arrScript[i]))
      // }
      letterCorrect = isCheck ? letterCorrect + 1 : letterCorrect
      result.push({
        key: arrAns[i]?.text,
        index: i,
        check: isCheck
      })
      typeSymPrev = isCheck
    }
  }
  let output = {
    point: Math.round((letterCorrect / (arrAns?.length - numSym)) * 100),
    result: result
  }
  return output
}

export const checkPointEng = (arrAns: any, arrScript: any) => {
  const symbol = '？。，/；：“”（）!-[&\\/\\#,+()$~%.":*?!<>{}-]！《》〈〉、';
  let typeSymPrev = false;
  let numSym = 0; //số các kí tự đặc biệt và khoảng cách trong câu trả lời đúng
  let result = []; //kq trả về màu của từng chữ
  let letterCorrect = 0; //số chữ cái đúng trong đáp án
  let status = 0;
  for (var i = 0; i < arrAns.length; i++) {
    //khi chữ đang xét là kí tự đặc biệt hoặc khoảng cách
    if (symbol.includes(arrAns[i]?.text) || arrAns[i]?.text == '') {
      result.push({
        key: arrAns[i]?.text,
        index: i,
        check: i == 0 || typeSymPrev,
      });
      numSym += 1;
      typeSymPrev = true;
    } else {
      let arrHomo = arrAns[i]?.homo;
      let handleArrHomo = arrHomo?.filter((word: string) =>
        arrScript.includes(word),
      );
      let checkHomo = handleArrHomo?.length >= 1;
      let isCheck =
        arrScript.includes(handleTextEN(arrAns[i]?.text)) ||
        checkHomo ||
        arrScript.includes(arrAns[i]?.text);
      // if (!isCheck) {
      //   console.log('ischeck', handleTextCN(arrAns[i]?.text), handleTextCN(arrScript[i]))
      // }
      letterCorrect = isCheck ? letterCorrect + 1 : letterCorrect;
      result.push({
        key: arrAns[i]?.text,
        index: i,
        check: isCheck,
      });
      typeSymPrev = isCheck;
    }
  }

  let point = Math.round((letterCorrect / (arrAns?.length - numSym)) * 100);
  if (point > 0 && point < 30) {
    status = 2;
  }
  if (point >= 30 && point < 50) {
    status = 3;
  }
  if (point >= 50 && point < 70) {
    status = 4;
  }
  if (point >= 70 && point < 90) {
    status = 5;
  }
  if (point >= 90 && point <= 100) {
    status = 6;
  }
  let output = {
    point: point,
    result: result,
    status,
  };
  return output;
}

export const openInNewTab = (url: string) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}
