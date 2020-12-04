import { UserLogin } from './../model/UserLogin';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  UserLogin: UserLogin = new UserLogin()

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  entrar(){
    this.authService.logar(this.UserLogin).subscribe((resp: UserLogin) =>{
      this.UserLogin= resp
      localStorage.setItem('token',this.UserLogin.token)
      this.router.navigate(['/feed'])

    })
  }

}
