import { Component, OnInit } from '@angular/core';
import { Car } from '../../models/car.model';
import { UserControllerService } from '../../services/api/user-controller.service';
import { User } from '../../models/user.model';

/**
 * Supports the functionality of car registration and management
 */
@Component({
  selector: 'app-car-registration',
  templateUrl: './car-registration.component.html',
  styleUrls: ['./car-registration.component.css']
})
export class CarRegistrationComponent implements OnInit {

  /**
   * The User that owns the car
   */
  userObject: User;

  // for drivers
  /**
   * The car to create and register
   */
  carObject: Car;
  /**
   * The company that manufactured it
   */
  carMake: string;

  /**
   * Model of the car
   */
  carModel: string;

  /**
   * When the car was produced
   */
  carYear: number;

  /**
   * Relic from the AccountInfoComponent that previously managed cars
   */
  optInToDrive: boolean;

  /**
   * List of cars owned by the ownwer to present in a table
   */
  cars: Car[];

  // booleans for car information buttons
  btnCarInfo: Number = 0;

  /**
   * Sets up the Car Registration component with dependencies
   * @param {UserControllerService} userService - the Service that allows us to manager the user AND the cars available on the system
   */
  constructor(private userService: UserControllerService) { }

  /**
   * Makes sure there is a car object available to operate on
   */
  ngOnInit() {
    this.carObject = new Car();
  }

  /**
   * Clears the fields in the form
   */
  resetCars() {

    if (this.cars !== undefined && this.cars != null && this.cars.length !== 0) {
      return;
    }
    this.resetUser();
    const userId = this.userObject.id;
    this.cars = [];
    this.userService.getAllCars().subscribe(c => {

      c.forEach(element => {
        const strNum = element.owner.substring(7);
        const num = Number.parseInt(strNum);
        if (num === userId) {
          this.cars.push(element);
        }
      });
    });
  }


  /**
   * Ensures that the component is working with the logged on user
   */
  resetUser() {
    this.userService.getCurrentUser().subscribe(user => {
      console.log('Car reg: Gotten User: ' + user);
      this.userObject = user;
    },
    e => {
      console.log('Car reg: Failed to get user: ' + e);
    });

  }

  /**
   * Sets the car with appropriate values and sends it to the server using the User Service
   */
  addCarToUser() {

    this.resetUser();

    this.carObject.id = 0;
    this.carObject.make = this.carMake;
    this.carObject.model = this.carModel;

    this.carObject.owner = '/users/' + this.userObject.id.toString();
    this.carObject.year = this.carYear;
    // this.userObject.cars.push(this.carObject);

    this.userService.createCar(this.carObject).subscribe(car => {
      this.carObject = car;
    });

  }

  /**
   * Refreshes the fields in the Car form
   */
  refreshFields() {
    this.carMake = '';
    this.carModel = '';
    this.carYear = new Date().getFullYear();
  }

}
