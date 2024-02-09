import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import { SidebarService } from 'src/app/servicios/sidebar.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems?: any[];
  resetForm:FormGroup;
  constructor(private sidebarService: SidebarService, private authService:AuthService, private fb:FormBuilder, private usuarioService:UsuarioService) {
    this.menuItems = this.sidebarService.menu;
    this.resetForm = this.fb.group({
      password:['',Validators.required],
      newpassword:['',Validators.required]
    })
  }

  ngOnInit(): void {
  }
  logout(){
    this.authService.loggoud();
  }
  resetearPassword(){
    const id = sessionStorage.getItem('id_usuario');
    if (!id) {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "El id no esta disponible",
        showConfirmButton: false,
        timer: 1500
      });
    }else{
      console.log(id);
      const body = new FormData();
      body.append('password', this.resetForm.get('password')?.value);
      body.append('newpassword', this.resetForm.get('newpassword')?.value);
      this.usuarioService.putResetear(body,id).subscribe({
        next:(data)=>{
          console.log(data);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: data.msg,
            showConfirmButton: false,
            timer: 1500
          });
          this.cancelar();
        },
        error:(error)=>{
          console.log(error);
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title: error.error.msg,
            showConfirmButton: false,
            timer: 1500
          });
        }
      })
    }
  }
  cancelar(){
    this.resetForm.setValue({
      password:'',
      newpassword:''
    })
  }
}
