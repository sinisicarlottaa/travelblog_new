import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TravelService } from '../shared/service/travel.service';
import { Travel } from '../shared/models/travel.model';
import { ToastService } from '../shared/service/toast.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-new-travel-page',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './new-travel-page.component.html',
  styleUrl: './new-travel-page.component.scss',
})
export class NewTravelPageComponent implements OnInit {
  private travelService = inject(TravelService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  isEditMode = false;
  isLoading = false;

  formAddTravel: FormGroup;

  constructor(private fb: FormBuilder, private translateService: TranslateService) {
    this.formAddTravel = this.fb.group({
      id: [Math.random().toString()],
      city: ['', { nonNullable: true, validators: [Validators.required] }],
      country: ['', { nonNullable: true, validators: [Validators.required] }],
      year: [null],
      type: ['Y', [Validators.required]],
      image: ['', { nonNullable: true, validators: [Validators.required] }],
      description: ['', { nonNullable: true, validators: [Validators.required] }],
      highlights: [''],
      activities: [''],
      food: this.fb.group({
        dish: [''],
        place: [''],
      }),
      rating: [null],
    });
  }

  ngOnInit() {
    const editId = this.route.snapshot.queryParamMap.get('editId');
    this.init(editId);
  }

  async init(editId: string | null): Promise<void> {
    if (!editId) {
      return;
    }

    this.isEditMode = true;
    this.isLoading = true;

    try {
      const travel = await firstValueFrom(this.travelService.getTravelById(editId));

      const firstFood = travel.food?.[0] ?? { dish: '', place: '' };
      console.log(travel);
      console.log(firstFood);

      this.formAddTravel.patchValue({
        id: travel.id,
        city: travel.city,
        country: travel.country,
        year: travel.year,
        type: travel.type,
        image: travel.image,
        description: travel.description,
        highlights: travel.highlights,
        activities: travel.activities,
        food: {
          dish: firstFood.dish,
          place: firstFood.place,
        },
        rating: travel.rating,
      });
    } catch (e) {
      console.error(e);
      this.toastService.showToastError(this.translateService.instant('ERROR.CANNOT_LOAD_TRAVEL'));
      this.router.navigate(['/home']);
    } finally {
      this.isLoading = false;
    }
  }

  async onAddTravel() {
    console.log('FORM VALID?', this.formAddTravel.valid);
    console.log('FORM VALUE:', this.formAddTravel.value);

    if (this.formAddTravel.invalid) return;

    const value = this.formAddTravel.getRawValue();

    const foodArray =
      value.food && (value.food.dish || value.food.place)
        ? [
            {
              dish: value.food.dish ?? '',
              place: value.food.place ?? '',
            },
          ]
        : [];

    const travel: Travel = {
      id: value.id ?? Math.random().toString(),
      city: value.city,
      country: value.country,
      year: value.year || new Date().getFullYear(),
      type: value.type,
      image: value.image,
      description: value.description,
      highlights: value.highlights,
      activities: value.activities,
      food: foodArray,
      rating: value.rating ?? 0,
      author: '',
    };

    this.isLoading = true;

    try {
      if (this.isEditMode) {
        await firstValueFrom(this.travelService.update(travel));
      } else {
        await firstValueFrom(this.travelService.submit(travel));
      }

      this.toastService.showToastSuccess(
        this.isEditMode
          ? this.translateService.instant('NEW_TRAVEL.MESSAGE.TRAVEL_UPDATED')!
          : this.translateService.instant('NEW_TRAVEL.MESSAGE.TRAVEL_ADDED')!
      );
      /* this.toastService.showToastSuccess(
        this.isEditMode ? 'Viaggio aggiornato!' : 'Viaggio aggiunto!'
      ); */
      this.router.navigate(['/visited-alltravels']);
    } catch (error) {
      console.error('Errore salvataggio viaggio:', error);

      this.toastService.showToastError(
        this.isEditMode
          ? this.translateService.instant('NEW_TRAVEL.ERROR.CANNOT_UPDATE_TRAVEL')!
          : this.translateService.instant('NEW_TRAVEL.ERROR.CANNOT_ADD_TRAVEL')!
      );
    } finally {
      this.isLoading = false;

      if (!this.isEditMode) {
        this.formAddTravel.reset({
          id: Math.random().toString(),
          city: '',
          country: '',
          year: null,
          type: 'Y',
          image: '',
          description: '',
          highlights: '',
          activities: '',
          food: {
            dish: '',
            place: '',
          },
          rating: null,
        });
      }
    }
  }
}
