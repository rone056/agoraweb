import G6, { EdgeConfig, Graph, GraphData, NodeConfig } from "@antv/g6";
import { Domaine } from "@models/domaine";
import { G6LayoutMaker } from "./G6LayoutMaker";
import { registerCircleTarget } from "./NodeMaker";

export class RadialTreeMaker extends G6LayoutMaker {
    nodeNumber: number[];
    cumulatedWeight: number[] = [];
    cumulatedAngle: number[] = [];

    constructor(pDomaine: Domaine) {
        super(pDomaine)
        this.nodeNumber = this.getNodeNumberByDepth([], this.domaine, 0);
        this.init();
    }

    private init(){
        this.calcDomaineWeight(this.domaine);
        this.calcDomaineAngle(this.domaine);
        this.cumulatedWeight = this.getWeightByDepth([], this.domaine, 0);
        this.cumulatedAngle = this.getAngleByDepth([], this.domaine, 0);
        this.refIncArray = this.getIncrementArray();
    }    

    make(container: string): Graph {
        let graph: Graph = new G6.Graph({
			container: container,
            fitView: true,
            minZoom: 0.01,
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
        graph.nodes?.push(this.createCircleTarget(this.refIncArray[0], 0));

		let node: NodeConfig = this.createNode(input.id, input.name, [0,0], this.nodeSize * 2, undefined, input.style)
		graph.nodes?.push(node);

		if(input.children?.length > 0) {
            let angle = 0;

			input.children.forEach((domaine, index) => { 
				if(index == 0) {
					this.createGraphChildren(domaine, graph, angle, input.id);
				} else {
                    angle += this.calcAngleIncrement(domaine.angle);    
					this.createGraphChildren(domaine, graph, angle, input.id);
				}   
                angle += this.calcAngleIncrement(domaine.angle);
			});
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
	private createGraphChildren(input: Domaine, graph: GraphData, angle: number, parentId: string, depth: number = 1) : GraphData {        
		graph.nodes?.push(this.createNode(input.id, input.name, this.calcNodeCoordinates(depth - 1, angle), this.nodeSize, undefined, input.style));
        graph.edges?.push(this.createLineEdge(parentId, input.id, false))

        if(input.children?.length > 0) {
            let nodePoint = this.createNode("middlePoint"+input.id, "", this.calcNodeCoordinates(depth, angle), 1, false);
            graph.nodes?.push(nodePoint);
            graph.edges?.push(this.createLineEdge(input.id, nodePoint.id, true));
         
            let first: [string, number] = ["", 0]
            let last: [string, number] = ["", 0]
            let angleReel = input.angle
            let currentAngle = angle + (angleReel * Math.PI) / 360;   
            input.children.forEach((domaine, index) => {
                currentAngle -= this.calcAngleIncrement(domaine.angle);     
                if(index == 0) first = [domaine.id, currentAngle]
                if(index == input.children.length - 1) last = [domaine.id, currentAngle] 
                this.createGraphChildren(domaine, graph, currentAngle, input.id, depth + 1);
                currentAngle -= this.calcAngleIncrement(domaine.angle);
            });

            graph.edges?.push(this.createCurvedEdge(first, [nodePoint.id, angle], depth), this.createCurvedEdge([nodePoint.id, angle], last, depth));
        };

		return graph;
	}

    ////////////////////////////////////////////////////////////
    ////// Utils methods for preparing the graph data //////////
    ////////////////////////////////////////////////////////////

    /**
     * Iterative calcul of the weight of the whole Domaine object
     * @param input the Domain object for which we calculate the weight
     */
    private calcDomaineWeight(input: Domaine){
        if(input.children?.length > 0){
            input.weight = 0
            input.children.forEach((domaine) => {
                this.calcDomaineWeight(domaine);
                input.weight += domaine.weight;
            });
        } else {
            input.weight = 1
        }
    }

    /**
     * Iterative calcul of the angle of each Domaine object based on its parent and its weight
     * @param input the Domain object for which we calculate the weight
     * @param parent the parent Domain
     */
    private calcDomaineAngle(input: Domaine, parent?: Domaine){
        if(parent){
            input.angle = (input.weight * parent.angle) / parent.weight
        } else {
            input.angle = 360
        }
        input.children.forEach((domaine) => {
            this.calcDomaineAngle(domaine, input);
        });  
    }

   

    /**
     * Return an array with the weight of node at each depth
     * @param depthArray the array of weight that needs to be filled
     * @param domaine the current Domaine
     * @param depth the depth at which we are currently
     * @returns the array of weight, size equivalent to maximum depth
     */
    private getWeightByDepth(depthArray: number[], domaine: Domaine, depth: number): number[]{
        if(depthArray.length <= depth) depthArray.push(0); 
        if(domaine.children.length > 0){              
            domaine.children.forEach(element => {
                depthArray = this.getWeightByDepth(depthArray, element, depth + 1)
            });
            depthArray[depth] = depthArray[depth] + domaine.weight
        }
        return depthArray
    }

    /**
     * Return an array with the angle of node at each depth
     * @param depthArray the array of angle that needs to be filled
     * @param domaine the current Domaine
     * @param depth the depth at which we are currently
     * @returns the array of angle, size equivalent to maximum depth
     */
    private getAngleByDepth(depthArray: number[], domaine: Domaine, depth: number): number[]{
        if(depthArray.length <= depth) depthArray.push(0);    
        if(domaine.children.length > 0){      
            domaine.children.forEach(element => {
                depthArray = this.getAngleByDepth(depthArray, element, depth + 1)
            });
            depthArray[depth] = Math.ceil(depthArray[depth] + domaine.angle)
        }
        return depthArray
    }

    /**
     * Create an array of increment value for each depth
     * @returns an array of increment value
     */
    private getIncrementArray(): number[]{
        let array: number[] = []
        let previousRefInc = 0

        this.nodeNumber.forEach((_element, index) => {
            array.push(this.calcIncrement(index, previousRefInc));
            previousRefInc = array[index]
        });

        return array;
    }

    /**
     * Return the value of increment for a specific depth
     * @param depth the current depth
     * @param previousRefInc the previous value of increment
     * @returns the increment for this specific depth
     */
    private calcIncrement(depth: number, previousRefInc: number): number {
        let size = (depth > 0 ? this.nodeSize / (depth * this.ratioEspacement) : this.nodeSize * this.ratioEspacement)
        let perimetre = size * this.cumulatedWeight[depth]

        let refInc = ((perimetre / this.cumulatedAngle[depth]) * 360) / (2 * Math.PI)

        if(refInc < (this.nodeSize * 2)){
            refInc = this.nodeSize * 2
        }

        return refInc + previousRefInc
    }
}