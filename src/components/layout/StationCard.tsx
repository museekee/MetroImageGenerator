import React from 'react'
import styled from 'styled-components'
import lineColors from './../../data/lineColors'
import stationCodes_ from './../../data/sortedStationCodes.json'
import stations from './../../data/combinedStations.json'
import { useNavigate } from 'react-router-dom'
import { ICombinedStation, Lines } from '../../data/types'

//@ts-ignore
const stationCodes: {[x: string]: [string[], string, string[]][]} = stationCodes_

const StationCard = ({ station }: { station: ICombinedStation }) => {
  const navigate = useNavigate()

  const colors = station.lines.map(v => lineColors[v])
  const Card = styled.div`
    zoom: 0.25;
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
      font-family: ${station.name_ko.length < 7 ? 'korail' : 'korailc'};
    }
    & > div {
      display: flex;
      gap: 20px;
      align-items: center;
    }
    & h4 {
      font-size: 100px;
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
        gap: 25px;
        flex-direction: column;

        & > div {
          display: flex;
          align-items: center;
          gap: 25px;
          &.lnk {
            cursor: pointer;
          }

          & > span {
            font-size: 100px;
            font-family: 'namsan';
            font-weight: bold;
          }
       }
      }
    }
  `
  const BlankStation = styled.div`
    height: 200px;
  `
  function nearStations(before: boolean) {
    return station.codes.map((v, i) => {
      const line = station.lines[i]
      const nowStationCode = stationCodes[line].find(c => c[1] === v)
      if (!nowStationCode)
        return <BlankStation /> 
      const bsc = nowStationCode[0] // beforeStationCodes
      const asc = nowStationCode[2] // afterStationCodes
      return (
        <div>
          {
            new Array(bsc.length <= asc.length ? asc.length : bsc.length).fill(1).map((_, idx) => // 그래도... 한 노선끼리는 높이가 맞아야지 (상하행 중 더 많은 역을 따라감.)
              {
                try {
                  const stationCode = nowStationCode[before ? 0 : 2][idx]
                  const name_ko = stations.find(v => v.codes.includes(stationCode))!!.name_ko
                  return (
                    <div className='lnk' onClick={() => navigate(`/station/${name_ko}`)}>
                      <StationCircle line={line} stationCode={stationCode} />
                      {/* 일부러 !!씀... 오류내서 Black채우게 */}
                      <span style={{
                        fontFamily: name_ko.length < 7 ? 'namsan' : 'namsanc',
                        fontSize: name_ko.length < 8 ? 100 : 90
                      }}>{name_ko}</span>
                    </div>
                  )
                }
                catch (e) {
                  return <BlankStation /> 
                }
              }
            )
          }
        </div>
      )
    })
  }
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
            {nearStations(true)}
          </div>
          <div>
            {nearStations(false)}
          </div>
        </NearStations>
      </Content>
    </Card>
  )
}

const StationCircle = ({ line, stationCode }: {line: Lines, stationCode: string}) => {
  const Circle = styled.div`
    display: flex;
    width: 200px;
    height: 200px;
    background-color: ${lineColors[line]};
    border: 10px solid #00000088;
    font-size: ${stationCode.length > 4 ? 60 : 75}px;
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