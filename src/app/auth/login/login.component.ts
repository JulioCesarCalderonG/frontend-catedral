import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { closeAlert, loadData } from 'src/app/alerts/load';
import { ResultAuth } from 'src/app/interface/usuario.interface';
import { AuthService } from 'src/app/servicios/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  carga: boolean = false;
  constructor(private authService: AuthService, private fb: FormBuilder, private router:Router) {
    this.formLogin = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}
  login() {
    this.carga = true;
    if (this.carga) {
      loadData('Cargando....', 'Se esta validando sus datos, espere');
    }
    const body = new FormData();
    body.append('usuario', this.formLogin.get('usuario')?.value);
    body.append('password', this.formLogin.get('password')?.value);
    this.authService.postLogin(body).subscribe({
      next: (data:ResultAuth) => {
        console.log(data);
        sessionStorage.setItem('carga', '0');
        sessionStorage.setItem('x-token', data.token);
        sessionStorage.setItem('usuario', data.user.usuario);
        sessionStorage.setItem('id_usuario', String(data.user.id));
        this.carga = false;
        if (!this.carga) {
          closeAlert();
        }
        this.router.navigateByUrl('/admin');
      },
      error: (error) => {
        console.log(error.error.msg);
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: error.error.msg,
          showConfirmButton: false,
          timer: 1500,
        });
      },
    });
  }
}
