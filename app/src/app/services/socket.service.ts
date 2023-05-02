import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

const url = environment.heroku_url;
// const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  
  private socket: any;

  constructor() { }

  // public setupSocketConnection(): Observable<any> {
  //   this.socket = io( url );
  //   return new Observable((observer) => {
  //     this.socket.on('Nueva acción', (data) => {
  //       observer.next(data);
  //     });
  //   });
  // }
}
