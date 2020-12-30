import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  userValue: any;

  constructor(private router: Router, private service: CommonService, private ref: ChangeDetectorRef) {
    ref.detach();
    setInterval(() => { this.ref.detectChanges(); }, 5000);
  }

  ngOnInit(): void {
    this.userValue = this.service.userChange.subscribe((value: any) => {
      this.userData = value;
    })

  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
