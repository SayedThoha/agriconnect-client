/* eslint-disable @typescript-eslint/no-explicit-any */
export function AutoUnsubscribe(constructor: any) {
  const original = constructor.prototype.ngOnDestroy;

  constructor.prototype.ngOnDestroy = function (...args: unknown[]) {
    for (const prop in this) {
      const property = this[prop];

      if (property && typeof property.unsubscribe === 'function') {
        property.unsubscribe();
      }
    }

    original?.apply(this, args);
  };
}
