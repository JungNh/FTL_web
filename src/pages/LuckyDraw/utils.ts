import isEmpty from 'lodash/isEmpty'
import Gift1 from '../../assets/images/gift-01.png'
import Gift2 from '../../assets/images/gift-02.png'
import Gift3 from '../../assets/images/gift-03.png'
import Gift4 from '../../assets/images/gift-04.svg'
import Gift5 from '../../assets/images/gift-05.webp'

export const degree = 1800

export const colorPallete = [
  '#1db2f5',
  '#ab394b',
  '#97c95c',
  '#e18e92',
  '#b1d2c6',
  '#ffc720',
  '#a63db8',
  '#bb626a',
  '#b7abea',
  '#bb7862',
  '#70b3a1',
  '#eb3573',
  '#057d85',
  '#dac599',
  '#fcb65e',
  '#7abd5c',
  '#f5564a',
  '#b6d623',
  '#153459'
]

export const listOfGifts = [
  {
    id: 1,
    text: 'Chúc bạn may mắn !',
    image: Gift5,
    color: '#FFFFFF',
    start: 0,
    end: 60,
    rate: 60
  },
  {
    id: 2,
    text: 'Voucher khóa học giảm 10%',
    image: Gift1,
    color: '#FFFFFF',
    start: 0,
    end: 60,
    rate: 5
  },
  {
    id: 3,
    text: '10 kim cương',
    image: Gift4,
    color: '#FFFFFF',
    start: 0,
    end: 60,
    rate: 20
  },
  {
    id: 4,
    text: 'Voucher khóa học giảm 5%',
    image: Gift2,
    color: '#FFFFFF',
    start: 0,
    end: 60,
    rate: 10
  },
  {
    id: 5,
    text: '5 kim cương',
    image: Gift4,
    color: '#FFFFFF',
    start: 0,
    end: 60,
    rate: 30
  }
  // {
  //     text: "10 kim cương",
  //     image: Gift4,
  //     color: "#FFFFFF",
  //     start: 0,
  //     end: 60,
  // },
  // {
  //     text: "Voucher khóa học giảm 5%",
  //     image: "https://via.placeholder.com/600x400",
  //     color: "#FFFFFF",
  //     start: 0,
  //     end: 60,
  // },
  // {
  //     text: "5 kim cương",
  //     image: "https://via.placeholder.com/600x400",
  //     color: "#FFFFFF",
  //     start: 0,
  //     end: 60,
  // },
]

export const getPositionAtCenter = (element: any) => {
  const { top, left, width, height } = element.getBoundingClientRect()
  return {
    x: left + width / 2,
    y: top + height / 2
  }
}

export const getDistanceBetweenElements = (a: any, b: any) => {
  const aPosition = getPositionAtCenter(a)
  const bPosition = getPositionAtCenter(b)

  return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y)
}

export const mapAngleAndColor = (listOfGifts: any) => {
  if (isEmpty(listOfGifts)) return []
  let tempDegree = 0
  const step = 360 / listOfGifts.length
  listOfGifts.forEach((item: any, index: any) => {
    item.color = colorPallete[index]
    item.start = tempDegree
    item.end = tempDegree += step
  })
  return listOfGifts
}

export const makeSpinsBackground = (list: any) => {
  let result = `conic-gradient(`
  for (let i = 0; i < list.length; i++) {
    result += `${list[i].color.replaceAll(`"`, '')} ${list[i].start}deg ${list[i].end}deg,`
  }
  return result.replace(/.$/, '') + `)`
}

export const makeFilterBackground = (list: any, index: number) => {
  let result = `conic-gradient(`
  for (let i = 0; i < list.length; i++) {
    result += `rgba(79,79,79,${index === i ? 0 : 0.6}) ${list[i].start}deg ${list[i].end}deg,`
  }
  return result.replace(/.$/, '') + `)`
}

export const lawOfCosinse = (lengthOFList: any, egde = 250) => {
  const a = egde
  const b = egde
  const gamma = (Math.PI / 180) * (360 / lengthOFList)
  const side = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(gamma))
  return side.toPrecision(5)
}
