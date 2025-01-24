import { Injectable } from '@angular/core';
import { Domaine } from '@models/domaine';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartoService {
  root: BehaviorSubject<any>
  currentDomaine: BehaviorSubject<any>
  editedDomaine: BehaviorSubject<any>

  constructor() { 
    this.root = new BehaviorSubject<any>({})
    this.currentDomaine = new BehaviorSubject<any>({})
    this.editedDomaine = new BehaviorSubject<any>({})
  }

  getDomainesFromServer(): Observable<Domaine> {
    const domaine = {
      id: "root",
      name: "Immobilier",
      angle: 0,
      weight: 0,
      description: "Test de description",
      children: [
        {
          id: "10", name: "Analyse de marché", description: "", angle: 0, weight: 0, children: [
            { id: "101", name: "1", description: "", angle: 0, weight: 0, children: [] },
            { id: "102", name: "2", description: "", angle: 0, weight: 0, children: [] },
            { id: "103", name: "3", description: "", angle: 0, weight: 0, children: [] },
            { id: "104", name: "4", description: "", angle: 0, weight: 0, children: [] },
            { id: "105", name: "5", description: "", angle: 0, weight: 0, children: [] },
            { id: "106", name: "6", description: "", angle: 0, weight: 0, children: [] },
            {
              id: "107", name: "7", description: "", angle: 0, weight: 0, children: [
                { id: "004", name: "4", description: "", angle: 0, weight: 0, children: [] },
                { id: "005", name: "5", description: "", angle: 0, weight: 0, children: [] },
                {
                  id: "006", name: "6", description: "", angle: 0, weight: 0, children: [
                    { id: "0005", name: "5 - 4", description: "", angle: 0, weight: 0, children: [] },
                    { id: "0006", name: "6 - 4", description: "", angle: 0, weight: 0, children: [] },
                    { id: "a07", name: "6 fgg", description: "", angle: 0, weight: 0, children: [] },
                  ]
                },
                { id: "007", name: "7", description: "", angle: 0, weight: 0, children: [] },
                { id: "0026", name: "3", description: "", angle: 0, weight: 0, children: [] },
                { id: "0027", name: "4", description: "", angle: 0, weight: 0, children: [] },
                { id: "0028", name: "5", description: "", angle: 0, weight: 0, children: [] },
                { id: "0029", name: "6", description: "", angle: 0, weight: 0, children: [] },
                { id: "0030", name: "7", description: "", angle: 0, weight: 0, children: [] },
                { id: "0031", name: "8", description: "", angle: 0, weight: 0, children: [] },
                { id: "0032", name: "9", description: "", angle: 0, weight: 0, children: [] },
                { id: "0033", name: "10", description: "", angle: 0, weight: 0, children: [] },
              ]
            }
          ]
        },
        { id: "11", name: "Transaction", description: "", angle: 0, weight: 0, children: [] },
        {
          id: "15", name: "Règlementation", description: "", angle: 0, weight: 0, children: [
            { id: "152", name: "Construction", description: "", angle: 0, weight: 0, children: [] },
            { id: "153", name: "Construction", description: "", angle: 0, weight: 0, children: [] },
            { id: "154", name: "Construction", description: "", angle: 0, weight: 0, children: [] }
          ]
        },
        { id: "16", name: "Analyse de marché", description: "", angle: 0, weight: 0, children: [] },
        {
          id: "20", name: "Construction", description: "", angle: 0, weight: 0, children: [
            { id: "01", name: "1", description: "", angle: 0, weight: 0, children: [] },
            { id: "02", name: "2", description: "", angle: 0, weight: 0, children: [] },
            { id: "03", name: "3", description: "", angle: 0, weight: 0, children: [] },
            { id: "04", name: "4", description: "", angle: 0, weight: 0, children: [] },
            { id: "05", name: "5", description: "", angle: 0, weight: 0, children: [] },
            { id: "06", name: "6", description: "", angle: 0, weight: 0, children: [] },
            { id: "07", name: "7", description: "", angle: 0, weight: 0, children: [] },
            { id: "08", name: "8", description: "", angle: 0, weight: 0, children: [] }
          ]
        },
        // { id: "21", name: "Financement", description: "", angle: 0, weight: 0, children: [] },
        // { id: "36", name: "Construction", description: "", angle: 0, weight: 0, children: [] },
        // {
        //     id: "37", name: "Construction", description: "", angle: 0, weight: 0, children: [
        //         { id: "024", name: "1", description: "", angle: 0, weight: 0, children: [] },
        //         { id: "025", name: "2", description: "", angle: 0, weight: 0, children: [] },
        //         { id: "026", name: "3", description: "", angle: 0, weight: 0, children: [] },
        //         { id: "027", name: "4", description: "", angle: 0, weight: 0, children: [] },
        //         { id: "028", name: "5", description: "", angle: 0, weight: 0, children: [] },
        //         { id: "029", name: "6", description: "", angle: 0, weight: 0, children: [] },
        //         { id: "030", name: "7", description: "", angle: 0, weight: 0, children: [] },
        //         { id: "031", name: "8", description: "", angle: 0, weight: 0, children: [] },
        //         {
        //             id: "032", name: "9", description: "", angle: 0, weight: 0, children: [
        //                 { id: "00026", name: "3", description: "", angle: 0, weight: 0, children: [] },
        //                 { id: "00027", name: "4", description: "", angle: 0, weight: 0, children: [] },
        //                 { id: "00028", name: "5", description: "", angle: 0, weight: 0, children: [] },
        //                 {
        //                     id: "00029", name: "6", description: "", angle: 0, weight: 0, children: [
        //                         { "id": "	141	", name: "14", description: "", angle: 0, weight: 0, children: [] },
        //                         { "id": "	142	", name: "14", description: "", angle: 0, weight: 0, children: [] },
        //                         { "id": "	143	", name: "14", description: "", angle: 0, weight: 0, children: [] },
        //                         { "id": "	144	", name: "14", description: "", angle: 0, weight: 0, children: [] },
        //                         { "id": "	145	", name: "14", description: "", angle: 0, weight: 0, children: [] },
        //                         { "id": "	146	", name: "14", description: "", angle: 0, weight: 0, children: [] },
        //                         { "id": "	147	", name: "14", description: "", angle: 0, weight: 0, children: [] },
        //                         { "id": "	148	", name: "14", description: "", angle: 0, weight: 0, children: [] },
        //                         { "id": "	149	", name: "14", description: "", angle: 0, weight: 0, children: [] },
        //                         { "id": "	150	", name: "14", description: "", angle: 0, weight: 0, children: [] },
        //                         { "id": "	151	", name: "14", description: "", angle: 0, weight: 0, children: [] },
        //                         { "id": "	152	", name: "14", description: "", angle: 0, weight: 0, children: [] },
        //                         { "id": "	153	", name: "14", description: "", angle: 0, weight: 0, children: [] },
        //                         {"id":"	154	", name: "14", description: "", angle:0, weight: 0,children: []},
        //                         {"id":"	155	", name: "14", description: "", angle:0, weight: 0,children: []},
        //                         {"id":"	156	", name: "14", description: "", angle:0, weight: 0,children: []},
        //                         {"id":"	157	", name: "14", description: "", angle:0, weight: 0,children: []},
        //                         {"id":"	158	", name: "14", description: "", angle:0, weight: 0,children: []},
        //                         {"id":"	159	", name: "14", description: "", angle:0, weight: 0,children: []},
        //                         {"id":"	160	", name: "14", description: "", angle:0, weight: 0,children: []},
        //                         {"id":"	161	", name: "14", description: "", angle:0, weight: 0,children: []},
        //                         {"id":"	162	", name: "14", description: "", angle:0, weight: 0,children: []},
        //                         {"id":"	163	", name: "14", description: "", angle:0, weight: 0,children: []},
        //                         {"id":"	164	", name: "14", description: "", angle:0, weight: 0,children: []},
        //                         {"id":"	165	", name: "14", description: "", angle:0, weight: 0,children: []},
        //                         {"id":"	166	", name: "14", description: "", angle:0, weight: 0,children: []},
        //                         {"id":"	167	", name: "14", description: "", angle:0, weight: 0,children: []},
        //                     ]
        //                 },
        //                 { id: "00030", name: "7", description: "", angle: 0, weight: 0, children: [] },
        //                 { id: "00031", name: "8", description: "", angle: 0, weight: 0, children: [] },
        //                 { id: "00032", name: "9", description: "", angle: 0, weight: 0, children: [] },
        //             ]
        //         },
        //         { id: "033", name: "10", description: "", angle: 0, weight: 0, children: [] },
        //         { id: "034", name: "11", description: "", angle: 0, weight: 0, children: [] },
        //         { id: "035", name: "12", description: "", angle: 0, weight: 0, children: [] },
        //         { id: "036", name: "13", description: "", angle: 0, weight: 0, children: [] },
        //         { id: "037", name: "14", description: "", angle: 0, weight: 0, children: [] },
        //     ]
        // },
        // { id: "38", name: "Construction", description: "", angle: 0, weight: 0, children: [] },
        // { id: "39", name: "Construction", description: "", angle: 0, weight: 0, children: [] },
        // { id: "40", name: "Construction", description: "", angle: 0, weight: 0, children: [] },
        {
          id: "41", name: "Construction", description: "", angle: 0, weight: 0, children: [
            // { "id": "	147	", name: "14", description: "", angle: 0, weight: 0, children: [] },
            // { "id": "	148	", name: "14", description: "", angle: 0, weight: 0, children: [] },
            // { "id": "	149	", name: "14", description: "", angle: 0, weight: 0, children: [] },
            // { "id": "	150	", name: "14", description: "", angle: 0, weight: 0, children: [] },
            // { "id": "	151	", name: "14", description: "", angle: 0, weight: 0, children: [] },
            // { "id": "	152	", name: "14", description: "", angle: 0, weight: 0, children: [] },
            // { "id": "	153	", name: "14", description: "", angle: 0, weight: 0, children: [] },
            // { "id": "	154	", name: "14", description: "", angle: 0, weight: 0, children: [] },
            // {
            //     "id": "	155	", name: "14", description: "", angle: 0, weight: 0, children: [
            //         { "id": "	158	", name: "14", description: "", angle: 0, weight: 0, children: [] },
            //         { "id": "	159	", name: "14", description: "", angle: 0, weight: 0, children: [] },
            //         { "id": "	160	", name: "14", description: "", angle: 0, weight: 0, children: [] },
            //         { "id": "	161	", name: "14", description: "", angle: 0, weight: 0, children: [] },
            //         { "id": "	162	", name: "14", description: "", angle: 0, weight: 0, children: [
            //             {"id":"	164	", name: "14", description: "", angle:0, weight: 0,children: []},
            //             {"id":"	165	", name: "14", description: "", angle:0, weight: 0,children: []},
            //             {"id":"	166	", name: "14", description: "", angle:0, weight: 0,children: []},
            //             {"id":"	167	", name: "14", description: "", angle:0, weight: 0,children: []},
            //         ] },
            //         { "id": "	163	", name: "14", description: "", angle: 0, weight: 0, children: [] },
            //     ]
            // },
            // { "id": "	156	", name: "14", description: "", angle: 0, weight: 0, children: [] },
            // { "id": "	157	", name: "14", description: "", angle: 0, weight: 0, children: [] },
          ]
        },
        { id: "42", name: "Construction", description: "", angle: 0, weight: 0, children: [] },
      ]
    };
    return of(domaine);
  }

  getRoot(): Observable<Domaine> {
    return this.root.asObservable();
  }

  setRoot(domaine: Domaine): void {
    this.root.next(domaine)
  }

  getCurrentDomaine(): Observable<Domaine> {
    return this.currentDomaine.asObservable();
  }

  setCurrentDomaine(domaine: Domaine): void{
    this.currentDomaine.next(domaine)
  }

  getEditedDomaine(): Observable<Domaine> {
    return this.editedDomaine.asObservable();
  }

  setEditedDomaine(domaine: Domaine): void{
    this.editedDomaine.next(domaine)
  }

  resetCurrentDomaine(): void {
    this.currentDomaine.next(this.root.getValue())
  }
}
