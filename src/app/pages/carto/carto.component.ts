import { CdkDragMove, DragRef } from '@angular/cdk/drag-drop';
import { Component, ElementRef, NgZone, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Domaine } from '@models/domaine';
import { CartoService } from 'app/shared/services/carto/carto.service';

@Component({
  selector: 'app-carto',
  templateUrl: './carto.component.html',
  styleUrls: ['./carto.component.scss']
})
export class CartoComponent implements OnInit {
  displayEditor: boolean = false;
  widthGraph: number = 100;
  widthEditor: number = 0;
  dragObject?: DragRef;

  @ViewChildren('dragHandle')
  dragHandle?: QueryList<ElementRef>;
  @ViewChildren('cartoMap')
  cartoMap?: QueryList<ElementRef>;
  @ViewChildren('cartoBox')
  cartoBox?: QueryList<ElementRef>;

  constructor(private ngZone: NgZone, private cartoService: CartoService) { }

  ngOnInit(): void {
    this.getDomaines();
  }

  getDomaines(): void {
    setTimeout(() => {
      this.cartoService.getDomainesFromServer().subscribe(
        domaine => {
          this.cartoService.setRoot(domaine)
          this.cartoService.setCurrentDomaine(domaine)
          this.cartoService.setEditedDomaine(domaine)
        }
      );
    }, 500)
  }

  get dragHandleElement(): HTMLElement {
    return this.dragHandle?.first.nativeElement;
  }

  get cartoMapElement(): HTMLElement {
    return this.cartoMap?.first.nativeElement;
  }

  get cartoBoxElement(): HTMLElement {
    return this.cartoBox?.first.nativeElement;
  }

  setDisplayEditor(isDisplayed: boolean) {
    this.displayEditor = isDisplayed;
    this.widthGraph = this.displayEditor ? 80 : 100;
    this.widthEditor = 100 - this.widthGraph;
    if (this.displayEditor) {
      this.dragObject?.reset()
    }
  }

  dragMove(dragHandle: HTMLElement, $event: CdkDragMove<any>) {
    this.dragObject = $event.source._dragRef
    this.ngZone.runOutsideAngular(() => {
      this.resize(dragHandle, this.cartoMapElement);
    });
  }

  resize(dragHandle: HTMLElement, _target: HTMLElement) {
    const container = this.cartoBoxElement.getBoundingClientRect();
    const graph = this.cartoMapElement.getBoundingClientRect();
    const dragRect = dragHandle.getBoundingClientRect();
    let widthInPx = dragRect.left - graph.left + dragRect.width;

    this.widthGraph = widthInPx * 100 / container.right;
    this.widthEditor = 100 - this.widthGraph;
  }

  private init(){

  }
}
