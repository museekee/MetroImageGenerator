import React from 'react'
import './../../assets/styles/page.css'
import StationCard from '../layout/StationCard'
import stations from './../../data/combinedStations'
import { useNavigate, useParams } from 'react-router-dom'
import LineRoadMap from '../layout/LineRoadMap'

const Station = () => {
  const { name_ko } = useParams()
  const navigate = useNavigate()
  const stationIdx = stations.findIndex(v => v.name_ko === name_ko)
  if (stationIdx === -1) {
    alert("역 이름이 올바르지 않습니다.")
    navigate(-1)
  }
  return (
    <main>
      <StationCard station={stations[stationIdx]} />
      <LineRoadMap line='1호선' />
    </main>
  )
}

export default Station