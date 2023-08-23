// Generated by https://quicktype.io

export interface ResultMinisterios {
  ok:         boolean;
  msg:        string;
  ministerio: Ministerio[];
}

export interface ResultMinisterio{
  ok:         boolean;
  msg:        string;
  ministerio: Ministerio;
}

export interface Ministerio {
  id:     number;
  nombre: string;
  titulo: string;
  logo:   string;
  pdf:    string;
}

export interface MinisterioForm{
  nombre:string,
  titulo:string,
  logo?:string,
  pdf?:string
}

export interface LogoMinisterioForm{
  logo?:string,
  pdf?:string
}