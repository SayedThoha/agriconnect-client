import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  uploadFile(file: File, folder: string): Observable<any> {
   
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return this.http.post<any>(`${this.apiUrl}/image/upload/s3`, formData).pipe(
      map((response) => {
        if (!response) {
          throw new Error('Invalid response from server');
        }
        return response;
      }),
      catchError((error) => {
        console.error('Upload file error:', error);
        return throwError(() => new Error('Failed to upload file to S3'));
      })
    );
  }

  
}
