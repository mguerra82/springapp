import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Cliente } from './cliente';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import {  formatDate } from '@angular/common';

import { CLIENTES } from './clientes.json';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private urlEndPoint:string = 'http://localhost:8080/api/clientes';

  
  private httpHeader = new HttpHeaders({'Content-Type': 'application/json'})
  constructor(private http: HttpClient,
    private router:Router) { }

  getClientes(page: number): Observable<Cliente[]>{
    //return of(CLIENTES);
    
    return this.http.get(this.urlEndPoint+'/page/'+ page).pipe(
      tap((response:any) => {
        (response.content as Cliente[]).forEach(cliente =>{

        });
      }),

      /**
       * Para el nombre y apellido en mayuscula
       */
      map( (response : any)  =>{
        
        

        (response.content as Cliente[]).map(cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
           // cliente.apellido = cliente.apellido.toUpperCase();

            /**
             * Fecha en español
             * EEEE para desplegar el dia
             * MMMM para desplegar el mes 
             */
            
            //let dataPipe = new DatePipe('en-US');
            //cliente.createAt = dataPipe.transform(cliente.createAt, 'EEE dd, MMMM, yyyy');
            //cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MMMM yyyy', 'es');
            return cliente;
          });
          return response;
      }),
        tap((response:any) => {
          console.log('ClienteService: tap 2', response);
          (response.content as Cliente[]).forEach(cliente =>{
            console.log(cliente.nombre);
          });
        })
      );

  }

  create(cliente: Cliente): Observable<any>{
    return this.http.post
    
    (this.urlEndPoint, cliente, {headers: this.httpHeader})
    .pipe(
      catchError( e => {

        if(e.status=400){
          console.log('error:.....', e.error.error);
          return throwError(e);
        }

      console.error(e.error.mensaje);
      Swal.fire('Error al crear', e.error.error, 'error');
      return throwError(e);
    })
    ); 
  }
  
  getCliente(id:any): Observable<Cliente>{
    console.log('ID:::::...', id);
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`)
    //Capturar los errores del backend
    .pipe(
    
      
      /*,
      catchError(e =>{
      
        this.router.navigate(['/clientes']);
        console.log('ERRORO',e.error.mensaje);
        Swal.fire('Error al editar', e.error.error, 'error');
        return throwError(e);
      })*/
    )
    
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeader})
    .pipe(
      catchError( e => {

        if(e.status=400){
          return throwError(e);
        }

      console.error(e.error.mensaje);
      Swal.fire('Error al actualizar', e.error.mensaje, 'error');
      return throwError(e);
    })
    ); 
  }

  delete(id:number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeader})
    .pipe(
      catchError( e => {
      console.error(e.error.mensaje);
      Swal.fire('Error al eliminar', e.error.mensaje, 'error');
      return throwError(e);
    })
    ); 
  }

}
