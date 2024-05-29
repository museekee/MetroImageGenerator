import lineRoadMap from "./lineRoadMap.json"
import { ILineRoadMap, IlineRoadMapAdSettings, LineRoadMapStations, Lines } from "./types"
import lineRoadMapStations from "./lineRoadMapStations.json"
import lineRoadMapAdSettings from "./lineRoadMapAdSettings.json"

const typedLineRoadMap: Record<Lines, ILineRoadMap> = lineRoadMap as unknown as Record<Lines, ILineRoadMap>
const typedLineRoadMapStations: LineRoadMapStations = lineRoadMapStations as unknown as LineRoadMapStations
const typedLineRoadMapAdSettings: IlineRoadMapAdSettings = lineRoadMapAdSettings as unknown as IlineRoadMapAdSettings

export default {map: typedLineRoadMap, stations: typedLineRoadMapStations, adSettings: typedLineRoadMapAdSettings}