import React from "react"
import styled from "styled-components"
import lineRoadMap from "./../../data/lineRoadMap"
import { ICombinedStation, Lines, RoadMapBranchType } from "../../data/types"
import { getLineColor, getLineIcon } from "../../data/lineDatas"
import roadImg from "./../../assets/images/lineRoadMap/road.svg"
import turnar from "./../../assets/images/lineRoadMap/turnar.svg"
import turnal from "./../../assets/images/lineRoadMap/turnal.svg"
import turnbr from "./../../assets/images/lineRoadMap/turnbr.svg"
import turnbl from "./../../assets/images/lineRoadMap/turnbl.svg"
import branchrImg from "./../../assets/images/lineRoadMap/branchr.svg"
import branchlImg from "./../../assets/images/lineRoadMap/branchl.svg"
import branchbImg from "./../../assets/images/lineRoadMap/branchb.svg"
import { findStationByStationCode } from "./../../data/combinedStations"

const Map = styled.div<{ count: number[], size: number[] }>`
  display: grid;
  grid-template-columns: ${props => `repeat(${props.count[0]}, ${props.size[0]}px)`};
  grid-template-rows:  ${props => `repeat(${props.count[1]}, ${props.size[1]}px)`};
  justify-items: center;
`
const LineCircle = styled.div<{ line: Lines, pos: number[] }>`
  display: flex;
  border-radius: 50%;
  height: 105%;
  aspect-ratio: 1;
  background-color: ${props => getLineColor(props.line)};
  font-size: 30px;
  font-family: ${props => props.line.length > 3 ? 'korailc' : 'korail'};
  align-items: center;
  justify-content: center;
  color: #ffffff;
  grid-column: ${props => props.pos[0]};
  grid-row: ${props => props.pos[1]};
`
type TOneBlock = {
  img: string,
  pos: number[],
  maskPos: string[],
  children?: JSX.Element[] | JSX.Element,
  line: Lines
}
const OneBlock = styled.div<TOneBlock>`
  display: grid;
  grid-column: ${props => props.pos[0]};
  grid-row: ${props => props.pos[1]};
  width: 100%;
  height: 100%;
  position: relative;
  align-items: center;
  justify-content: center;
  grid-auto-flow: column;

  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: ${props => getLineColor(props.line)};
    mask-image: url('${props => props.img}');
    z-index: -1;
    mask-repeat: no-repeat;
    mask-position: ${props => props.maskPos.join(' ')};
  }
`
const StationCircle = styled.div<{ line: Lines }>`
  border: 2.5px solid ${props => getLineColor(props.line)};
  border-radius: 50%;
  width: 15px;
  aspect-ratio: 1;
  background: #ffffff;

  &.transfer {
    border-width: 4px;
    width: 25px;
  }
  &.center {
    transform: scale(1.5) translate(-7.5px, 0px);
  }
  &.thisStation {
    position: relative;
    z-index: 2;
    border: 3px solid #ff0000;
    border-width: 6px;
    width: 35px;
  }
`
const StationBox = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 5px;

  &.right {
    transform: translate(calc(50% + 5px), 0px); // StationBox 50%해서 거의 가운데로 옮기고 + 5px를 함으로써 Road에서도 가운데로 만듦(RoadWidth / 2)
    translate: calc(-15px / 2 - 5px) 0px; // (-Circle width / 2) - (RoadWidth / 2)
    flex-direction: row;

    &.transfer {
      translate: calc(-25px / 2 - 5px) 0px;
    }
    &.thisStation { 
      translate: calc(-35px / 2 - 5px) 0px;
    }
  }
  &.left {
    transform: translate(calc(-50% + 5px), 0px); // StationBox 50%해서 거의 가운데로 옮기고 + 5px를 함으로써 Road에서도 가운데로 만듦(RoadWidth / 2)
    translate: calc(15px / 2 - 5px) 0px; // (Circle width / 2) - (RoadWidth / 2)
    flex-direction: row-reverse;

    &.transfer {
      translate: calc(25px / 2 - 5px) 0px;
    }
    &.thisStation { 
      translate: calc(35px / 2 - 5px) 0px;
    }
  }
  &.top {
    flex-direction: column;
  }
  &.bottom {
    flex-direction: column-reverse;
  }
`
type TStationName = {
  gap?: [number, number]
}
const StationName = styled.div<TStationName>`
  color: #222222;
  width: max-content;
  font-size: 13px;
  white-space: pre-line;
  user-select: none;

  &.transfer {
    font-size: 15px;
    font-weight: bold;
  }
  &.thisStation {
    font-size: 15px;
    z-index: 2;
  }
`
const Station: React.FC<{
  name_ko?: string
  line: Lines
  boxClassName?: string
  gap?: [number, number],
  align?: 'left' | 'right' | 'top' | 'bottom',
  circleType?: 'normal' | 'transfer' | 'thisStation' | string
} & React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const stationBoxClasses = []
  stationBoxClasses.push(props.align)
  stationBoxClasses.push(props.circleType ?? 'normal')
  const stationCircleClassName = props.className?.split(' ') ?? []
  stationCircleClassName.push(props.circleType ?? 'normal')
  return (
    <StationBox className={stationBoxClasses.join(' ')} onClick={props.onClick}>
      <StationCircle
        line={props.line}
        className={stationCircleClassName.join(' ')}
        style={props.style}
      />
      <StationName gap={props.gap} className={props.className}>{props.name_ko}</StationName>
    </StationBox>
  )
}
type TRoad = {
  isvertical: boolean,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  direction: string,
  line: Lines
}
const Road = styled.div<TRoad>`
  display: flex;
  justify-content: space-evenly;
  flex-direction: ${props => props.direction};
  width: 10px;
  background: ${props => getLineColor(props.line)};
  grid-column: ${props => props.isvertical ? props.startX : `${props.startX} / ${Math.abs(props.startX - props.endX)+props.startX+1}`}; // 수직이면 x축으로 길이 변화 없으니까 기점x = 종점x => 기점x로만 x 설정
  grid-row: ${props => props.isvertical ? `${props.startY} / ${Math.abs(props.startY - props.endY)+props.startY+1}` : props.startY}; // 수직이면 y축으로 높이 변화 있으니까 계산함
  color: #ffffff;
  align-items: center;
  position: relative;
