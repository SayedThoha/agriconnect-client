import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-success-payment',
  imports: [HeaderComponent,CommonModule,FormsModule],
  templateUrl: './success-payment.component.html',
  styleUrl: './success-payment.component.css'
})
export class SuccessPaymentComponent implements OnInit {
  expertId!:any

  constructor(
    private router:Router,
    private route:ActivatedRoute
  ){}

  ngOnInit(): void {
    this.expertId = this.route.snapshot.paramMap.get('id');
    
  }

  toExpertProfile(){
    this.router.navigate(['/user/expert_profile',this.expertId])
  }

  toHome(){
    this.router.navigate(['/user/userHome'])
  }

}
