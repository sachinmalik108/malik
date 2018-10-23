import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { User } from '../shared/interface.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  
  errors: Array<string> = [];

  constructor(
    private authservice: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  
  OnSignIn(form: NgForm){
    console.log(form.value)
    let user: User = {
      email: form.value.email,
      password: form.value.password
    }
    
    this.authservice.login(user).subscribe(
      (response) => {
        this.router.navigate([''])
      },
      (error) => {
        console.log(error.error)
        console.log(Object.keys(error.error.errors || {})
        .map(key => `${key} ${error.error.errors[key]}`));

        this.errors = Object.keys(error.error.errors || {})
        .map(key => `${key} ${error.error.errors[key]}`)
      }
    )
  }

}
