import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pdf-viewer',
  imports: [],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.css',
})
export class PdfViewerComponent implements OnInit {
  pdfUrl!: SafeResourceUrl;

  constructor(
    private _route: ActivatedRoute,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this._route.queryParams.subscribe((params) => {
      const unsafeUrl = params['url'];
      if (unsafeUrl) {
        try {
          let decodedUrl = decodeURIComponent(unsafeUrl);

          if (decodedUrl.startsWith('http://')) {
            decodedUrl = decodedUrl.replace('http://', 'https://');
          }
          this.pdfUrl =
            this._sanitizer.bypassSecurityTrustResourceUrl(decodedUrl);
        } catch (error) {
          console.error('Error setting PDF URL:', error);
        }
      }
    });
  }
}
