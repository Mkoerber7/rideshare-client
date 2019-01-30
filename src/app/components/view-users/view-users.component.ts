import { Component, OnInit, Injectable } from '@angular/core';
import { UserControllerService } from '../../services/api/user-controller.service';
import { User } from '../../models/user.model';
import { Login } from '../../classes/login'
import { Role } from '../../models/role.model'
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
@Injectable()
export class ViewUsersComponent implements OnInit {

  currentUser: User;
    /** 
       * @param userService
       * @param {AuthService} authService
       */

  constructor(
    private userService: UserControllerService,
    private authService: AuthService,
    private router : Router) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      }
    }
    /** The first name of the user (hooked to form item in html) */
  firstName: string;
  /** The last name of the user (hooked to form item in html) */
  lastName: string;
  /** The user name of the user (hooked to form item in html) */
  username: string;
  /** The password of the user (hooked to form item in html) */
  password: string;
  /** The password of the user, used to confirm User knows the password (hooked to form item in html) */
  confirmPassword: string;
  /** The address of the user (hooked to form item in html) */
  address2: string;
  /** The day the User's batch ends*/
  batchEnd: any;
  /** Holds the list of all users in the system */
  users: any[];
  /** Holds the list of users filtered with search query */
  filteredUsers: any[];
  /** Holds list of all users that you are paginating*/
  paginatedUsers: any[];
  /**Number of pages */
  numPages: any[];
  /**save the current page for next and back buttons */
  currPage: number;
  /** Whether the user can make changes (Currently not used) */
  canEdit = false;
  /** User's active state */
  active: string;
  
  userId: number;
  userStatus: string;
  
  principal : Login;
  
  /**
  * Sets up the form with data about the durrent user
  */


  ngOnInit() { 
    console.log("ngOnInit");
    this.authService.principal.subscribe(user => {
      this.principal = user;
    });
    console.log("getting users");
    this.getUsers().then(data=> 
      {
        this.users = data;
        this.filterUsers("");
        
      });
    this.getRole();
    this.getState();
  }

  switchRole() {
    if (this.principal.currentRole === 'DRIVER') {
      this.principal.currentRole ='RIDER';
      this.authService.changePrincipal(this.principal);
      this.getRole();
    } else if (this.principal.currentRole === 'RIDER') {
      this.principal.currentRole = 'DRIVER';
      this.authService.changePrincipal(this.principal);
      this.getRole();
    } else {
      console.log('nope');
    }
  }

  switchState() {
    if (this.principal.active === 'ACTIVE') {
      this.principal.active = 'INACTIVE';
      this.authService.changePrincipal(this.principal);
      this.getState();
    } else if (this.principal.active === 'INACTIVE') {
      this.principal.active = 'ACTIVE';
      this.authService.changePrincipal(this.principal);
      this.getState();
    } else {
      console.log("Invalid State");
    }
  }
  
  
  currentRole: string; 
  getRole() {
    this.currentRole = this.principal.currentRole;
  }
  currentState: string;
  getState() {
    this.currentState = this.principal.active;
  }
  /** Sets up all users in the system */
  getUsers() {
    let data;
    console.log("hitting users");
    if (this.principal.currentRole === 'ADMIN') {
        return this.userService.getAllUsers().then((x) => { 
        data = x.filter(x => x.role === 'DRIVER' || x.role === 'RIDER' || x.role === 'TRAINER' || x.role === 'ADMIN'); 
        this.users = data;
        return data;
      });
    } 
    else if (this.principal.currentRole === 'TRAINER') {
      this.userService.getAllUsers().then((x) => { data = x.filter(x => x.role === 'DRIVER' || x.role === 'RIDER');
       this.users = data;
      });
    }
    console.log(data);
  }
  
  
  paginate(users: any[], pageSize: number, pageNumber: number)
    {
      this.currPage = pageNumber;
      --pageNumber;
      const result = users.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
      console.log(pageNumber, pageSize);
      console.log("Page number: " + this.numPages);
      this.paginatedUsers = result;
      console.log("how many paginated users?  ", this.paginatedUsers)
      // this.filterUsers("");
      return this.paginatedUsers;
    }
  
  dividePages(users: any[], divider:number)
  {
    this.numPages = [];
    let counter = 0;
    counter = Math.round(users.length / divider);
    let n = 1;
    while(n <= counter)
    {
      this.numPages.push(n++);
    }
    console.log("Number of pages: " + this.numPages);
    return this.numPages;
  }

  confirmUserStatus(id: number, active: string) {
    console.log("confirming");
    this.userId = id;
    this.userStatus = active;
    console.log(this.userId);
    console.log(this.userStatus);
  }

  updateUserStatus() {
    console.log("updating");
    if (this.userStatus !== 'DISABLED') {
      //this.result = window.confirm("Are you sure you want to disable this account?");
      this.userStatus = 'DISABLED';
    } else {
      //this.result = window.confirm("Are you sure you want to enable this account?");
      this.userStatus = 'ACTIVE';
    }
    
      this.userService.updateStatus(this.userId, this.userStatus).then();
      this.router.navigate(['/viewUsers']);
    
  }

  setUserId(id: number) {
      this.userId = id;
  }

  
  makeTrainer() {
    //this.result = window.confirm("Are you sure you want to make this user a trainer?");
    let role = 'TRAINER';
      this.userService.updateRole(this.userId, role).then();
      this.router.navigate(['/viewUsers']);
    } 
  

  makeAdmin() {
    //this.result = window.confirm("Are you sure you want to make this user an admin?");
    let role = 'ADMIN';
      this.userService.updateRole(this.userId, role).then();
      this.router.navigate(['/viewUsers']);
  }

  makeDriver() {
    //this.result = window.confirm("This user is now a Driver");
    let role = 'DRIVER';
      this.userService.updateRole(this.userId, role).then();
      this.router.navigate(['/viewUsers']);
    }

  makeRider() {
   //this.result = window.confirm("This user is now a Rider.");
    let role = 'RIDER';
    //console.log("Called makeRider");
   
      this.userService.updateRole(this.userId, role).then();
      this.router.navigate(['/viewUsers']);
    }
  

  public filterUsers(query) {
    console.log("query: " + query)
    let searchUsers = this.users;
    console.log("how many users: " + this.users.length)
    if (query.length < 1) {
      console.log("returning all users: ", this.users.length)
      this.filteredUsers = this.users;
      this.paginate(this.filteredUsers, 10, 1);
      this.dividePages(this.filteredUsers, 10);
      return;
    }
    query = query.trim();
    const queryStrings = query.split(" ");
    this.filteredUsers = searchUsers.filter(user => {
      for (let key in user) {
        let data = user[key];
        if (typeof data === "string") {
          data = data.toLowerCase();
          for (let searchTerm of queryStrings) {
            searchTerm = searchTerm.toLocaleLowerCase();
            let found = data.search(searchTerm);
            if (found > -1) {
              return user;
            }
          }

        }
      }
    });
    this.paginate(this.filteredUsers, 10, 1);
    this.dividePages(this.filteredUsers, 10);
  }

  reload() {
    this.router.navigate(['/viewUsers']);
  }


}

