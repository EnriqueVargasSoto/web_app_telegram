import { Component } from '@angular/core';
import { ApiService } from 'src/app/utils/api/api.service';
import { CartService } from 'src/app/utils/cart/cart.service';
import { environment } from 'src/environments/environment';
import { Modal } from 'flowbite';
import { Router } from '@angular/router'
import * as moment from 'moment';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  carrito: any[] = [];
  total: number = 0.00;

  private localStorageKey = 'user';
  usuario: any;

  modal: any;

  constructor(private apiService: ApiService, private cart: CartService, private router: Router){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    const targetEl = document.getElementById('popup-modal');
    this.modal = new Modal(targetEl);
    const userJson = localStorage.getItem(this.localStorageKey);
    this.usuario = JSON.parse(userJson!);
    this.setCart();

  }

  setCart(){
    this.carrito = this.cart.cart;
    this.total = 0.00;
    for (let i = 0; i < this.carrito.length; i++) {
      this.total += this.carrito[i]['monto'];

    }
  }

  removeCart(indice: any){
    if (indice >= 0 && indice < this.carrito.length) {
      this.total -= this.carrito[indice]['monto'];
      this.cart.deleteCart(indice);
      //this.carrito.splice(indice, 1); // Elimina el producto en el índice especificado
      this.setCart();
    }
  }

  async guardarPedido(){

    const fechaActual = moment();

    let items: any[] = [];

    for (let i = 0; i < this.carrito.length; i++) {
      const element = {
        "sku" : this.carrito[i]['item_cod'],
        "procedimiento" : "003",
        "unidad_medida" : this.carrito[i]['unidad_man'],
        "cantidad_pedida" : this.carrito[i]['cantidad'],
        "lista_precio" : this.usuario['listprecio'],
      }

      items.push(element);

    }

    let data: any = {
      "pedido_origen" : "012",
      "nro_pedido_origen" : 1234567890,
      "fecha_pedido" : fechaActual.format('YYYY-MM-DD'),//"2023-12-12",
      "vendedor" : "4643",
      "centro_distribucion" : "1",
      "zona" : "2000",
      "ruta" : "10002",
      "forma_pago" : "001",
      "moneda" : "PEN",
      "fecha_entrega" : null,
      "hora_entrega" : null,
      "detalle_pedido" : [
        {
          "cliente" : [
            {
              "nro_documento_ide" : this.usuario['user_ndocid'],
              "tipo_documento_ide" : this.usuario['user_tdocid'],
              "nombre_completo" : this.usuario['user_name'],
              "direccion_fiscal" : "",
              "ubigeo_dirfiscal" : this.usuario['user_ubigeo'],
              "direccion_despacho" : "",
              "ubigeo_dirdespacho" : this.usuario['user_ubigeo'],
              "telefono" : this.usuario['user_phone'],
              "modulo" : "10002",
              "latitud" : "-16.47293217480",
              "longitud" : "-71.52866047464",
              "items" : items
            }
          ]
        }
      ]
    }
    if (this.carrito.length > 0) {
      let body = {
        'compania' : environment.Compania,
        'sucursal' : environment.Sucursal,
        'order' : data
      };
      (await this.apiService.consulta('save-order', 'post', body)).subscribe((resp) => {
        console.log(resp);
        if (resp['status_code'] == 200) {
          this.modal.show();
        }
      });
    }else{

    }
  }

  cerrarModal(){
    this.cart.cart = [];
    this.modal.hide();
    this.router.navigate(['/']);
  }
}
