import G6, { IGroup, IShape, ModelConfig } from "@antv/g6";
import { ChartNode } from "@models/chart";

export function registerCircleTarget() {
    G6.registerNode('circleTarget', {
        draw(cfg: ModelConfig | undefined, group: IGroup | undefined): IShape {
            let config = cfg as unknown as ChartNode;

            group?.addShape('circle', {
                attrs: {
                    x: 0,
                    y: 0,
                    r: config.refInc,
                    stroke: '#757575',
                },
                name: 'circle-shape',
            });

            return group as unknown as IShape;
        },
    });
    G6.registerNode('target', {
        draw(cfg: ModelConfig | undefined, group: IGroup | undefined): IShape {
            let config = cfg as unknown as ChartNode;
            const baseR = config.size;

            // Ref line
            let refR = baseR;
            for (let i = 0; i < 10; i++) {
                let color = '#5ad8a6'
                if (i == 0) {
                    color = '#000'
                }
                group?.addShape('circle', {
                    attrs: {
                        x: 0,
                        y: 0,
                        r: (refR += config.refInc),
                        stroke: color,
                    },
                    name: 'target-shape',
                });
            }

            return group as unknown as IShape;
        },
    });
}

export function registerAddNode() {
    G6.registerNode('add-node', {
        draw(cfg: ModelConfig | undefined, group: IGroup | undefined): IShape {
            let config = cfg as unknown as ChartNode;
            let rayon = config.refInc / 6
            group?.addShape('circle', {
                attrs: {
                    x: 0,
                    y: 0,
                    r: rayon,
                    stroke: '#757575',
                    fill: '#fff',
                    cursor: 'pointer'
                },
                name: 'circle-shape',
            });

            group?.addShape('marker', {
                attrs: {
                    x: 0,
                    y: 0,
                    r: rayon / 2,
                    cursor: 'pointer',
                    symbol: function(x: number, y: number, r: number){
                        return [
                            ['M', x - r, y],
                            ['L', x + r, y],
                            ['M', x, y - r],
                            ['L', x, y + r]
                        ]
                    },
                    stroke: '#757575',
                    lineWidth: 2
                },
                name: 'text-shape',
            });

            return group as unknown as IShape;
        },
    });
}