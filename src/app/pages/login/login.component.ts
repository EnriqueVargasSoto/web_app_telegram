import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/utils/api/api.service';
import { environment } from 'src/environments/environment';
import { Modal } from 'flowbite';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  private localStorageKey = 'user';
  formLogin: FormGroup;
  modalWarning: any;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private service: ApiService, private router: Router){
    this.formLogin = this.fb.group({
      //nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigo: ['', [Validators.required]],
      password: ['', [Validators.required]]
      // Agrega otras propiedades del formulario aquí con sus respectivas validaciones
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const targetEl = document.getElementById('popup-modal');
    this.modalWarning = new Modal(targetEl);
  }

  // Método para obtener un control del formulario
  get f() {
    return this.formLogin.controls;
  }

  async onSubmit() {
    // Aquí puedes manejar la lógica cuando el formulario es enviado
    console.log('Formulario enviado:', this.formLogin.value);
    console.log('Formulario enviado:', this.formLogin.valid);
    if (this.formLogin.valid) {
      let body = {
        'compania' : environment.Compania,
        'sucursal' : environment.Sucursal,
        'tipologueo' : "2",
        'usuario' : this.formLogin.controls['codigo'].value,
        'password' : this.formLogin.controls['password'].value,
      };
      console.log(body);
       (await this.service.consulta('login', 'post', body)).subscribe((resp) => {
        console.log(resp);
        console.log(resp['status_code']);
        console.log(resp['status_code'] != 500);
        if (resp['status_code'] != 500) {
          console.log('entro aqui');
          localStorage.setItem(this.localStorageKey, JSON.stringify(resp));
          this.service.isAuthenticated = true;
          this.router.navigate(['/']);
          console.log('aqui termina');
        } else {
          this.mensaje = resp['status_description'];
          this.modalWarning.show();
        }
        //localStorage.setItem(this.localStorageKey, JSON.stringify(resp));
      });
      //this.service.isAuthenticated = true;
      //this.router.navigate(['/']);
    }
  }

  cerrarModal(){

    this.modalWarning.hide();
  }
}
