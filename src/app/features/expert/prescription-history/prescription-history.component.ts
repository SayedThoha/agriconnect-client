import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExpertService } from '../../../shared/services/expert.service';
import { CapitaliseFirstPipe } from '../../../shared/pipes/capitalise-first.pipe';
import { debounceTime } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-prescription-history',
  imports: [
    CommonModule,
    FormsModule,
    CapitaliseFirstPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './prescription-history.component.html',
  styleUrl: './prescription-history.component.css',
})
export class PrescriptionHistoryComponent implements OnInit {
  prescriptions: any[] = [];
  isLoading: boolean = true;
  
  expertId: string | null = '';
  filteredPrescriptions: any[] = [];
  groupedPrescriptions: any[] = [];
  searchForm!: FormGroup;
  constructor(
    private expertService: ExpertService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initialiseForms();
    this.expertId = localStorage.getItem('expertId');
    this.fetchPrescriptionHistory();
    this.setupSearchSubscription();
  }

  fetchPrescriptionHistory(): void {
    this.expertService
      .getPrescriptionHistory({ expertId: this.expertId })
      .subscribe({
        next: (data) => {
          
          this.prescriptions = data.filter(
            (prescription: any) =>
              prescription.bookedSlot.expertId._id === this.expertId
          );
          
          this.groupPrescriptionsByFarmer(this.prescriptions);
          this.isLoading = false;
        },
        error: (error) => {
          
          this.isLoading = false;
        },
      });
  }

  initialiseForms(): void {
    this.searchForm = this.formBuilder.group({
      searchData: ['', Validators.required],
    });
  }

  setupSearchSubscription() {
    this.searchForm
      .get('searchData')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((value) => {
        this.filterPrescriptions(value);
      });
  }

  // **Filter Function**
  filterPrescriptions(searchValue: string): void {
    if (searchValue) {
      const regex = new RegExp(searchValue, 'i');
      const filterd = this.prescriptions.filter((prescription) => {
       
        const fullName = `${prescription.bookedSlot?.userId?.firstName || ''} ${
          prescription.bookedSlot?.userId?.lastName || ''
        }`
          .trim()
          .toLowerCase();
        const issue = prescription.issue?.toLowerCase() || '';
        return regex.test(fullName) || regex.test(issue);
      });
      this.groupPrescriptionsByFarmer(filterd);
    }else{
  
        // 🔹 Reset to original data when search is cleared
        this.groupPrescriptionsByFarmer(this.prescriptions);
        return;
    
    }
  }

  // **Group Prescriptions by Farmer**
  groupPrescriptionsByFarmer(prescriptions: any[]): void {
    const grouped = prescriptions.reduce((acc, prescription) => {
      const fullName = `${prescription.bookedSlot.userId.firstName} ${prescription.bookedSlot.userId.lastName}`;
      if (!acc[fullName]) {
        acc[fullName] = { name: fullName, prescriptions: [] };
      }
      acc[fullName].prescriptions.push(prescription);
      return acc;
    }, {});

    this.groupedPrescriptions = Object.values(grouped);
    
  }

  downloadFarmerHistory(group: any): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Prescription History - ${group.name}`, 14, 15);
  
    const tableData = group.prescriptions.map((prescription: any) => [
      new Date(prescription.createdAt).toLocaleString(),
      prescription.issue,
      prescription.prescription,
    ]);
  
    autoTable(doc, {
      startY: 25,
      head: [['Date and Time','Issue', 'Prescription']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [40, 40, 40] }, // Dark gray header
    });
  
    doc.save(`Prescription_History_${group.name}.pdf`);
  }
}
