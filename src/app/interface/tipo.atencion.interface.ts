// Generated by https://quicktype.io

export interface ResultTipoAtenciones {
  ok:           boolean;
  msg:          string;
  tipoatencion: Tipoatencion[];
}

export interface Tipoatencion {
  id:          number;
  descripcion: string;
  estado:      number;
}
