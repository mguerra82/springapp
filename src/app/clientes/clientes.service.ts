import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Cliente } from './cliente';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
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

  getClientes(): Observable<Cliente[]>{
    //return of(CLIENTES);
    
    return this.http.get(this.urlEndPoint).pipe(
      map( (Response ) => Response as Cliente[])
    );

  }

  create(cliente: Cliente): Observable<any>{
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeader})
    .pipe(
      map((response: any) => response.cliente as Cliente),
      catchError( e => {

        if(e.status=400){
          return throwError(e);
        }

      console.error(e.error.mensaje);
      Swal.fire('Error al crear', e.error.mensaje, 'error');
      return throwError(e);
    })
    ); 
  }
  
  getCliente(id:any): Observable<Cliente>{
    console.log('ID:::::...', id);
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`)
    //Capturar los errores del backend
    .pipe(
      catchError(e =>{
      
        this.router.navigate(['/clientes']);
        console.log('ERRORO',e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
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
