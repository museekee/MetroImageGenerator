import combinedStations from "./combinedStations.json"
import { ICombinedStation } from "./types"

export const stations: ICombinedStation[] = combinedStations as ICombinedStation[]

export const findStationByStationCode = (code: string) => stations.find(v => v.codes.includes(code))