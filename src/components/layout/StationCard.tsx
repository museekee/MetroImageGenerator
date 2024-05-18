import React from 'react'
import styled from 'styled-components'
import lineColors_ from './../../data/lineColors.json'
import stationCodes_ from './../../data/sortedStationCodes.json'
import stations from './../../data/combinedStations.json'

type StationOrPath = string | StationOrPath[];
const lineColors: Record<string, string> = lineColors_
const stationCodes: Record<string, StationOrPath[]> = stationCodes_

const StationCard = ({ station }: { station: ICombinedStation }) => {
  //@ts-ignore
  const colors = station.lines.map(v => lineColors[v])
  const Card = styled.div`
    width: 2000px;
    border-radius: 250px;
    border-style: solid;
    border-width: 50px;
    border-color: transparent;
    background: linear-gradient(135deg, ${colors.length === 1 ? `${colors[0]}, ${colors[0]}` : colors.join(', ')}) border-box;
  `
  const Content = styled.div`
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    border-radius: 0px 0px 200px 200px;
    padding-top: 125px;
    padding-bottom: 125px;
  `
  const Lines = styled.div`
    display: flex;
    width: 100%;
    height: 300px;
    border-radius: 50% 0px 50% 0px;
  `
  const LineBox = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;
  `
  const StationNames = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 20px;

    & * {
      margin: 0;
      font-weight: normal;
    }
    & h1 {
      font-size: 300px;
    }
    & > div {
      display: flex;
      gap: 20px;
      align-items: center;
    }
    & h4 {
      font-size: 100px
    }
  `
  const NearStations = styled.div`
    display: grid;
    width: 100%;
    margin-top: 20px;
    grid-template-columns: 50% 50%;
    justify-content: center;
    gap: 100px;
    
    & > div:first-child {
      align-items: flex-end;
    }

    & > div {
      display: flex;
      flex-direction: column;
      gap: 20px;

      & > div {
        display: flex;
        align-items: center;
        gap: 25px;

        & > span {
          font-size: 100px;
          font-family: 'namsan';
          font-weight: bold;
        }
      }
    }
  `
  return (
    <Card>
      <Lines>
        {station.lines.map((line, idx) => 
          <LineBox style={{
            backgroundColor: lineColors[line],
            borderTopLeftRadius: idx === 0 ? 190 : 0,
            borderTopRightRadius: idx === station.lines.length-1 ? 190 : 0
          }}>
            <StationCircle line={line} stationCode={station.codes[idx]} />
            <span style={{fontSize: 50}}>{line}</span>
          </LineBox>
        )}
      </Lines>
      <Content>
        <StationNames>
          <h1>{station.name_ko}</h1>
          <h4>{station.name_en}</h4>
          <div>
            <h4>{station.name_cn}</h4>
            <h4>{station.name_jp}</h4>
          </div>
        </StationNames>
        <NearStations>
          <div>
            {station.codes.map((v, i) => {
              const line = station.lines[i]
              const nowStationIdx = findStationIndex(stationCodes[line], v)
              if (!nowStationIdx) return <div></div>
              const lastNowStationIdx = nowStationIdx[nowStationIdx.length-1]
              let result: StationOrPath | StationOrPath[] = stationCodes[line]
              for (let i = 0; i < nowStationIdx.length; i++) {
                result = result[nowStationIdx[i]]
              }

              let beforeStationCode: string | undefined;
              if (lastNowStationIdx-1 < 0 && nowStationIdx.length === 1) return <div></div> // 전 역 없음
              if (lastNowStationIdx-1 >= 0) { // 일단 전게 있음
                nowStationIdx[nowStationIdx.length-1]--
                let result: StationOrPath | StationOrPath[] = stationCodes[line]
                for (let i = 0; i < nowStationIdx.length; i++) {
                  result = result[nowStationIdx[i]]
                }
                if (typeof result === 'string')
                  beforeStationCode = result
              }
              if (beforeStationCode === undefined) return <div></div> // 전 역 없음
              else return (
                <div>
                  <StationCircle line={line} stationCode={beforeStationCode} />
                  <span>{stations.filter(v => v.codes.includes(beforeStationCode))[0].name_ko}</span>
                </div>
              )
            })}
          </div>
          <div>
            {station.codes.map((v, i) => {
              const line = station.lines[i]
              const nowStationIdx = findStationIndex(stationCodes[line], v)
              if (!nowStationIdx) return <div></div>
              
              nowStationIdx[nowStationIdx.length-1]++
              let afterStationCode: string | undefined
              let result: StationOrPath | StationOrPath[] = stationCodes[line]
              for (let i = 0; i < nowStationIdx.length; i++) {
                result = result[nowStationIdx[i]]
              }
              if (typeof result === 'string') afterStationCode = result
              else if (typeof result === 'object') 
              if (afterStationCode === undefined) return <div></div>
              else return (
                <div>
                  <StationCircle line={line} stationCode={afterStationCode} />
                  <span>{stations.filter(v => v.codes.includes(afterStationCode))[0].name_ko}</span>
                </div>
              )
            })}
            <div>
              <StationCircle line='1호선' stationCode='134' />
              <span>남영</span>
            </div>
            <div>
              <StationCircle line='4호선' stationCode='427' />
              <span>숙대입구</span>
            </div>
          </div>
        </NearStations>
      </Content>
    </Card>
  )
}

function findStationIndex(data: StationOrPath[], target: string, path: number[] = []): number[] | null {
  for (let i = 0; i < data.length; i++) {
    const current = data[i];
    if (typeof current === 'string') {
      // 현재 요소가 문자열이고, 찾고자 하는 역 이름과 일치하는 경우
      if (current === target) {
        return [...path, i]; // 현재까지의 경로에 현재 인덱스를 추가하여 반환
      }
    } else {
      // 현재 요소가 배열인 경우, 재귀적으로 탐색
      const result = findStationIndex(current, target, [...path, i]);
      if (result) {
        return result; // 찾고자 하는 역을 찾은 경우, 그 경로를 반환
      }
    }
  }
  // 찾고자 하는 역을 찾지 못한 경우
  return null;
}

const StationCircle = ({ line, stationCode }: {line: string, stationCode: string}) => {
  const Circle = styled.div`
    display: flex;
    width: 200px;
    height: 200px;
    background-color: ${lineColors[line]};
    border: 10px solid #00000088;
    font-size: 75px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-family: ${stationCode.length > 3 ? 'korailc' : 'korail'};
  `
  return (
    <Circle>
      {stationCode}
    </Circle>
  )
}

export default StationCard