import lineRoadMap from "./lineRoadMap.json"
import { ILineRoadMap, LineRoadMapPositions, LineRoadMapStations, Lines } from "./types"
import lineRoadMapStations from "./lineRoadMapStations.json"
import lineRoadMapPosition from "./lineRoadMapPosition.json"

const typedLineRoadMap: Record<Lines, ILineRoadMap> = lineRoadMap as unknown as Record<Lines, ILineRoadMap>
const typedLineRoadMapStations: LineRoadMapStations = lineRoadMapStations as unknown as LineRoadMapStations
const typedLineRoadMapPosition: LineRoadMapPositions = lineRoadMapPosition as unknown as LineRoadMapPositions

export default {map: typedLineRoadMap, stations: typedLineRoadMapStations, position: typedLineRoadMapPosition}