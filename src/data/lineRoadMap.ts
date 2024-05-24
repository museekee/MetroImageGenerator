import lineRoadMap from "./lineRoadMap.json"
import { ILineRoadMap, LineRoadMapStations, Lines } from "./types"
import lineRoadMapStations from "./lineRoadMapStations.json"

const typedLineRoadMap: Record<Lines, ILineRoadMap> = lineRoadMap as unknown as Record<Lines, ILineRoadMap>
const typedLineRoadMapStations: LineRoadMapStations = lineRoadMapStations as unknown as LineRoadMapStations

export default {map: typedLineRoadMap, stations: typedLineRoadMapStations}