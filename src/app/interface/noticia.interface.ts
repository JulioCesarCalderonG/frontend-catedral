// Generated by https://quicktype.io

export interface ResultNoticias {
  ok:      boolean;
  msg:     string;
  noticia: Noticia[];
}
export interface ResultNoticia {
  ok:      boolean;
  msg:     string;
  noticia: Noticia;
}
export interface Noticia {
  ids:         number;
  id:          number;
  titulo:      string;
  subtitulo:   string;
  fecha:       string;
  ano:         string;
  descripcion: string;
  estado:      number;
}
