import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ExpertService } from '../services/expert.service';
import { MessageToasterService } from '../services/message-toaster.service';
import { UserService } from '../services/user.service';
import { CommonService } from '../services/common.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoUnsubscribe } from '../../core/decorators/auto-usub.decorator';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-prescription-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './prescription-modal.component.html',
  styleUrl: './prescription-modal.component.css',
})
@AutoUnsubscribe
export class PrescriptionModalComponent implements OnInit, OnChanges {
  @Input()
  prescription_id: string | null = null;
  modal!: { _id: string };
  auth!: string;
  issue!: string;
  prescription_note!: string;
  expertName!: string;
  specialisation!: string;
  consultedDate!: Date;
  constructor(
    private commonService: CommonService,
    private userService: UserService,
    private expertService: ExpertService,
    private messageService: MessageToasterService
  ) {}

  ngOnInit(): void {
    this.auth = this.commonService.getAuthFromLocalStorage();
    this.get_prescription();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['prescription_id'] && this.prescription_id) {
      this.get_prescription();
      this.openModal();
    }
  }

  get_prescription() {
    this.auth = this.commonService.getAuthFromLocalStorage();
    if (this.auth === 'user' && this.prescription_id) {
      this.userService
        .get_prescription_details({ _id: this.prescription_id })
        .subscribe({
          next: (Response) => {
            this.issue = Response.issue;
            this.prescription_note = Response.prescription;
            this.expertName = `${Response.bookedSlot.expertId.firstName} ${Response.bookedSlot.expertId.lastName}`;
            this.specialisation = `${Response.bookedSlot.expertId.specialisation}`;
            this.consultedDate = Response.createdAt;
          },
          error: (error) => {
            this.messageService.showErrorToastr(error.error.message);
          },
        });
    }

    if (this.auth === 'expert' && this.prescription_id) {
      this.expertService
        .get_prescription_details({ _id: this.prescription_id })
        .subscribe({
          next: (Response) => {
            this.issue = Response.issue;
            this.prescription_note = Response.prescription;
          },
          error: (error) => {
            this.messageService.showErrorToastr(error.error.message);
          },
        });
    }
  }

  openModal() {
    const modal = document.getElementById('prescription-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeModal() {
    const modal = document.getElementById('prescription-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  downloadPrescription() {
    const formatDate = (dateString: any) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.text('Consultation Summary', pageWidth / 2, 20, { align: 'center' });

    pdf.setLineWidth(0.5);
    pdf.line(20, 25, pageWidth - 20, 25);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    const expertSection = 40;
    if (this.expertName) {
      pdf.text(`Expert: ${this.expertName}`, 20, expertSection);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `Field of Expertise: ${this.specialisation}`,
        20,
        expertSection + 10
      );
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Field of Expertise: ${this.specialisation}`, 20, expertSection);
    }

    pdf.setLineWidth(0.3);
    pdf.line(20, expertSection + 20, pageWidth - 20, expertSection + 20);

    const issueSection = expertSection + 40;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Consultation Topic:', 20, issueSection);
    pdf.setFont('helvetica', 'normal');
    pdf.text(this.issue, 30, issueSection + 10, {
      maxWidth: 150,
      align: 'left',
    });

    const recommendationSection = issueSection + 40;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Expert Recommendation:', 20, recommendationSection);
    pdf.setFont('helvetica', 'normal');
    pdf.text(this.prescription_note, 30, recommendationSection + 10, {
      maxWidth: 150,
      align: 'left',
    });

    const footer = pdf.internal.pageSize.height - 30;
    pdf.setFontSize(10);
    pdf.text(
      `Consultation Date: ${formatDate(this.consultedDate)}`,
      20,
      footer
    );
    pdf.text("Expert's Signature: _________________", pageWidth - 90, footer);

    pdf.save('consultation_summary.pdf');
  }
}
