export type Lines = '가상' | '1호선' | '2호선' | '3호선' | '4호선' | '5호선' | '6호선' | '7호선' | '8호선' | '9호선' |
             '인천1호선' | '인천2호선' | '경강선' | '경의선' | '경춘선' | '공항철도' | '서해선' |
             '수인분당선' | '신분당선' | '신림선' | '우이신설경전철' | '김포골드라인' | '용인경전철' |
             '의정부경전철' | 'GTX-A'

interface ICombinedStation {
    map_name?: string // 노선도 상에서만 보일 이름
    name_ko: string
    name_en: string
    name_jp: string
    name_cn: string
    lines: Lines[]
    codes: string[]
}

type RoadMapType = 'lineCircle' | 'turnar' | 'turnbr' | 'turnal' | 'turnbl'
type RoadMapBranchType = 'branchr' | 'branchl'
type RoadMapDirection = 'h' | 'v' | 'rh' | 'rv' // horizontal, vertical, reverse horizontal, reverse vertical
export type LineRoad = {
    type: 'road'
    group: boolean
    pos: number[][]
    direction: RoadMapDirection
} | {
    type: RoadMapBranchType,
    group: boolean
    pos: number[]
} | {
    type: RoadMapType
    pos: number[]
}
interface ILineRoadMap {
    size: number[]
    count: number[]
    map: LineRoad[]
    destinations: string[]
}
type LineRoadMapStations = Record<Lines, string[][]>
type IlineRoadMapAdSettings = Record<Lines, Record<string, {
    align: 'left' | 'right'
    text?: {
        name?: string
        gap?: [number, number]
    }
    box?: {
        gap?: [number, number]
    }
}>>