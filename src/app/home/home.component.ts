import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  toggleMenu = false;
  showMenu = false;
  userData: any;

  constructor(private router: Router, private service: CommonService) { }

  ngOnInit(): void {
    this.userData = this.service.userData;
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
