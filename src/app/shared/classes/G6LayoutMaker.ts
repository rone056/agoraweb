import G6, { EdgeConfig, GraphData, NodeConfig } from "@antv/g6";
import { Domaine } from "@models/domaine";
import { registerCircleTarget } from "./NodeMaker";


export class G6LayoutMaker {
    domaine: Domaine;
    nodeSize: number = 40;
    ratioEspacement: number = 1.35;
    refIncArray: number[] = [];

    constructor(pDomaine?: Domaine) {
        if(pDomaine){
            this.domaine = pDomaine;
        } else {
            this.domaine = new Domaine()
        }
    }

    ////////////////////////////////////////////////////////////
    ////////////////// G6 Object methods ///////////////////////
    ////////////////////////////////////////////////////////////

    /**
     * Initialize a new GraphData object with empty nodes and edges arrays
     * @returns Initialized GraphData object
     */
     createEmptyGraphData(): GraphData {
        let emptyGraph: GraphData = {
			nodes: [],
			edges: []
		}
        return emptyGraph;
    }

    /**
     * Create a node
     * @param id Identifier of the node
     * @param name Label of the node
     * @param position Coordinates of the node
     * @param size Size of the node
     * @returns the NodeConfig
     */
    createNode(id: string, name: string, position: [number, number], size: number, isVisible: boolean = true, styleNode?: Object, styleLabel?: Object): NodeConfig {
        let defaultStyleNode = {
            lineWidth: 1,
            fill: isVisible? '#757de8' : '#757de800',
            stroke: isVisible? '#002984' : '#00298400',
            cursor: 'pointer'
        }
        let defaultStyleLabel = {
            fontSize: 6,
            textAlign: "center",
            fill: '#fff'
        }
        return {
			id: id,
			x: position[0],
			y: position[1],
			label: this.fittingString(name, size, 6),
            labelCfg: {
			    style: styleLabel ? styleLabel : defaultStyleLabel
            },
            size: size,
			type: "node",
            style: styleNode ? styleNode : defaultStyleNode
		};
    }

    /**
     * Create a node
     * @param id Identifier of the node
     * @param name Label of the node
     * @param size Size of the node
     * @returns the NodeConfig
     */
     updatedNode(id: string, name: string, size?: number, styleNode?: Object, styleLabel?: Object): NodeConfig {
        return {
			id: id,
			label: this.fittingString(name, size ? size : 80, 6),
            labelCfg: {
			    style: styleLabel
            },
            style: styleNode
		};
    }

    /**
     * Create a straight line EdgeConfig based on the parameter
     * @param source the source
     * @param target the target
     * @param visible the visibility of the edge
     * @returns the EdgeConfig
     */
    createLineEdge(source: string, target: string, visible: boolean): EdgeConfig {
        let color = "#757575"
        if(!visible){
            color= '#f5f5f500'
        }
        return {
            source: source,
            target: target,
            type: 'line',
            style: {
                stroke: color
            }
        };
    }

    /**
     * Draw a circle node without label to link a set of child nodes
     * @param radius the radius of the circle
     * @param id the id of the node
     * @returns the NodeConfig
     */
    createCircleTarget(radius: number, id: number) : NodeConfig {
        registerCircleTarget();
        return {
			id: "targetCircle"+id,
			x: 0,
			y: 0,
			style: {
                stroke: '#757575'
            },
			type: "circleTarget",
            refInc: radius
		};
    }

    
    /**
     * Create a curved EdgeConfig based on the parameters
     * @param source the source
     * @param target the target
     * @param depth the depth at which the curve need to be drawed
     * @returns the EdgeConfig
     */
     createCurvedEdge(source: [string, number], target: [string, number], depth: number) : EdgeConfig {
        let radianSource = source[1]
        let radianTarget = target[1]
        let radian = Math.abs(radianSource - radianTarget)
        let curve = this.calcCurveOffset(this.refIncArray[depth], -radian);
        return {
            source: source[0],
            target: target[0],
            type: 'arc',
            style: {
                stroke: "#757575"
            },
            curveOffset: curve
        };
    }

    ////////////////////////////////////////////////////////////
    ////////// Utils methods for drawing the graph /////////////
    ////////////////////////////////////////////////////////////

    /**
     * Allow to calculate the coordinates of a node
     * @param depth the depth of the node inside the radial tree
     * @param angle the precise angle at which the node is positioned in the radial tree (in radian)
     * @returns coordinates in format [x, y]
     */
     calcNodeCoordinates(depth: number, angle: number): [number, number]{
        return [this.refIncArray[depth] * Math.cos(angle), this.refIncArray[depth] * Math.sin(angle)]
    }

    /**
     * Calculate the curveOffset
     * @param radius the radius of the circle to follow
     * @param angleIncrement the angle increment between the source and target point
     * @returns the curveOffset needed to have right curve between the 2 point
     */
     calcCurveOffset(radius: number, angleIncrement: number) : number { 
        let arc = ((2 * Math.PI * radius) / 360) * (angleIncrement * (180 / Math.PI));
        let curve = radius - (radius * Math.cos(arc / (2 * radius)));

        if(Math.sign(angleIncrement) != 0) curve = curve * Math.sign(angleIncrement)
        return curve;
    }

    /**
     * Get the radian from an angle in degree
     * @param angle the angle in degree
     * @param spacer the additionnal spacer (Optionnal)
     * @returns the radian value
     */
    calcAngleIncrement(angle: number, spacer?: number){
        if(spacer){
            angle += spacer * 2
        }
        return (angle * Math.PI) / 360;
    }

    fittingString(str: string, maxWidth: number, fontSize: number): string {
        let currentWidth = 0;
        let res = str;
        str.split("").forEach((letter, i) => {
            if (currentWidth > maxWidth) currentWidth = 0;
            // get the width of single letter according to the fontSize
            currentWidth += G6.Util.getLetterWidth(letter, fontSize);
            if (currentWidth > maxWidth) {
                res = `${res.substring(0, i)}\n${str.substring(i)}`;
            }
        });
        return res;
    };

     /**
     * Return an array with the number of node at each depth
     * @param depthArray the array of nodeNumber that needs to be filled
     * @param domaine the current Domaine
     * @param depth the depth at which we are currently
     * @returns the array of nodeNumber, size equivalent to maximum depth
     */
      getNodeNumberByDepth(depthArray: number[], domaine: Domaine, depth: number): number[] {
        if(domaine.children.length > 0){  
            if(depthArray.length <= depth) depthArray.push(0);          
            let nodeNumber = 0
            domaine.children.forEach(element => {
                nodeNumber++;
                depthArray = this.getNodeNumberByDepth(depthArray, element, depth + 1)
            });
            depthArray[depth] = depthArray[depth] + nodeNumber
        }
        return depthArray;
    }
}