import React, { useEffect, useState } from "react"
import styled from "styled-components"
import lineRoadMap from "./../../data/lineRoadMap"
import { ICombinedStation, Lines } from "../../data/types"
import { getLineColor, getLineIcon } from "../../data/lineDatas"
import turnar from "./../../assets/images/lineRoadMap/turnar.svg"
import turnal from "./../../assets/images/lineRoadMap/turnal.svg"
import turnbr from "./../../assets/images/lineRoadMap/turnbr.svg"
import turnbl from "./../../assets/images/lineRoadMap/turnbl.svg"
import branchrImg from "./../../assets/images/lineRoadMap/branchr.svg"
import branchlImg from "./../../assets/images/lineRoadMap/branchl.svg"
import branchbImg from "./../../assets/images/lineRoadMap/branchb.svg"
import { findStationByStationCode, stations } from "./../../data/combinedStations"
// destination null이면 전역, null아니면 그 역들만. 기본적으로 line명으로 lineroadmapstations따라서 함.
const Map = styled.div<{ count: number[], size: number[] }>`
  display: grid;
  grid-template-columns: ${props => `repeat(${props.count[0]}, ${props.size[0]}px)`};
  grid-template-rows:  ${props => `repeat(${props.count[1]}, ${props.size[1]}px)`};
  justify-items: center;
  align-items: center;
`
const roadColor = (line: Lines, destination: string | undefined) => !destination ? getLineColor(line) : lineRoadMap.destinations[destination].color ?? getLineColor(line)
const lineCircleFontSize = (line: string, destination: string | undefined) => {
  if (!destination) {
    return line.split('\n').length-1 === 0 ? '30px' : '17.5px'
  }
  else return lineRoadMap.destinations[destination].icon.split('\n').length-1 === 0 ? '30px' : '17.5px'
}
const LineCircle = styled.div<{ line: Lines, pos: number[], destination?: string }>`
  display: flex;
  border-radius: 50%;
  height: 105%;
  aspect-ratio: 1;
  background-color: ${props => roadColor(props.line, props.destination)};
  font-size: ${props => lineCircleFontSize(props.line, props.destination)};
  font-family: ${props => props.line.length > 3 ? 'korailc' : 'korail'};
  align-items: center;
  justify-content: center;
  color: #ffffff;
  grid-column: ${props => props.pos[0]};
  grid-row: ${props => props.pos[1]};
  white-space: pre-line;
  text-align: center;
`
type TOneBlock = {
  img: string,
  pos: number[],
  maskPos: string[],
  children?: JSX.Element[] | JSX.Element,
  line: Lines,
  destination?: string
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
    background-color: ${props => roadColor(props.line, props.destination)};
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
const StationBox = styled.div<{ gap: [number, number] }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 5px;

  &.right {
    transform: ${props => `translate(calc(50% + 5px + ${props.gap[0]}px), ${props.gap[1]}px)`}; // StationBox 50%해서 거의 가운데로 옮기고 + 5px를 함으로써 Road에서도 가운데로 만듦(RoadWidth / 2)
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
    transform: ${props => `translate(calc(-50% + 5px + ${props.gap[0]}px), ${props.gap[1]}px)`}; // StationBox 50%해서 거의 가운데로 옮기고 + 5px를 함으로써 Road에서도 가운데로 만듦(RoadWidth / 2)
    translate: ${props => `calc(15px / 2 - 5px + ${props.gap[0]}px) ${props.gap[1]}px`}; // (Circle width / 2) - (RoadWidth / 2)
    flex-direction: row-reverse;

    &.transfer {
      translate: calc(25px / 2 - 5px) 0px;
    }
    &.thisStation { 
      translate: calc(35px / 2 - 5px) 0px;
    }
  }
  &.top {
    flex-direction: column-reverse;
    translate: ${props => `${props.gap[0]}px ${props.gap[1]}px`}
  }
  &.bottom {
    transform: translate(0px, calc(50% - (15px / 2)));
    translate: ${props => `${props.gap[0]}px ${props.gap[1]}px`};

    &.thisStation { 
      transform: translate(0px, calc(50% - (35px / 2)));
    }
    flex-direction: column;
  }
`
type TStationName = {
  gap: [number, number]
}
const StationName = styled.div<TStationName>`
  color: #222222;
  width: max-content;
  font-size: 13px;
  white-space: pre-line;
  user-select: none;
  translate: ${props => `${props.gap[0]}px ${props.gap[1]}px`};

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
  name_ko?: string // 역명
  line: Lines // 노선명
  gapT?: [number, number], // 역명 gap
  gapB?: [number, number], // 박스 gap
  align?: 'left' | 'right' | 'top' | 'bottom', // 역명 왼오위아래
  circleType?: 'normal' | 'transfer' | 'thisStation' | string // 원 크기 및 모양
  isDisabled?: boolean
} & React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const stationBoxClasses = []
  stationBoxClasses.push(props.align)
  stationBoxClasses.push(props.circleType ?? 'normal')
  const stationCircleClassName = props.className?.split(' ') ?? []
  stationCircleClassName.push(props.circleType ?? 'normal')
  return (
    <StationBox
      className={stationBoxClasses.join(' ')}
      style={{
        filter: `brightness(${props.isDisabled ? 50 : 100}%) blur(${props.isDisabled ? 5 : 0}px)`
      }}
      gap={props.gapB ?? [0, 0]}
      onClick={!props.isDisabled ? props.onClick : () => {}}
    >
      <StationCircle
        line={props.line}
        className={stationCircleClassName.join(' ')}
        style={props.style}
      />
      <StationName
        gap={props.gapT ?? [0, 0]}
        className={props.className}
      >
        {props.name_ko}
      </StationName>
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
  line: Lines,
  destination?: string
}
const Road = styled.div<TRoad>`
  display: flex;
  justify-content: space-evenly;
  flex-direction: ${props => props.direction};
  width: ${props => props.isvertical ? "10px" : "100%"};
  height: ${props => props.isvertical ? "100%" : "10px"};
  background: ${props => roadColor(props.line, props.destination)};
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
  const [destination, setDestination] = useState(nowLineRoadMap.destinations[0])
  useEffect(() => {
    if (!nowLineRoadMap.destinations.includes(destination))
      setDestination(nowLineRoadMap.destinations[0])
  }, [line])
  console.log(destination)
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
  const ifStationDisabled = (stationCode: string) => {
    if (lineRoadMap.destinations[destination].codes.length === 0)
      return false
    if (!lineRoadMap.destinations[destination].codes.includes(stationCode))
      return true
  }
  let groupIdx = -1
  return (
    <Map size={nowLineRoadMap.size} count={nowLineRoadMap.count} onSelect={() => false} onDragStart={() => false}>
      {
        nowLineRoadMap.map.map((item, idx) => {
          if (item.type === 'lineCircle') {
            return (
              <LineCircle
                line={line}
                pos={item.pos}
                destination={destination}>
                { lineRoadMap.destinations[destination].icon }
              </LineCircle>
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
                line: line,
                destination: destination
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
                        name_ko: adSettings?.text?.name ?? thisStation?.name_ko,
                        align: adSettings?.align ?? "right",
                        onClick: () => onClick(stationCode),
                        gapT: adSettings?.text?.gap,
                        gapB: adSettings?.box?.gap,
                        circleType: 'normal',
                        isDisabled: ifStationDisabled(stationCode)
                      }
                      if (nowStation?.codes.includes(stationCode)) stationParams.circleType = "thisStation"
                      if (lines?.length === 0) return <Station {...stationParams}/>
                      else stationParams.circleType = 'transfer'
                      if (nowStation?.codes.includes(stationCode)) stationParams.circleType = "thisStation"
                      return (
                        <Station
                          {...stationParams}
                          style={{
                            background: `${colors?.length === 1 ? colors[0] : `linear-gradient(135deg, ${colors?.join(', ')})`}`
                          }}
                        />
                      )
                    })
                  }
                </Road>
              )
            }
            else if (item.type.startsWith('turn')) {
              return (
                <OneBlock
                  line={line}
                  img={turnImgs[item.type].img}
                  pos={item.pos}
                  maskPos={turnImgs[item.type].pos}
                  destination={destination}
                />
              )
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
                  }}
                  destination={destination}>
                  {
                    //@ts-ignore
                    nowLineRoadStations[groupIdx].map((stationCode, idx) => {
                      const adSettings = Object.keys(nowLineAdSettings).includes(stationCode) ? nowLineAdSettings[stationCode] : null
                      const thisStation = findStationByStationCode(stationCode)
                      const params = {
                        line: line,
                        name_ko: adSettings?.text?.name ?? thisStation?.name_ko,
                        align: adSettings?.align ?? "right",
                        onClick: () => onClick(stationCode),
                        gapT: adSettings?.text?.gap,
                        gapB: adSettings?.box?.gap,
                        circleType: 'normal',
                        isDisabled: ifStationDisabled(stationCode)
                      }
                      if (nowLineRoadStations[groupIdx].length-1 !== 0 && idx === 1) // 첫 번째는 지선이라 무조건 환승역
                        params.circleType = 'transfer'
                      if (nowStation?.codes.includes(stationCode))
                        params.circleType = 'thisStation'

                      return (
                        <Station
                          {...params}
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