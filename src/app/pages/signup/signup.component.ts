import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public signupForm: FormGroup;
  hidePassword = true
  matcher = new MyErrorStateMatcher();

  constructor() { 
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      terms: new FormControl('', [])
    });
  }

  ngOnInit() {    
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.signupForm.controls[controlName].hasError(errorName);
  }

  public signup(){
    if(this.signupForm.valid){
      this.executesignupRequest(this.signupForm.value);
    }
  }

  private executesignupRequest(signupFormValue: { email: any; password: any; terms: any; }){
    let credentials = {
      email: signupFormValue.email,
      password: signupFormValue.password,
      remember: signupFormValue.terms
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
