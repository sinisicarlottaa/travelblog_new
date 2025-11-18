import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

import { TravelService } from '../shared/service/travel.service';
import { Travel } from '../shared/models/travel.model';
import { ToastService } from '../shared/service/toast.service';

@Component({
  selector: 'app-new-travel-page',
  standalone: true,
  imports: [ReactiveFormsModule],
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

  constructor(private fb: FormBuilder) {
    this.formAddTravel = this.fb.group({
      id: [Math.random().toString()],
      city: ['', { nonNullable: true, validators: [Validators.required] }],
      country: ['', { nonNullable: true, validators: [Validators.required] }],
      year: [null, { validators: [Validators.required] }],
      type: ['Y', [Validators.required]],
      image: ['', { nonNullable: true, validators: [Validators.required] }],
      description: ['', { nonNullable: true, validators: [Validators.required] }],
      highlights: [''],
      activities: [''],
      food: this.fb.group({
        dish: ['', ],
        place: ['', ],
      }),
      rating: [null, { validators: [Validators.required] }],
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

      const firstFood = travel.foods?.[0] ?? { dish: '', place: '' };

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
      this.toastService.showToastError('Impossibile caricare il viaggio da modificare.');
      this.router.navigate(['/visited-travels']);
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
      foods: foodArray,
      rating: value.rating ?? 0,
      user: ''
    };

    this.isLoading = true;

    try {
      if (this.isEditMode) {
        await firstValueFrom(this.travelService.update(travel));
      } else {
        await firstValueFrom(this.travelService.submit(travel));
      }

      this.toastService.showToastSuccess(
        this.isEditMode ? 'Viaggio aggiornato!' : 'Viaggio aggiunto!'
      );
      this.router.navigate(['/visited-travels']);
    } catch (error) {
      console.error('Errore salvataggio viaggio:', error);

      this.toastService.showToastError(
        this.isEditMode
          ? 'Impossibile aggiornare il viaggio.'
          : 'Impossibile aggiungere il viaggio.'
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
