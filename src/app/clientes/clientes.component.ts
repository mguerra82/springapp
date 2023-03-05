import { Component } from '@angular/core';
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

  constructor(private clienteService: ClientesService) {
    
  }
  ngOnInit(): void {
    this.clienteService.getClientes().subscribe(
      
      clientes => this.clientes = clientes
    );
    console.log("Servicio desde el get");
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
