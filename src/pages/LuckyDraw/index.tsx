import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom'
import random from "lodash/random"
import isEmpty from "lodash/isEmpty"
import './styles.scss'

import spinButtonClicked from '../../assets/images/draw__button--clicked.svg'
import spinButton from '../../assets/images/draw__button.svg'
import fuboPointer from '../../assets/images/fubo-pointer.svg'
import firework from '../../assets/images/firework.svg';
import drawMask from '../../assets/images/draw_mask.svg'

import ContainerWithBack from '../../components/ContainerWithBack'
import { getGifts, draw } from '../../store/luckyDraw/actions';
import PopupGift from './components/PopupGift'
import { RootState } from '../../store';
import {
  makeSpinsBackground,
  makeFilterBackground,
  getDistanceBetweenElements,
  mapAngleAndColor,
  lawOfCosinse,
  degree,
} from "./utils"
import PopupNoData from './components/PopupNoData';
import PopupRecievedGifts from './components/PopupRecievedGifts';
import { getContest } from '../../store/joiningRoom/actions';

const LuckyDrawPage: React.FC = () => {
  // =================================================== HOOKS ===================================================
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const gifts = useSelector((state: RootState) => state.luckyDraw.gifts)
  const contest = useSelector((state: RootState) => state.joiningRoom.contest)
  // =================================================== STATES ===================================================
  const [isFinish, setIsFinish] = React.useState(false);
  const [button, setButton] = React.useState(spinButton);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [choosenIndex, setChoosenIndex] = React.useState(0);
  const [choosenGift, setChoosenGift] = React.useState<any>();

  // =================================================== CONTS ===================================================
  const list = React.useMemo(() => mapAngleAndColor(gifts), [gifts])
  const contentWidth = React.useMemo(() => lawOfCosinse(list.length), [list])
  const iconicGradient = React.useMemo(() => makeSpinsBackground(list), [list])
  const iconicGradientFilter = React.useMemo(() => makeFilterBackground(list, choosenIndex), [list, choosenIndex])

  // =================================================== EFFECTS ===================================================
  React.useEffect(() => {
    dispatch(getGifts(+id))
    dispatch(getContest(+id))
  }, [])
  // =================================================== CALLBACKS ===================================================
  const rotateToItem = (item: number) => {
    if (!isFinish && item) {
      setButton(spinButtonClicked);
      const randomed = list.find((gift: any) => gift.id === item);
      const padding = (10 / Math.abs(randomed.start - randomed.end)) * 100;
      let extraDegree = 360 - random(randomed.start + padding, randomed.end - padding);
      let totalDegree = degree + extraDegree;
      const mark = document.getElementById("mark");
      const filter = document.getElementById("filter");
      const indicator = document.getElementById("indicator");
      const wheel = document.getElementById("inner-wheel");
      const array = [...document.getElementsByClassName("sec")];

      if (wheel && filter && indicator) {
        wheel.style.transform = 'rotate(' + totalDegree + 'deg)'
        filter.style.transform = 'rotate(' + totalDegree + 'deg)'
        indicator.classList.add("hh")
        setTimeout(() => {
          let distances: number[] = [];
          array.forEach(arr => {
            const distance = getDistanceBetweenElements(mark, arr);
            distances.push(distance);
          })
          const indexOfMinDistance = distances.indexOf(Math.min(...distances));
          setChoosenIndex(indexOfMinDistance);
          setIsFinish(true);
          setChoosenGift(array[indexOfMinDistance]);
          setTimeout(() => setOpenDialog(true), 500);
          indicator.classList.remove("hh");
        }, 6100);
      }
    }
  }

  const spin = () => dispatch(draw(+id, rotateToItem))
  // =================================================== RENDERS ===================================================
  return (
    <ContainerWithBack to="/arena">
      {!isEmpty(gifts) ? (
        <div className="bonusdraw__page">
          <h1 className="draw___title">Quay thưởng</h1>
          <div className="draw__wrapper">
            {isFinish && <img src={firework} alt="firework" className="firework" />}
            <div id="wheel">

              {/* Outter draw */}
              <div className="outer__draw" />

              {/* Spins texture mask */}
              <img src={drawMask} alt="drawMask" className="mask" />

              {/* Spins ring inside */}
              <div className="outer__rings" />

              {/* Spins wheel */}
              <div id="inner-wheel" className="inner__draw" style={{ background: iconicGradient }}>
                <div>
                  {list.map((item: any, index: any) => (
                    <div
                      key={item.id}
                      className="sec"
                      data-name={index}
                      style={{
                        transform: `translateX(-50%) rotate(${(item.start + item.end) / 2}deg)`,
                        width: `${contentWidth}px`
                      }}
                    >
                      <div className="sec__text">{item.number_of_units_per_hit > 1 && item.number_of_units_per_hit} {item.name}</div>
                      <div className="sec__image" style={{ width: `${lawOfCosinse(list.length, 90)}px` }}>
                        <img src={item.image} alt="sec__image" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filter after finishing the spin */}
              <div
                id="filter"
                className="draw__filter"
                style={{ background: iconicGradientFilter, display: isFinish ? 'block' : 'none' }}
              />

              {/* Center icon */}
              <div className="indicator" >
                <div id="indicator">
                  <img src={fuboPointer} alt="fuboPointer" />
                </div>
              </div>

              {/* Top point to caculate the result */}
              <div id="mark" />

            </div>
          </div>

          <div className="draw__button">
            <img src={button} alt="button" onClick={spin} />
          </div>
          <PopupGift
            open={openDialog}
            onClick={() => history.push(`/contest-leaderboard/${id}`)}
            gift={choosenGift?.childNodes?.[0]?.innerText}
          />
          <PopupRecievedGifts open={!!contest?.is_dialed} onRedirect={() => history.push("/gifts")} />
        </div>
      ) : gifts === null ? (
        <PopupNoData onRedirect={() => history.push("/arena")} />
      ) : 
        <React.Fragment />
      }
    </ContainerWithBack>
  )
}

export default LuckyDrawPage
