type mapNameAligns = 'left' | 'cetrer' | 'right'
type pointTypes = 'normal_transfer' | 'v2_transfer' | 'v3_transfer'
                | 'h4_transfer' | '45_3_transfer' | '45_4_transfer' 
type labelDirections = 't'|'r'|'b'|'l'|'tr'|'br'|'bl'|'tl'

interface ICombinedStation {
    map_name?: string // 노선도 상에서만 보일 이름
    name_ko: string
    name_en: string
    name_jp: string
    name_cn: string
    lines: string[]
    codes: string[]
}