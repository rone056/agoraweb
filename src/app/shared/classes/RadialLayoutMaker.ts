import G6, { EdgeConfig, Graph, GraphData, NodeConfig } from "@antv/g6";
import { Domaine } from "@models/domaine";
import { G6LayoutMaker } from "./G6LayoutMaker";
import { registerAddNode } from "./NodeMaker";


export class RadialLayoutMaker extends G6LayoutMaker {
    addNodePoint: string = "addNodePoint"

    constructor(pDomaine: Domaine) {
        super(pDomaine)
        this.ratioEspacement = 2.5;
        registerAddNode()
    }  

    make(container: string): Graph {
        let graph: Graph = new G6.Graph({
			container: container,
            fitView: true,
            minZoom: 0.00001,
            maxZoom: 100,
            modes: {
                default: ['drag-canvas', 'zoom-canvas'],
            },
            linkCenter: true
		});

        graph.data(this.generateGraphData(this.domaine, this.createEmptyGraphData()))

        return graph
    }

    /**
     * 
     * @param input The top domaine of the graph
     * @param graph The graph
     * @returns The GraphData
     */
    private generateGraphData(input: Domaine, graph: GraphData): GraphData {
        this.refIncArray.push(this.calcIncrement())
        //graph.nodes?.push(this.createCircleTarget(this.refIncArray[0], 0));

		let node: NodeConfig = this.createNode(input.id, input.name, [0,0], this.nodeSize * 2, undefined, input.style)
		graph.nodes?.push(node);

		if(input.children?.length > 0) {
            let angle = 0;
            let first: [string, number] = ["", 0]
            let last: [string, number] = ["", 0]
            let angleIncrement = this.calcAngleIncrement(360 / (input.children.length / 2))

			input.children.forEach((domaine, index) => { 
                if(index == 0){
                    first = [domaine.id, angle]
                    this.createGraphChildren(domaine, graph, angle, input.id);
                    last = [domaine.id, angle]
                    angle += angleIncrement / 2;
                } else {
                    this.createGraphChildren(domaine, graph, angle, input.id);
                    graph.edges?.push(this.createCurvedEdge([domaine.id, angle], last, 0))
                    last = [domaine.id, angle]
                    angle += angleIncrement / 2;
                }

                graph.nodes?.push(this.createAddNode(this.addNodePoint+domaine.id, this.calcNodeCoordinates(0, angle)));
                graph.edges?.push(this.createCurvedEdge([this.addNodePoint+domaine.id, angle], last, 0))
                last = [this.addNodePoint+domaine.id, angle]
                angle += angleIncrement / 2;
			});
            graph.edges?.push(this.createCurvedEdge(first, last, 0))
		} else {
            let numberOfAddNode = 4
            let angle = 0;
            let first: [string, number] = ["", 0]
            let last: [string, number] = ["", 0]
            let angleIncrement = this.calcAngleIncrement(360 / (numberOfAddNode / 2))
            for(let i = 0; i < numberOfAddNode; i++){
                angle += angleIncrement / 2;
                let currentId = this.addNodePoint+i
                if(i == 0){
                    first = [currentId, angle]
                    graph.nodes?.push(this.createAddNode(currentId, this.calcNodeCoordinates(0, angle)));
                    last = [currentId, angle]
                } else {
                    graph.nodes?.push(this.createAddNode(currentId, this.calcNodeCoordinates(0, angle)));
                    graph.edges?.push(this.createCurvedEdge([currentId, angle], last, 0))
                    last = [currentId, angle]
                }

                angle += angleIncrement / 2;
            }
            graph.edges?.push(this.createCurvedEdge(first, last, 0))
        }

		return graph;
	}

    /**
     * Iterative method to generate all child node of the graph
     * @param input the current domaine
     * @param graph the graph
     * @param angle the positionning angle
     * @param parentId the parent node Id
     * @param depth the depth of iteration
     * @returns the GraphData
     */
	private createGraphChildren(input: Domaine, graph: GraphData, angle: number, parentId: string, depth: number = 0) : GraphData {        
		graph.nodes?.push(this.createNodeWithChildren(input.id, input.name, this.calcNodeCoordinates(depth, angle), this.nodeSize, input.children.length > 0));
        graph.edges?.push(this.createLineEdge(parentId, input.id, false))

		return graph;
	}

    private createNodeWithChildren(id: string, name: string, position: [number, number], size: number, hasChildren: boolean = false): NodeConfig{
        return {
			id: id,
			x: position[0],
			y: position[1],
			label: this.fittingString(name, size, 6),
            labelCfg: {
			    style: {
                    fontSize: 6,
                    textAlign: "center",
                    fill: '#fff'
                }
            },
            size: size,
			type: "node",
            style: {
                lineWidth: 1,
                lineDash: hasChildren ? [size / 10] : [0],
                fill: '#757de8',
                stroke: '#002984',
                cursor: 'pointer'
            }
		};
    }

    private createAddNode(id: string, position: [number, number]): NodeConfig {
        return {
			id: id,
			x: position[0],
			y: position[1],
            refInc: this.nodeSize,
			type: "add-node",
            style: {
                cursor: 'pointer'
            }
		};
    }

    ////////////////////////////////////////////////////////////
    ////// Utils methods for preparing the graph data //////////
    ////////////////////////////////////////////////////////////

    /**
     * Return the value of increment for a specific depth
     * @param depth the current depth
     * @param previousRefInc the previous value of increment
     * @returns the increment for this specific depth
     */
    private calcIncrement(): number {
        let size = this.nodeSize * this.ratioEspacement
        let perimetre = size * this.domaine.children.length

        let refInc = perimetre  / (2 * Math.PI)

        if(refInc < (this.nodeSize * 2)){
            refInc = this.nodeSize * 2
        }

        return refInc
    }
}