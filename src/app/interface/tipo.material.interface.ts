// Generated by https://quicktype.io

export interface ResultTipoMaterialPastorales {
  ok:           boolean;
  msg:          string;
  tipoMaterial: TipoMaterial[];
}

export interface ResultTipoMaterialPastoral {
  ok:           boolean;
  msg:          string;
  tipoMaterial: TipoMaterial;
}

export interface TipoMaterial {
  id:               number;
  titulo:           string;
  pdf:              string;
  id_material:      number;
  MaterialPastoral: MaterialPastoral;
}

export interface MaterialPastoral {
  id:     number;
  nombre: string;
  logo:   string;
}

export interface TipoMaterialForm{
  titulo:string,
  pdf?:string,
  id_material:string
}
export interface LogoTipoMaterialForm{
  pdf?:string
}

