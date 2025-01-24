import { AfterViewInit, Component, ElementRef, HostListener, QueryList, ViewChildren, NgZone, SimpleChanges, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { G6GraphEvent, Graph } from '@antv/g6';
import { G6LayoutMaker } from '@classes/G6LayoutMaker';
import { RadialLayoutMaker } from '@classes/RadialLayoutMaker';
import { RadialTreeMaker } from '@classes/RadialTreeMaker';
import { Domaine } from '@models/domaine';
import { CartoService } from 'app/shared/services/carto/carto.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements AfterViewInit {
    @Output() displayEditorEvent = new EventEmitter<boolean>();
    rootDomaine?: Domaine;
    private graph?: Graph;
    currentDomaine?: Domaine;
    isEdition: boolean = false;
    domainePath: Domaine[] = [];
    displayEditor: boolean = false;

    @ViewChildren("drawer")
    private drawer?: QueryList<ElementRef>;
    @ViewChildren("drawerContent")
    private graphHtmlElement?: QueryList<ElementRef>;

    constructor(private cartoService: CartoService) {
        this.nodeClickListener = this.nodeClickListener.bind(this)
    }

    ngAfterViewInit(): void {
        this.cartoService.getRoot().subscribe(value => {
            if(value.id){
                this.rootDomaine = value
            }
        });

        this.cartoService.getCurrentDomaine().subscribe(value => {
            if(value.id){
                this.currentDomaine = value
                this.drawGraphByMode();
            }
        });

        this.cartoService.getEditedDomaine().subscribe(value => {
            if(value.id){
                this.updateNodeInGraph(value)
            }
        });
    }
    ngOnDestroy(): void {
        this.graph?.destroy()
    }
    ngOnChanges(_changes: SimpleChanges):void {
        this.fitView()
    }

    get graphElement(): HTMLElement {
        return this.graphHtmlElement?.first.nativeElement;
    }

    get drawerElement(): HTMLElement {
        return this.drawer?.first.nativeElement;
    }

    @HostListener('window:resize', ['$event'])
    onResize(_event: Event) {
        this.updateGraphSize(this.graphElement)
        this.graph?.fitView()
    }

    editClick(display?: boolean){
        this.displayEditor = display ? display : !this.displayEditor;
        this.displayEditorEvent.emit(this.displayEditor);
    }

    reset() {
        this.domainePath = []
        this.currentDomaine = undefined
        this.createRadialTree()
    }

    drawGraphByMode() {
        if (this.isEdition) {
            this.createEditionGraph();
        } else {
            this.createRadialTree();
        }
    }

    fitView() {
        let widthToApply = this.drawerElement?.getBoundingClientRect().width
        this.updateGraphSize(this.graphElement, widthToApply)
        this.graph?.fitView()
    }

    focusOnNode(domaineId: string) {
        if (domaineId != this.currentDomaine?.id) {
            this.domainePath = []
            let domaine = this.getDomaineById(domaineId, this.rootDomaine)
            this.domainePath.reverse()
            this.setDomaineByMode(domaine)
        } else if (domaineId == this.rootDomaine?.id) {
            this.domainePath = []
            this.setDomaineByMode()
            this.graph?.fitView()
        } else {
            this.domainePath.pop()
            let domaine = this.domainePath[this.domainePath.length - 1]            
            this.setDomaineByMode(domaine)
        }
    }

    private setDomaineByMode(domaine?: Domaine){
        if(domaine){
            this.cartoService.setCurrentDomaine(domaine)
            this.cartoService.setEditedDomaine(domaine)
        } else {
            this.cartoService.resetCurrentDomaine()
            if(this.rootDomaine){
                this.cartoService.setEditedDomaine(this.rootDomaine)
            }
        }
    }

    private createRadialTree(): void {
        if (this.graph) {
            this.graph?.destroy()
        }
        let domaine = this.currentDomaine ? this.currentDomaine : this.rootDomaine;
        if(domaine){
            let graphMaker = new RadialTreeMaker(domaine);
            this.graph = graphMaker.make("chart");
            this.graph.render();
            this.graph.on("node:click", this.nodeClickListener);
            this.graph.on("node:touchstart", this.nodeClickListener);
            this.updateGraphSize(this.graphElement)
        }
    }

    private createEditionGraph(): void {
        if (this.graph) {
            this.graph?.destroy()
        }
        let domaine = this.currentDomaine ? this.currentDomaine : this.rootDomaine;
        if(domaine){
            let graphMaker = new RadialLayoutMaker(domaine);
            this.graph = graphMaker.make("chart");
            this.graph.render();
            this.graph.on("node:click", this.nodeClickListener);
            this.graph.on("node:touchstart", this.nodeClickListener);
            this.updateGraphSize(this.graphElement)
            this.graph?.fitView()
        }
    }

    private nodeClickListener(this: GraphComponent, event: G6GraphEvent) {
        let currentNodeId = event.item._cfg?.id
        if (currentNodeId) {
            if (currentNodeId.startsWith("addNodePoint")) {
                let newDomaine = this.addDomaine(currentNodeId, this.currentDomaine)
                this.createEditionGraph()
                this.cartoService.setEditedDomaine(newDomaine)
                this.editClick(true);
            } else {
                this.focusOnNode(currentNodeId)
            }
        }
    }

    private getDomaineById(id: string, domaine?: Domaine, depth: number = 0): Domaine | undefined {
        let domaineFound = undefined
        if (id === domaine?.id) {
            domaineFound = domaine
        } else if (domaine && domaine.children.length > 0) {
            for (let i = 0; i < domaine.children.length && domaineFound == undefined; i++) {
                domaineFound = this.getDomaineById(id, domaine.children[i], depth + 1)
            }
        }
        if (domaineFound && domaine) {
            if (depth > 0) this.domainePath.push(domaine)
        }
        return domaineFound
    }

    private addDomaine(id: string, parentDomaine?: Domaine): Domaine {
        let parent = parentDomaine ? parentDomaine : this.rootDomaine
        let idPreviousDomaine = id.replace("addNodePoint", "")
        let indexDomaine = parent ? parent.children?.findIndex(domaine => domaine.id == idPreviousDomaine) : 0
        let domaineAdded: Domaine = { id: uuidv4(), name: "Test", angle: 0, weight: 0, children: [] }
        parent?.children.splice(indexDomaine + 1, 0, domaineAdded)
        return domaineAdded
    }

    private updateGraphSize(element: HTMLElement, width?: number, height?: number) {
        let box = element?.getBoundingClientRect()
        this.graph?.changeSize(width ? width : box.width, height ? height : box.height)
    }

    private updateNodeInGraph(domaine: Domaine){
        if(this.graph && domaine){
            let node = this.graph.find("node", (node) => {
                return node.getID() == domaine.id
            })
            if(node){
                let model = new G6LayoutMaker().updatedNode(domaine.id, domaine.name, node.getModel().size as number, domaine.style)
                this.graph.updateItem(node, model)
            }
        }
    }
}
