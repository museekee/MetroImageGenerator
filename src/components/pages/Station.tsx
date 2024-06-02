import React, { useEffect, useState } from 'react'
import './../../assets/styles/page.css'
import StationCard from '../layout/StationCard'
import { findStationByStationCode, stations } from './../../data/combinedStations'
import { useParams } from 'react-router-dom'
import LineRoadMap from '../layout/LineRoadMap'
import { Lines } from '../../data/types'

const Station = () => {
  const params = useParams()
  const [code, setCode] = useState(params.code ?? "100-3")
  const [line, setLine] = useState<Lines>('1호선')
  useEffect(() => {
    console.log(code)
    const nowStation = findStationByStationCode(code)
    if (!nowStation?.lines.includes(line)) {
      setLine(nowStation?.lines[0] ?? '1호선')
    }
    window.history.pushState('', '', `/station/${code}`)
  }, [code])
  const stationIdx = stations.findIndex(v => v.codes.includes(code ?? ""))
  if (stationIdx === -1) {
    alert("역 코드가 올바르지 않습니다.")
    window.history.back()
  }
  return (
    <main>
      <StationCard station={stations[stationIdx]} onStationClick={setCode} onLineClick={setLine} />
      <LineRoadMap line={line} nowStation={stations[stationIdx]} onClick={setCode} />
    </main>
  )
}

export default Station