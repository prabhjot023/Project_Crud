import { EventEmitter, Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class CommonService {
  _showLoader: EventEmitter<boolean> = new EventEmitter<boolean>(true);

  set showLoader(val: boolean) {
    this._showLoader.emit(val);
  }
}
