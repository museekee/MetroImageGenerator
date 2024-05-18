import React from 'react'
import './../../assets/styles/page.css'
import StationCard from '../layout/StationCard'
import stations from './../../data/combinedStations.json'
import { useNavigate, useParams } from 'react-router-dom'

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
    </main>
  )
}

export default Station