import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home/home.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
});

  constructor(private loginService: LoginService, private router: Router) { }


  ngOnInit() {
  }

  onSubmit() {
    const user = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value
  };

  this.loginService.getLogin(user);
  }

}
