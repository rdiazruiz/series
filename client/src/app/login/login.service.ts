import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  hash;

  // Observable con los datos del usuario
  private user = new BehaviorSubject(null);

  constructor(private http: HttpClient, private router: Router) { }

  // Escuchamos los datos del usuario
  getUser() { return this.user.asObservable(); }

  // Hacemos la petición de login para iniciar sesion
  getLogin(credentials) {
    this.http.post('http://localhost:3000/api/session', credentials).subscribe((data: any) => {
      sessionStorage.setItem('hash', JSON.stringify(data));
      this.router.navigate(['/home']);
      this.hash = data.hash;

      this.getUserProfile(data.hash);

    }, error => {
      console.log(error.error.message);
    });
  }

  getUserProfile(hash) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': hash
      })
    };

    this.http.get('http://localhost:3000/api/profile', httpOptions).subscribe(user => {
      return this.user.next(user);
    }, error => {
      console.log(error.error.message);
    });
  }


  getLogout() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.hash
      })
    };
    this.http.delete('http://localhost:3000/api/session', httpOptions).subscribe(logout => {
      sessionStorage.removeItem('hash');
      return this.user.next(null);
    }, error => {
      console.log('Error al hacer el logout');
    }, () => {
      this.router.navigate(['/home']);
  });
  }

}
