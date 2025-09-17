import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appointmentCode',
})
export class AppointmentCodePipe implements PipeTransform {
  transform(objectId: string): string {
    if (!objectId) return '';
    return 'APPT-' + objectId.substring(0, 6).toUpperCase();
  }
}
