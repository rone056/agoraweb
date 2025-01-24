import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  hidePassword = true
  matcher = new MyErrorStateMatcher();

  constructor() { 
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      remember: new FormControl('', [])
    });
  }

  ngOnInit() {    
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  public login(){
    if(this.loginForm.valid){
      this.executeLoginRequest(this.loginForm.value);
    }
  }

  private executeLoginRequest(loginFormValue: { email: any; password: any; remember: any; }){
    let credentials = {
      email: loginFormValue.email,
      password: loginFormValue.password,
      remember: loginFormValue.remember
    }
    console.warn("Credentials : ", credentials)
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
