import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConnectedOverlayScrollHandler } from 'primeng/dom';

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

    console.log("i a here calling this");
    console.log(formData.values());

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

  // uploadProfilePic(file: File, folder: string): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('folder', folder);

  //   return this.http.post<any>(
  //     `${this.apiUrl}/image/uploadnewprofile/s3`,
  //     formData
  //   );
  // }

  // uploadProfileFile(file: File, folder: string): Observable<any> {
  //   console.log(file,folder)
  //   const formData = new FormData();
  //   formData.append('f', file);
  //   formData.append('folder', folder);
  //   const headers = new HttpHeaders();
  //   headers.append('Content-Type', 'multipart/form-data');
    
  //   return this.http.post<string>(`${this.apiUrl}/profile/uploadprofilepic`, formData,{headers});
  // }

  uploadProfilePic(file: File, folder: string): Observable<any>{
    console.log("file",file)
    console.log("folder",folder)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    console.log(formData);

    // return this.http.post<any>(`${this.apiUrl}/api/upload/profilepic`, formData)
    return this.http.post<any>(`${this.apiUrl}/api/upload/profilepic`, formData).pipe(
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
}

// { fileUrl: string }
