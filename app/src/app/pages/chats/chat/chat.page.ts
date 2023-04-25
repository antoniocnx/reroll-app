import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  name: string = 'Chat';
  message: string = '';
  isLoading = false;
  currentUserId = 1;
  chats = [
    {id: 1, sender: 1, message: 'Hola!'},
    {id: 2, sender: 2, message: 'Lo primero de todo, cómo están los máquinas?'},
  ];

  constructor() { }

  ngOnInit() {
  }

  sendMessage() {}

}
