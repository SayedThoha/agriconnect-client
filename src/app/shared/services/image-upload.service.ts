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
  // Observable<{ fileUrl: string }>
  uploadFile(file: File, folder: string): Observable<any> {
    console.log(file);
    console.log(folder);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return this.http.post<any>(`${this.apiUrl}/image/upload/s3`, formData).pipe(
      map((response) => {
        if (!response || !response.fileUrl) {
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

  uploadProfilePic(file: File, folder: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return this.http.post<any>(
      `${this.apiUrl}/image/uploadnewprofile/s3`,
      formData
    );
  }

  uploadProfileFile(file: File, folder: string): Observable<string> {
    console.log(file,folder)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    console.log(formData)
    return this.http.post<string>(`${this.apiUrl}/image/uploadprofilepic`, formData);
  }

}

// { fileUrl: string }
