import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CarFormParam } from '../../shared/models/car-form-param.model';
import { AdminCarService } from '../../shared/services/admin-car.service';
import { CarFormDataService } from '../../shared/services/car-form-data.service';

@Component({
  selector: 'crayf-api-form',
  templateUrl: './api-form.component.html',
  styleUrls: ['./api-form.component.scss'],
})
export class ApiFormComponent implements OnInit {
  @Input() currentCar;
  apiCarForm: FormGroup;
  apiCarFormParams: Array<CarFormParam>;
  // @Input() apiCarParams;
  // @Input() currentTrim;
  @Output() onApiCarFormChange = new EventEmitter<FormGroup>(true);

  constructor(
    private fb: FormBuilder,
    private adminCarService: AdminCarService,
    private carFormDataService: CarFormDataService,
  ) {}
  ngOnChanges(changes: SimpleChanges) {
    if (this.currentCar && this.apiCarForm) {
      this.apiCarForm.patchValue(this.currentCar);
    }
  }
  ngOnDestroy() {
    // this.apiCarForm.reset();
  }
  ngOnInit() {
    this.apiCarFormParams = this.carFormDataService.apiCarFormParams;
    this.createApiCarForm();
    this.apiCarForm.valueChanges.subscribe(() => {
      let isShow = true;
      this.apiCarFormParams.map(param => {
        param.isShow = isShow;
        if (this.apiCarForm.controls[param.name].invalid) {
          isShow = false;
        }
      });

      this.onApiCarFormChange.emit(this.apiCarForm);
    });
    if (this.currentCar && this.apiCarForm) {
      this.apiCarForm.patchValue(this.currentCar);
    }
  }
  createApiCarForm() {
    const apiConfig = this.carFormDataService.getFormControlConfig(
      this.apiCarFormParams,
    );
    this.apiCarForm = this.fb.group(apiConfig);
  }
}
