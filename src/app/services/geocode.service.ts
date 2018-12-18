import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/**
 * Provides Specific geolocation services from Google maps
 */
@Injectable({
  providedIn: 'root'
})
export class GeocodeService {

  dev: boolean = true;
  endpoint: string = this.dev ? 'http://localhost:3333/location/?address=' : 'http://ec2-35-174-153-234.compute-1.amazonaws.com:3333/location/?address=';

  /**
   * Sets up the Service with a Google Maps object
   */
  constructor(private http: HttpClient) {

  }

  /**
   * Attempts to mark a location using an address
   * @param address - the address of a location to obtain information about
   * @returns {Observable<google.maps.GeocoderResult[]>} - information about your given location
   */
  geocode(address: string): Observable<object> {
    return this.http.get(this.endpoint);
  }
}
