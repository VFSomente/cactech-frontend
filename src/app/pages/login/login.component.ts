import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
   isLogin = true;

  loginEmail = '';
  loginPassword = '';
  registerName = '';
  registerEmail = '';
  registerPassword = '';

  toggleForm(login: boolean) {
    this.isLogin = login;
  }

  login() {
    console.log('Login:', this.loginEmail, this.loginPassword);
  }

  register() {
    console.log('Cadastro:', this.registerName, this.registerEmail, this.registerPassword);
  }
}
