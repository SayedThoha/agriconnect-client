import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [HeaderComponent,FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router:Router){}

  onclick(){
    localStorage.setItem('auth','user')
    this.router.navigate(['/user/login'])
  }

  consultButton(){
    localStorage.setItem('auth','user')
    this.router.navigate(['/user/login'])
  }
}
