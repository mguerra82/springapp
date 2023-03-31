import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClientesService } from './clientes.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {

  clientes: Cliente[] = [];

  constructor(private clienteService: ClientesService,
              private activarRoute: ActivatedRoute) {
    
  }
  ngOnInit(): void {
    
    this.activarRoute.paramMap.subscribe( params => {  
    let page: number|any = params.get('page');
  
    if(!page){
      page = 0;
    }

    this.clienteService.getClientes(page)
    .pipe(
      tap((response:any) =>{
        console.log('Cliente component: tap 3', response.content);
       /* (response.response as Cliente[]).forEach((cliente:any) =>{
         // console.log('RESPONCE CONTENIDO::......',response);
        })*/
      })
    )
    .subscribe(response => this.clientes = response.content as Cliente[]);
  
    console.log("Servicio desde el get");
  });
  }

  delete(cliente: Cliente):void{
    Swal.fire({
      title: '¿Estas seguro?',
      text: `¿Seguro que desea eliminar el cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si Eliminar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            Swal.fire(
              'Cliente eliminado!',
             ` cliente ${cliente.nombre} ${cliente.apellido} eliminado con exito`,
              'success'
            )

          }
        )
        
      }
    })

  }

}
