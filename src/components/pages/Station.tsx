import React, { useEffect, useState } from 'react'
import './../../assets/styles/page.css'
import StationCard from '../layout/StationCard'
import stations from './../../data/combinedStations'
import { useParams } from 'react-router-dom'
import LineRoadMap from '../layout/LineRoadMap'

const Station = () => {
  const params = useParams()
  const [code, setCode] = useState(params.code)
  useEffect(() => {
    console.log(code)
    window.history.pushState('', '', `/station/${code}`)
  }, [code])
  const stationIdx = stations.findIndex(v => v.codes.includes(code ?? ""))
  if (stationIdx === -1) {
    alert("역 코드가 올바르지 않습니다.")
    window.history.back()
  }
  return (
    <main>
      <StationCard station={stations[stationIdx]} onClick={setCode} />
      <LineRoadMap line='1호선' nowStation={stations[stationIdx]} onClick={setCode} />
    </main>
  )
}

export default Station