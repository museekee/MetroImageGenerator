import React from "react"
import styled from "styled-components"
import lineRoadMap from "./../../data/lineRoadMap"
import { Lines } from "../../data/types"
import lineColors from "../../data/lineColors"
import roadImg from "./../../assets/images/lineRoadMap/road.svg"
import turnar from "./../../assets/images/lineRoadMap/turnar.svg"
import turnal from "./../../assets/images/lineRoadMap/turnal.svg"
import turnbr from "./../../assets/images/lineRoadMap/turnbr.svg"
import turnbl from "./../../assets/images/lineRoadMap/turnbl.svg"
import branchrImg from "./../../assets/images/lineRoadMap/branchr.svg"

const LineRoadMap = ({ line }: {line: Lines}) => {
  const nowLineRoadMap = lineRoadMap.map[line]
  const nowLineRoadStations = lineRoadMap.stations[line]
  const Map = styled.div`
    display: grid;
    grid-template-columns: repeat(${nowLineRoadMap.count[0]}, ${nowLineRoadMap.size[0]}px);
    grid-template-rows: repeat(${nowLineRoadMap.count[1]}, ${nowLineRoadMap.size[1]}px);
    justify-items: center;
  `
  return (
    <Map>
      {
        nowLineRoadMap.map.map(item => {
          const OneBlock = ({img, pos, maskPos, children}: {img: string, pos: number[], maskPos: string[], children?: JSX.Element[] | JSX.Element}) => {
            const Block = styled.div`
              display: flex;
              grid-column: ${pos[0]};
              grid-row: ${pos[1]};
              width: 100%;
              height: 100%;
              position: relative;
              align-items: center;
              justify-content: center;

              &::before {
                content: "";
                width: 100%;
                height: 100%;
                position: absolute;
                background-color: ${lineColors[line]};
                mask-image: url('${img}');
                z-index: -1;
                mask-repeat: no-repeat;
                mask-position: ${maskPos.join(' ')};
              }
            `
            return (
              <Block>
                {children}
              </Block>
            )
          }
          const Station = styled.div`
            border: 3px solid ${lineColors[line]};
            border-radius: 50%;
            background-color: #ffffff; // 이거 환승 노선 색 그라데이션으로 해서 환승역 알리기
            width: 15px;
            height: 15px;
          `
          if (item.type === 'road') {
            const isvertical = item.direction.includes('v')
            const startX = item.pos[0][0]
            const startY = item.pos[0][1]
            const endX = item.pos[1][0]
            const endY = item.pos[1][1]
            const direction = {
              v: 'column',
              rv: 'column-reverse',
              h: 'row',
              rh: 'row-reverse',
            }
            const Road = styled.div`
              display: flex;
              justify-content: space-evenly;
              flex-direction: ${direction[item.direction]};
              width: 100%;
              background: linear-gradient(90deg, #00000000 45%, ${lineColors[line]} 45%, ${lineColors[line]} 55%, #00000000 55%);
              mask-image: url('${roadImg}');
              grid-column: ${isvertical ? startX : `${startX} / ${Math.abs(startX - endX)+startX+1}`}; // 수직이면 x축으로 길이 변화 없으니까 기점x = 종점x => 기점x로만 x 설정
              grid-row: ${isvertical ? `${startY} / ${Math.abs(startY - endY)+startY+1}` : startY}; // 수직이면 y축으로 높이 변화 있으니까 계산함
              color: #ffffff;
              align-items: center;
            `
            return (
              <Road>
                {
                  nowLineRoadStations[item.group-1].map(stationCode => {
                    return (
                      <Station></Station>
                    )
                  })
                }
              </Road>
            )
          }
          else if (item.type.startsWith('turn')) {
            const turnImgs: Record<string, {img: string, pos: [string, string]}> = {
              turnar: { img: turnar, pos: ['top', 'right'] },
              turnal: { img: turnal, pos: ['bottom', 'left'] },
              turnbr: { img: turnbr, pos: ['bottom', 'right'] },
              turnbl: { img: turnbl, pos: ['top', 'left'] }
            }
            return <OneBlock img={turnImgs[item.type].img} pos={item.pos} maskPos={turnImgs[item.type].pos} />
          }
          else if (item.type === 'branchr') {
            console.log(item)
            return (
              <OneBlock img={branchrImg} pos={item.pos} maskPos={['center', 'right']}>
                <Station>
                  {/* {nowLineRoadStations[item.group-1][0]} */}
                </Station>
              </OneBlock>
            )
          }
          return <div/>
        })
      }
    </Map>
  )
}

export default LineRoadMap