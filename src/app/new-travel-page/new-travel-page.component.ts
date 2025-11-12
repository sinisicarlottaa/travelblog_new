import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

import { TravelService } from '../shared/travel.service';
import { Travel } from '../shared/travel.model';

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

  isEditMode = false;
  isLoading = false;

  formAddTravel = new FormGroup({
    id: new FormControl(Math.random().toString()),
    city: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    country: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    year: new FormControl<number | null>(null),
    type: new FormControl<'Y' | 'N'>('Y', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    image: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    highlights: new FormControl<string[]>([], { nonNullable: true }),
    activities: new FormControl<string[]>([], { nonNullable: true }),
    food: new FormGroup({
      dish: new FormControl('', { nonNullable: true }),
      place: new FormControl('', { nonNullable: true }),
    }),
    rating: new FormControl<number | null>(null),
  });

  async ngOnInit(): Promise<void> {
    const editId = this.route.snapshot.queryParamMap.get('editId');
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
      await Swal.fire({
        icon: 'error',
        title: 'Errore',
        text: 'Impossibile caricare il viaggio da modificare.',
      });
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
      highlights: value.highlights ?? [],
      activities: value.activities ?? [],
      foods: foodArray,
      rating: value.rating ?? 0,
    };

    this.isLoading = true;

    try {
      if (this.isEditMode) {
        await firstValueFrom(this.travelService.update(travel));
      } else {
        await firstValueFrom(this.travelService.submit(travel));
      }

      await Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'success',
        title: this.isEditMode ? 'Viaggio aggiornato!' : 'Viaggio aggiunto!',
      });

      this.router.navigate(['/visited-travels']);
    } catch (error) {
      console.error('Errore salvataggio viaggio:', error);
      await Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'error',
        title: 'Errore',
        text: this.isEditMode
          ? 'Impossibile aggiornare il viaggio.'
          : 'Impossibile aggiungere il viaggio.',
      });
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
          highlights: [],
          activities: [],
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
