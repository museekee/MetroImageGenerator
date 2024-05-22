import React from "react"
import styled from "styled-components"
import lineRoadMap from "./../../data/lineRoadMap"
import { LineRoad, Lines } from "../../data/types"
import lineColors from "../../data/lineColors"
import roadImg from "./../../assets/images/lineRoadMap/road.svg"
import turnar from "./../../assets/images/lineRoadMap/turnar.svg"
import turnal from "./../../assets/images/lineRoadMap/turnal.svg"
import turnbr from "./../../assets/images/lineRoadMap/turnbr.svg"
import turnbl from "./../../assets/images/lineRoadMap/turnbl.svg"

const LineRoadMap = ({ line }: {line: Lines}) => {
  const nowLineRoadMap = lineRoadMap[line]
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
              width: ${isvertical ? 10 : 100}px;
              background-color: ${lineColors[line]};
              mask-image: url('${roadImg}');
              grid-column: ${isvertical ? startX : `${startX} / ${Math.abs(startX - endX)+startX+1}`}; // 수직이면 x축으로 길이 변화 없으니까 기점x = 종점x => 기점x로만 x 설정
              grid-row: ${isvertical ? `${startY} / ${Math.abs(startY - endY)+startY+1}` : startY}; // 수직이면 y축으로 높이 변화 있으니까 계산함
              color: #ffffff;
            `
            return <Road></Road>
          }
          else if (item.type.startsWith('turn')) {
            const turnImgs: Record<string, {img: string, pos: [string, string]}> = {
              turnar: { img: turnar, pos: ['top', 'right'] },
              turnal: { img: turnal, pos: ['bottom', 'left'] },
              turnbr: { img: turnbr, pos: ['bottom', 'right'] },
              turnbl: { img: turnbl, pos: ['top', 'left'] }
            }
            const Turn = styled.div`
              grid-column: ${item.pos[0]};
              grid-row: ${item.pos[1]};
              width: 100%;
              height: 100%;
              background-color: ${lineColors[line]};
              mask-image: url('${turnImgs[item.type].img}');
              mask-repeat: no-repeat;
              mask-position: ${turnImgs[item.type].pos.join(' ')};
            `
            return <Turn />
          }
          return <div/>
        })
      }
    </Map>
  )
}

export default LineRoadMap