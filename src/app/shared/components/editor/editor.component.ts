import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTabGroup } from '@angular/material/tabs';
import { Domaine } from '@models/domaine';
import { CartoService } from 'app/shared/services/carto/carto.service';
import { QuillEditorComponent } from 'ngx-quill';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @Input() isDisplayed: boolean = false
  domaine?: Domaine

  // General tabs
  editorForm: FormGroup
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags?: string[];
  tags: string[] = [];
  allTags: string[] = ['Immobilier', '42', 'Big Data', 'Math', 'Agora', 'Test', 'Chimie', 'Hashtag', 'G6', 'Carto', 'Fac'];

  // Personnalisation tabs
  colorList: string[] = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688",
    "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722"]

  @ViewChildren('tagInput')
  tagInput?: QueryList<ElementRef>;
  @ViewChild(MatTabGroup, { static: false })
  public tabGroup?: MatTabGroup;
  @ViewChild("notes", { static: true })
  public notes?: QuillEditorComponent;

  constructor(private cartoService: CartoService, public fb: FormBuilder) {
    this.editorForm = fb.group({
      titre: new FormControl(this.domaine?.name, []),
      tags: new FormControl(),
      notes: new FormControl()
    })
  }

  ngOnInit(): void {
    this.setObservers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('isDisplayed' in changes) {
      this.setTabFocus()
    }
  }

  get tagInputElement(): HTMLInputElement {
    return this.tagInput?.first.nativeElement;
  }

  updateNodeColor(color: string): void {
    if (this.domaine) {
      this.domaine.style = {
        fill: color
      }
      this.saveDomaine();
    }
  }

  private setObservers(): void {
    this.cartoService.getEditedDomaine().pipe(
      distinctUntilChanged()
    ).subscribe(value => {
      if (value.id) {
        this.domaine = value
        this.editorForm.patchValue({
          titre: this.domaine?.name,
          notes: this.domaine?.notes,
          tags: ""
        })
        this.tags = this.domaine?.tags ? this.domaine?.tags : []
      }
      this.setTabFocus()
    });

    this.editorForm.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe((fieldsValue) => {
      if(this.domaine && fieldsValue){
        this.domaine.name = fieldsValue["titre"]
        this.domaine.notes = fieldsValue["notes"]
        this.saveDomaine()
      }
    })

    this.editorForm.get("tags")?.valueChanges.subscribe((tag) => {
      this.filteredTags = this.filterTagList(tag)
    })
  }

  private filterTagList(currentTag: string): string[] {
    let filteredList: string[] = this.allTags

    if(this.tags && this.tags.length > 0){
      filteredList = this.allTags.filter(tagGlobal => !this.tags.map(tag => tag.toLowerCase()).includes(tagGlobal.toLowerCase()));
    }
    if(currentTag){
      filteredList = filteredList.filter(tag => tag.toLowerCase().includes(currentTag.toLowerCase()))
    }

    return filteredList
  }

  private saveDomaine() {
    if (this.domaine) {
      this.cartoService.setEditedDomaine(this.domaine)
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our tag
    if (value) {
      this.addToTagList(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.editorForm?.get("tags")?.setValue(null);
  }

  removeTag(fruit: string): void {
    const index = this.tags.indexOf(fruit);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    this.addToTagList(event.option.viewValue);
    this.tagInputElement.value = '';
    this.editorForm?.get("tags")?.setValue(null);
  }

  addToTagList(value: string){
    this.tags.push(value);
    if(this.domaine){
      this.domaine.tags = this.tags
    }
    this.saveDomaine();
  }


  private setTabFocus(index: number = 0) {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = index
      this.tabGroup.realignInkBar()
    }
  }
}