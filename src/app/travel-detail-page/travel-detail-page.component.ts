import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { Travel } from '../shared/travel.model';
import { TravelService } from '../shared/travel.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-travel-detail-page',
  imports: [RouterLink, NgClass],
  templateUrl: './travel-detail-page.component.html',
  styleUrl: './travel-detail-page.component.scss',
})
export class TravelDetailPageComponent {
  private route = inject(ActivatedRoute);
  private travelService = inject(TravelService);
  private router = inject(Router);

  travel = signal<Travel | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('travelId');
    if (!id) {
      this.error.set('ID viaggio non valido.');
      return;
    }

    this.loading.set(true);

    try {
      //const travels = await firstValueFrom(this.travelService.getTravels());
      //const found = travels.find((t) => t.id === id) ?? null;
      const found = await firstValueFrom(this.travelService.getTravelById(id));

      if (!found) {
        this.error.set('Viaggio non trovato.');
        return;
      }

      this.travel.set(found);
    } catch (e) {
      console.error(e);
      this.error.set('Errore durante il caricamento del viaggio.');
    } finally {
      this.loading.set(false);
    }
  }

  async onDelete() {
    const travel = this.travel();
    if (!travel) return;

    const confirm = await Swal.fire({
      title: 'Sei sicuro?',
      text: 'Il viaggio verrà eliminato definitivamente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sì, elimina',
      cancelButtonText: 'Annulla',
    });

    if (!confirm.isConfirmed) return;

    this.loading.set(true);

    try {
      await firstValueFrom(this.travelService.delete(travel.id));

      await Swal.fire({
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
        title: 'Eliminato!',
        text: 'Viaggio rimosso con successo.',
        icon: 'success',
      });

      this.router.navigate(['/visited-travels']);
    } catch (error) {
      console.error('Errore durante l’eliminazione:', error);

      await Swal.fire({
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
        title: 'Errore!',
        text: 'Impossibile eliminare il viaggio.',
        icon: 'error',
      });
    } finally {
      this.loading.set(false);
    }
  }
}