`
const LineRoadMap = ({ line, nowStation, onClick }: {line: Lines, nowStation?: ICombinedStation, onClick: (stationCode: string) => void}) => {
  const nowLineRoadMap = lineRoadMap.map[line]
  const nowLineRoadStations = lineRoadMap.stations[line]
  const nowLineAdSettings = lineRoadMap.adSettings[line]
  const turnImgs: Record<string, {img: string, pos: [string, string]}> = {
    turnar: { img: turnar, pos: ['top', 'right'] },
    turnal: { img: turnal, pos: ['bottom', 'left'] },
    turnbr: { img: turnbr, pos: ['bottom', 'right'] },
    turnbl: { img: turnbl, pos: ['top', 'left'] }
  }
  const branchImgs: Record<string, {img: string }> = {
    branchr: { img: branchrImg },
    branchl: { img: branchlImg },
    branchb: { img: branchbImg },
  }
  let groupIdx = -1
  return (
    <Map size={nowLineRoadMap.size} count={nowLineRoadMap.count} onSelect={() => false} onDragStart={() => false}>
      {
        nowLineRoadMap.map.map((item, idx) => {
          if (item.type === 'lineCircle') {
            return (
              <LineCircle line={line} pos={item.pos}>{ getLineIcon(line) }</LineCircle>
            )
          }
          else {
            if (item.type === 'road') {
              const isvertical = item.direction.includes('v')
              const direction = {
                v: 'column',
                rv: 'column-reverse',
                h: 'row',
                rh: 'row-reverse',
              }
              const params = {
                isvertical: isvertical,
                startX: item.pos[0][0],
                startY: item.pos[0][1],
                endX: item.pos[1][0],
                endY: item.pos[1][1],
                direction: direction[item.direction],
                line: line
              }
              if (item.group) // 자식 있음?
                groupIdx++
              else return ( // 없음
                <Road {...params} />
              )
              return ( // 있음
                <Road {...params}>
                  {
                    nowLineRoadStations[groupIdx].map(stationCode => {
                      const thisStation = findStationByStationCode(stationCode)
                      const lines = thisStation?.lines.filter(v => v !== line) // 현제 노선 제외한 노선
                      const colors = lines?.map(v => getLineColor(v))
                      const adSettings = Object.keys(nowLineAdSettings).includes(stationCode) ? nowLineAdSettings[stationCode] : null
                      const stationParams = {
                        line: line,
                        name_ko: adSettings?.name ?? thisStation?.name_ko,
                        align: adSettings?.align ?? "right",
                        onClick: () => onClick(stationCode),
                        gap: adSettings?.gap,
                        circleType: 'normal'
                      }
                      if (nowStation?.codes.includes(stationCode)) stationParams.circleType = "thisStation"
                      if (lines?.length === 0) return <Station {...stationParams}/>
                      else stationParams.circleType = 'transfer'
                      if (nowStation?.codes.includes(stationCode)) stationParams.circleType = "thisStation"
                      return (
                        <Station
                          {...stationParams}
                          style={{background: `${colors?.length === 1 ? colors[0] : `linear-gradient(135deg, ${colors?.join(', ')})`}`}}
                        />
                      )
                    })
                  }
                </Road>
              )
            }
            else if (item.type.startsWith('turn')) {
              return <OneBlock line={line} img={turnImgs[item.type].img} pos={item.pos} maskPos={turnImgs[item.type].pos} />
            }
            else if (item.type.startsWith('branch')) {
              //@ts-ignore
              if (item.group)
                groupIdx++
              else return (
                <OneBlock
                  line={line}
                  img={branchImgs[item.type].img}
                  pos={item.pos}
                  maskPos={['center', 'right']} />
              )
              return (
                <OneBlock
                  line={line}
                  img={branchImgs[item.type].img}
                  pos={item.pos}
                  maskPos={['center', 'right']}
                  style={{
                    justifyContent: nowLineRoadStations[groupIdx].length == 1 ? 'center' : 'unset'
                  }}>
                  {
                    //@ts-ignore
                    nowLineRoadStations[groupIdx].map((stationCode, idx) => {
                      const classNames = [
                        nowLineRoadStations[groupIdx].length-1 == idx ? 'transfer': '', 
                        nowStation?.codes.includes(stationCode) ? "thisStation" : ''
                      ]
                      const thisStation = findStationByStationCode(stationCode)
                      const adSettings = Object.keys(nowLineAdSettings).includes(stationCode) ? nowLineAdSettings[stationCode] : null
                      classNames.push("right")
                      return (
                        <Station
                          boxClassName={[
                            nowLineRoadStations[groupIdx].length !== 1 ? 'center': '', 'center'
                          ][idx]}
                          line={line}
                          name_ko={adSettings?.name ?? thisStation?.name_ko}
                          className={classNames.join(' ')}
                          onClick={() => onClick(stationCode)}
                          align={adSettings?.align}
                          gap={adSettings?.gap}
                        />
                      )
                    })
                  }
                </OneBlock>
              )
            }
          }
          return <div/>
        })
      }
    </Map>
  )
}
LineRoadMap.defaultProps = {
  onClick: () => {}
}
export default LineRoadMap