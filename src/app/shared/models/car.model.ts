import { CarImage } from './car-image';

export class Car {
  id?: string;
  make_display: string;
  model_name: string | number;
  model_year: number;
  model_trim: string;
  model_transmission_type: string;
  model_drive: string;
  model_engine_cc: number;
  model_engine_fuel: string;
  model_lkm_mixed: number;
  model_body: string;
  model_seats: number;
  model_new: boolean;
  model_sale: boolean;
  model_conditioning: boolean;
  model_images: any[];
  model_description: string;
  createdAt: Date;
  constructor() {}
}
export class Car1 {
  id?: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  transmissionType: string;
  drive: string;
  engineCc: number;
  engineFuel: string;
  lkmMixed: number;
  body: string;
  seats: number;
  isSale: boolean;
  saleAmount?: number;
  isAirConditioning: boolean;
  rentPrice: [
    {
      duration: string;
      price: number;
    }
  ];
  defaultImage: CarImage;
  images: [CarImage];
  additionalInfo: string;
  createdAt: Date;
  constructor() {
    this.createdAt = new Date();
  }
}
