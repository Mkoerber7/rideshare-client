import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserControllerService } from '../../services/api/user-controller.service';
import { User } from '../../models/user.model';
import { Login } from '../../classes/login';

/**
 * Responsible for providing a user the ability to log in
 * Only uses back end authentication, should be removed once Auth0 is fully implemented
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /**
   * The "username" of the user
   */
  userEmail: string;

  sentLink: boolean;
  errorLink: boolean;

  /**
   * The email to resend confirmation link to
   */
  reEmail: string;

  /**
   * The password associated with the indended account
   */
  userPass: string;

  /**
   * The User to log on to
   */
  currentUser: User;

  principal : Login;

  /**
   * Sets up the Login compoennt with dependency injection
   * @param { AuthService} authService - Provides the ability to authenticate the user
   * @param {Router} route - provides the ability to navigate to landing if user is already logged on
   */
  constructor(
    private authService: AuthService, 
    private route: Router
    ) { }

  /**
   * Checking to see if there is a current user, and if there is, redirects to landing.
   */
  ngOnInit() {
    this.authService.principal.subscribe(u =>{
      this.principal = u;
      if (this.principal.id !== 0){
        this.route.navigate(['/landing']);
      }
    })
      
    }

  /**
   * Gets the parameters from the login fields.
   * If the login fails, displays the error message sent by the server under the password field.
   */
  login() {
    this.authService.authenticate(this.userEmail, this.userPass);
  }

  resendEmail(){
    this.authService.resendConfirmation(this.reEmail).subscribe(complete =>{
      this.errorLink = false;
      this.sentLink = true;
    }, error =>{
      this.errorLink = true;
      this.sentLink = false;
    });
    
  }

  initModal(){
    this.errorLink = false;
    this.sentLink = false;
    this.reEmail = "";
  }
}
