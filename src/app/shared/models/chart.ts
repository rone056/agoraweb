export interface ChartData {
    nodes: ChartNodes,
    edges: ChartEdges
}

export interface ChartNode {
    label: string,
    id: string,
    x: number,
    y: number,
    size: number,
    style: Object,
    refInc: number
}
export interface ChartNodes extends Array<ChartNode>{}



export interface ChartEdge {
    source: string,
    midTarget: [number, number],
    target: string,
    curve: number,
    style: Object
}
export interface ChartEdges extends Array<ChartEdge>{}