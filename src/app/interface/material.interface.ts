// Generated by https://quicktype.io

export interface ResultMaterialPastorales {
  ok:       boolean;
  msg:      string;
  material: Material[];
}
export interface ResultMaterialPastoral {
  ok:       boolean;
  msg:      string;
  material: Material;
}
export interface Material {
  id:     number;
  nombre: string;
  titulo: string;
  logo:   string;
  pdf:    string;
}

export interface MaterialForm{
  nombre:string,
  titulo:string,
  logo?:string,
  pdf?:string
}

export interface LogoMaterialForm{
  logo?:string,
  pdf?:string
}
