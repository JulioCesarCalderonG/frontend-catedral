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
      ]
    },
    {
      titulo: 'Iniciacion Cristiana',
      icono: 'fa fa-solid fa-user-injured',
      submenu: [
        { titulo: 'Mostrar Iniciacion', url: 'iniciacion-cristiana' },
      ]
    },
    {
      titulo: 'Liturgias',
      icono: 'fa fa-solid fa-signature',
      submenu: [
        { titulo: 'Mostrar Liturgias', url: 'liturgia' },
      ]
    },
    {
      titulo: 'Cancioneros',
      icono: 'fa fa-solid fa-guitar',
      submenu: [
        { titulo: 'Mostrar Cancionero', url: 'cancionero' },
      ]
    },
    {
      titulo: 'Directorios',
      icono: 'fa fa-solid fa-location-arrow',
      submenu: [
        { titulo: 'Mostrar Directorios', url: 'directorio' },
      ]
    },
    {
      titulo: 'Ministerios',
      icono: 'fa fa-solid fa-house-chimney',
      submenu: [
        { titulo: 'Mostrar Ministerios', url: 'ministerio' },
      ]
    },
    {
      titulo: 'Materiales Pastorales',
      icono: 'fa fa-solid fa-recycle',
      submenu: [
        { titulo: 'Mostrar Materiales', url: 'materiales-pastorales' },
      ]
    },
  ];
  constructor() { }
}
