import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClientesService } from './clientes.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: []
})
export class FormComponent {

  public cliente: Cliente = new Cliente();
  public titulo:string    = 'CrearFormulario';
  
  
  public errores: string[] | undefined
  

  constructor(private clienteService: ClientesService,
              private router: Router,
              private activarRoute: ActivatedRoute){}

ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  this.cargarCliente();  
}

  cargarCliente(): void{
    
    this.activarRoute.params.subscribe(params =>{
      let id = params['id']
      if(id){
        console.log('IDEXISTE:..',id)
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
       
      }
    })
  }  

  create(): void{
    this.clienteService.create(this.cliente)
    .subscribe( json => {
      
      this.router.navigate(['/clientes']) 
      console.log('Cliente:.......', json);
        Swal.fire('Nuevo cliente', 
          `El cliente ${json.nombre} ha sido creado con exito`, 'success')
        
        //this.router.navigate(['/clientes'])
      },
      //capturar errores de back
      err =>{
        Swal.fire('Error', err.error.mensaje, 'error');

        this.errores = err.error.errors as string[];
        console.error('CODIGO DEL ERROR::.....' + err.status);
        console.error('ERRORES',err);
        
      }
    )
    console.log(JSON.stringify(this.cliente.nombre));
  }

  update():void{
    this.clienteService.update(this.cliente)
    .subscribe(json =>{
      console.log('Obejto de respuesta',json);
      this.router.navigate(['/clientes'])
      Swal.fire('Cliente actualizado', `${json.mensaje}${json.cliente.nombre} ${json.cliente.apellido} fue con exito`, 'success')
    },
    err =>{
      this.errores = err.error.errors as string[];
      console.error('CODIGO DEL ERROR::.....',err.status);
      console.error(err.error.erros);
    })
  }

}
