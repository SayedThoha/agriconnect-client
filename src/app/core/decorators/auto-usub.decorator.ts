import { OnDestroy } from '@angular/core';

export function AutoUnsubscribe(constructor: any) {
  // Get a reference to the original ngOnDestroy function of the component/service
  const original = constructor.prototype.ngOnDestroy;

  // Override the ngOnDestroy function of the component/service
  constructor.prototype.ngOnDestroy = function() {
    console.log(`ngOnDestroy called for ${constructor.name}`);
    // Loop through all properties of the component/service
    for (const prop in this) {
      const property = this[prop];
      // Check if the property is a subscription
      if (property && typeof property.unsubscribe === 'function') {
         // Call the unsubscribe function to unsubscribe from the subscription
         console.log(`Unsubscribing from: ${prop}`);
         
        property.unsubscribe();
      }
    }

    original?.apply(this, arguments);
  };
}