import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { InicioComponent } from './inicio/inicio.component';

const routes: Routes = [
  {
    path:'',
    component:HomeComponent,
    children:[
      {path:'',component:InicioComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
