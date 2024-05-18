import React from 'react'
import './../../assets/styles/page.css'
import StationCard from '../layout/StationCard'
import stations from './../../data/combinedStations.json'

const Station = () => {
  return (
    <main>
      <StationCard station={stations[50]} />
    </main>
  )
}

export default Station