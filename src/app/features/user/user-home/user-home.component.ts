import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-user-home',
  imports: [HeaderComponent,FooterComponent,ButtonModule,CommonModule],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {

  greeting=''
  constructor(private _router:Router){}

  ngOnInit(): void {
    const time = new Date().getHours();
      if (time < 10) {
        this.greeting = "Good morning";
      } else if (time < 20) {
        this.greeting = "Good day";
      } else {
        this.greeting = "Good evening";
      } 
  }
  consultButton(){
    this._router.navigate(['/user/ExpertListing'])
  }

}
