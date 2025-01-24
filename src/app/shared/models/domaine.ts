export interface DomaineInterface {
    id: string,
    name: string,
    description?: string,
    style?: Object,
    tags?: string[],
    notes?: string,
    weight: number,
    angle: number,
    children: Domaine[]
}

export class Domaine implements DomaineInterface{
    id: string = "id";
    name: string = "name";
    description?: string;
    style?: Object;
    tags?: string[] = [];
    notes?: string;
    weight: number = 0;
    angle: number = 0;
    children: Domaine[] = [];
}