import React from "react"
import styled from "styled-components"
import lineRoadMap from "./../../data/lineRoadMap"
import { ICombinedStation, Lines, RoadMapBranchType } from "../../data/types"
import lineColors from "../../data/lineColors"
import roadImg from "./../../assets/images/lineRoadMap/road.svg"
import turnar from "./../../assets/images/lineRoadMap/turnar.svg"
import turnal from "./../../assets/images/lineRoadMap/turnal.svg"
import turnbr from "./../../assets/images/lineRoadMap/turnbr.svg"
import turnbl from "./../../assets/images/lineRoadMap/turnbl.svg"
import branchrImg from "./../../assets/images/lineRoadMap/branchr.svg"
import branchlImg from "./../../assets/images/lineRoadMap/branchl.svg"
import stations from "./../../data/combinedStations"

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
  background-color: ${props => lineColors[props.line]};
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
    background-color: ${props => lineColors[props.line]};
    mask-image: url('${props => props.img}');
    z-index: -1;
    mask-repeat: no-repeat;
    mask-position: ${props => props.maskPos.join(' ')};
  }
`
const StationCircle = styled.div<{ line: Lines }>`
  border: 3px solid ${props => lineColors[props.line]};
  border-radius: 50%;
  width: 15px;
  height: 15px;
  background: #ffffff;

  &.transfer {
    transform: scale(1.5);
  }
  &.center {
    transform: scale(1.5) translate(-7.5px, 0px);
  }
  &.thisStation {
    position: relative;
    z-index: 2;
    border: 3px solid #ff0000;
    transform: scale(2.5);
  }
`
const StationBox = styled.div`
  position: relative;
  cursor: pointer;

  &.center {
    transform: translate(-7.5px, 0px)
  }
`
type TStationName = {
  position: {
    gap: [number, number],
    align: 'left' | 'right'
  } | null
}
const StationName = styled.div<TStationName>`
  position: absolute;
  color: #222222;
  left: 20px;
  width: max-content;
  top: 0;
  font-size: 13px;
  white-space: pre-line;
  user-select: none;
  transform: translate(${props => props.position?.gap.map(v => `${v}px`).join(',')});

  &.transfer {
    left: 23px;
    font-size: 15px;
    font-weight: bold;
  }
  &.thisStation {
    left: 31px;
    font-size: 15px;
    z-index: 2;
  }
`
const Station: React.FC<{
  name_ko?: string
  line: Lines
  boxClassName?: string
} & TStationName & React.HTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <StationBox className={props.boxClassName} onClick={props.onClick}>
      <StationCircle
        line={props.line}
        className={props.className}
        style={props.style}
      />
      <StationName position={props.position} className={props.className}>{props.name_ko}</StationName>
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
  width: 100%;
  background: linear-gradient(90deg, #00000000 45%, ${props => lineColors[props.line]} 45%, ${props => lineColors[props.line]} 55%, #00000000 55%);
  /* mask-image: url('${roadImg}'); */
  grid-column: ${props => props.isvertical ? props.startX : `${props.startX} / ${Math.abs(props.startX - props.endX)+props.startX+1}`}; // 수직이면 x축으로 길이 변화 없으니까 기점x = 종점x => 기점x로만 x 설정
  grid-row: ${props => props.isvertical ? `${props.startY} / ${Math.abs(props.startY - props.endY)+props.startY+1}` : props.startY}; // 수직이면 y축으로 높이 변화 있으니까 계산함
  color: #ffffff;
  align-items: center;
  position: relative;
`
const LineRoadMap = ({ line, nowStation, onClick }: {line: Lines, nowStation?: ICombinedStation, onClick: (stationCode: string) => void}) => {
  const nowLineRoadMap = lineRoadMap.map[line]
  const nowLineRoadStations = lineRoadMap.stations[line]
  const nowLineRoadposition = lineRoadMap.position[line]
  const turnImgs: Record<string, {img: string, pos: [string, string]}> = {
    turnar: { img: turnar, pos: ['top', 'right'] },
    turnal: { img: turnal, pos: ['bottom', 'left'] },
    turnbr: { img: turnbr, pos: ['bottom', 'right'] },
    turnbl: { img: turnbl, pos: ['top', 'left'] }
  }
  const branchImgs: Record<string, {img: string }> = {
    branchr: { img: branchrImg },
    branchl: { img: branchlImg },
  }
  let groupIdx = -1
  return (
    <Map size={nowLineRoadMap.size} count={nowLineRoadMap.count} onSelect={() => false} onDragStart={() => false}>
      {
        nowLineRoadMap.map.map((item, idx) => {
          console.log(item)
          if (item.type === 'lineCircle') {
            return (
              <LineCircle
                line={line}
                pos={item.pos}>
                {nowLineRoadMap.icon}
              </LineCircle>
            )
          }
          else {
            if (item.type === 'road') {
              if (item.group)
                groupIdx++
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
              return (
                <Road
                  isvertical={isvertical}
                  startX={startX}
                  startY={startY}
                  endX={endX}
                  endY={endY}
                  direction={direction[item.direction]}
                  line={line}>
                  {
                    nowLineRoadStations[groupIdx].map(stationCode => {
                      const lines = stations.find(v => v.codes.includes(stationCode))?.lines.filter(v => v !== line)
                      const colors = lines?.map(v => lineColors[v])
                      const classNames = [nowStation?.codes.includes(stationCode) ? "thisStation" : ""]
                      const thisStation = stations.find(v => v.codes.includes(stationCode))
                      const position = Object.keys(nowLineRoadposition).includes(stationCode) ? nowLineRoadposition[stationCode] : null
                      if (!lines || colors?.length === 0) return (
                        <Station
                          line={line}
                          name_ko={thisStation?.map_name ?? thisStation?.name_ko}
                          className={classNames.join(' ')}
                          onClick={() => onClick(stationCode)}
                          position={position}
                        />
                      )
                      classNames.push('transfer')
                      return (
                        <Station
                          line={line}
                          name_ko={thisStation?.map_name ?? thisStation?.name_ko}
                          className={classNames.join(' ')}
                          onClick={() => onClick(stationCode)}
                          position={position}
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
                    nowLineRoadStations[groupIdx].map((stationCode, idx) => {
                      const classNames = [
                        nowLineRoadStations[groupIdx].length-1 == idx ? 'transfer': '', 
                        nowStation?.codes.includes(stationCode) ? "thisStation" : ''
                      ]
                      const thisStation = stations.find(v => v.codes.includes(stationCode))
                      const position = Object.keys(nowLineRoadposition).includes(stationCode) ? nowLineRoadposition[stationCode] : null
                      return (
                        <Station
                          boxClassName={[
                            nowLineRoadStations[groupIdx].length !== 1 ? 'center': '', 'center'
                          ][idx]}
                          line={line}
                          name_ko={thisStation?.map_name ?? thisStation?.name_ko}
                          className={classNames.join(' ')}
                          onClick={() => onClick(stationCode)}
                          position={position}
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