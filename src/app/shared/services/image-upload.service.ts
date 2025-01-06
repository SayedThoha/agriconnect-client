import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  
  private _cloudinaryUrl = 'https://api.cloudinary.com/v1_1/ds3bmnf1p/image/upload'
  // private _cloudinaryUrl='https://collection.cloudinary.com/ds3bmnf1p/1e8db06d9122396ddfc25cbf1d372eb6';
  // private _cloudinaryUrl = cloudinary://339639378112214:lFgiJmbHlDFPiRqqLvwk11LlAnM@ds3bmnf1p
  // -X POST --data 'file=<FILE>&timestamp=<TIMESTAMP>&api_key=<API_KEY>&signature=<SIGNATURE>'`;
  constructor(private http: HttpClient) {}
  uploadImage(file: File, uploadPreset: string): Observable<any> {

    console.log('uoload preset:', uploadPreset);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('cloud_name', 'ds3bmnf1p');

    const headers = new HttpHeaders({
      // 'Content-Type': 'multipart/form-data' // Usually not needed as FormData sets the appropriate headers
    });

    return this.http
      .post<{ url: string }>(this._cloudinaryUrl, formData, { headers })
      .pipe(
        map((response) => {
          console.log('response:', response, response.url);
          return response.url;
        }),
        catchError((error) => {
          console.error('Error uploading image:', error);
          return throwError(error);
        })
      );
  }
}
