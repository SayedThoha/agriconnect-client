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
import autoTable from 'jspdf-autotable';
import {
  GroupedPrescription,
  IPrescription,
} from '../../../core/models/slotModel';

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
  prescriptions: IPrescription[] = [];
  isLoading = true;
  expertId: string | null = '';
  filteredPrescriptions: IPrescription[] = [];
  groupedPrescriptions: GroupedPrescription[] = [];
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
    if (this.expertId) {
      this.expertService
        .getPrescriptionHistory({ expertId: this.expertId })
        .subscribe({
          next: (data) => {
            this.prescriptions = data.filter(
              (prescription) =>
                prescription.bookedSlot.expertId._id === this.expertId
            );

            this.groupPrescriptionsByFarmer(this.prescriptions);
            this.isLoading = false;
          },
          error: (error) => {
            console.error(error);
            this.isLoading = false;
          },
        });
    }
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
    } else {
      this.groupPrescriptionsByFarmer(this.prescriptions);
      return;
    }
  }

  groupPrescriptionsByFarmer(prescriptions: IPrescription[]): void {
    const grouped = prescriptions.reduce((acc, prescription) => {
      const fullName = `${prescription.bookedSlot.userId.firstName} ${prescription.bookedSlot.userId.lastName}`;
      if (!acc[fullName]) {
        acc[fullName] = { name: fullName, prescriptions: [] };
      }
      acc[fullName].prescriptions.push(prescription);
      return acc;
    }, {}as Record<string, GroupedPrescription>);

    this.groupedPrescriptions = Object.values(grouped);
  }

  downloadFarmerHistory(group:GroupedPrescription): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Prescription History - ${group.name}`, 14, 15);

    const tableData = group.prescriptions.map((prescription) => [
      new Date(prescription.createdAt).toLocaleString(),
      prescription.issue,
      prescription.prescription,
    ]);

    autoTable(doc, {
      startY: 25,
      head: [['Date and Time', 'Issue', 'Prescription']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [40, 40, 40] },
    });

    doc.save(`Prescription_History_${group.name}.pdf`);
  }
}
