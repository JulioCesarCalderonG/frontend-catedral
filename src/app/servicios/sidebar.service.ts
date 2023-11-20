import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  menu: any[] = [
    {
      titulo: 'Noticias',
      icono: 'fa fa-regular fa-newspaper',
      submenu: [
        { titulo: 'Mostrar Noticias', url: 'noticias' },
      ]
    },
    {
      titulo: 'Oraciones',
      icono: 'fa fa-solid fa-book-bible',
      submenu: [
        { titulo: 'Mostrar Oraciones', url: 'oraciones' },
        { titulo: 'Tipo Oraciones', url: 'tipo-oracion' },
      ]
    },
    {
      titulo: 'Iniciacion Cristiana',
      icono: 'fa fa-solid fa-user-injured',
      submenu: [
        { titulo: 'Mostrar Iniciacion', url: 'iniciacion-cristiana' },
        { titulo: 'Tipo Iniciacion', url: 'tipo-iniciacion' },
      ]
    },
    {
      titulo: 'Celebraciones',
      icono: 'fa fa-solid fa-signature',
      submenu: [
        { titulo: 'Celebraciones', url: 'liturgia' },/*
        { titulo: 'Tiempo Liturgias', url: 'tiempo-liturgia' },
        { titulo: 'Tipo Liturgias', url: 'tipo-liturgia' }, */
      ]
    },
    {
      titulo: 'Cancioneros',
      icono: 'fa fa-solid fa-guitar',
      submenu: [
        { titulo: 'Cancionero', url: 'cancionero' },
        { titulo: 'Tipo Cancionero', url: 'tipo-cancionero' },
      ]
    },
    {
      titulo: 'Directorios',
      icono: 'fa fa-solid fa-location-arrow',
      submenu: [
        { titulo: 'Mostrar Directorios', url: 'directorio' },
        { titulo: 'Horarios', url: 'atencion' },
      ]
    },
    {
      titulo: 'Ministerios',
      icono: 'fa fa-solid fa-house-chimney',
      submenu: [
        { titulo: 'Mostrar Ministerios', url: 'ministerio' },
        { titulo: 'Mostrar Tipos Ministerios', url: 'tipo-ministerio' },
      ]
    },
    {
      titulo: 'Materiales Pastorales',
      icono: 'fa fa-solid fa-recycle',
      submenu: [
        { titulo: 'Mostrar Materiales', url: 'materiales-pastorales' },
        { titulo: 'Mostrar Tipo Materiales', url: 'tipo-materiales-pastorales' },
      ]
    },
  ];
  constructor() { }
}
