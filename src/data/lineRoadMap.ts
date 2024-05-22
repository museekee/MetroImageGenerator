import lineRoadMap from "./lineRoadMap.json"
import { ILineRoadMap, Lines } from "./types"

const typedLineRoadMap: Record<Lines, ILineRoadMap> = lineRoadMap as unknown as Record<Lines, ILineRoadMap>

export default typedLineRoadMap