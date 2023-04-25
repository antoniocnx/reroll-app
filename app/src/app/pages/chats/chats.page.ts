import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatPage implements OnInit {

  // @ViewChild('popover') popover: PopoverController;
  segment = 'chats';
  open_new_chat = false;
  users = [
    {id: 1, name: 'NIkhil', photo: 'https://i.pravatar.cc/315'},
    {id: 2, name: 'XYZ', photo: 'https://i.pravatar.cc/325'},
  ];
  chatRooms = [
    {id: 1, name: 'NIkhil', photo: 'https://i.pravatar.cc/315'},
    {id: 2, name: 'XYZ', photo: 'https://i.pravatar.cc/325'},
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSegmentChanged(event: any) {
    console.log(event);
  }

  newChat() {
    this.open_new_chat = true;
  }

  onWillDismiss(event: any) {}

  // cancel() {
  //   this.modal.dismiss();
  //   this.open_new_chat = false;
  // }

  startChat(item: any) {

  }

  getChat(item: any) {
    this.router.navigate(['/', 'user','chats', 'chat', item?.id]);
  }

}
