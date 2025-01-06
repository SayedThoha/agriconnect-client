import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expert-home',
  imports: [HeaderComponent,FooterComponent],
  templateUrl: './expert-home.component.html',
  styleUrl: './expert-home.component.css'
})
export class ExpertHomeComponent {

  constructor(
    private _router:Router
  ){}

  goToProfile(){
    this._router.navigate(['/expert/expert_profile'])
  }

}
