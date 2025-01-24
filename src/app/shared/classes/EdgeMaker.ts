import G6, { Edge, IGroup, IShape, ModelConfig } from "@antv/g6";
import { ChartEdge } from "@models/chart";


export function registerCustomEdge() {
    G6.registerEdge('customEdge', {
            draw(cfg: ModelConfig | undefined, group: IGroup | undefined): IShape {
                let config = cfg as unknown as ChartEdge;
                return group as unknown as IShape;
            },
        }
    )
}