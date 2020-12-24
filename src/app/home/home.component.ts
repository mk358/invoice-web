import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  toggleMenu = false;
  showMenu = false;

  constructor() { }

  ngOnInit(): void {
  }

  logout(){}

}
