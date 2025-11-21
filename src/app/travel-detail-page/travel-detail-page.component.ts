import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { Travel } from '../shared/models/travel.model';
import { TravelService } from '../shared/service/travel.service';
import { NgClass } from '@angular/common';
import { ToastService } from '../shared/service/toast.service';

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
  private toastService = inject(ToastService);

  travel = signal<Travel | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('travelId');
    this.init(id);
  }

  async init(id: string | null) {
    if (!id) {
      this.error.set('ID viaggio non valido.');
      return;
    }

    this.loading.set(true);

    try {
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
    const confirm = await this.toastService.dialogDeleteElement();

    if (!confirm.isConfirmed) return;

    this.loading.set(true);

    try {
      await firstValueFrom(this.travelService.delete(travel.id));
      this.toastService.showToastSuccess('Viaggio rimosso con successo.');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Errore durante l’eliminazione:', error);
      this.toastService.dialogDeleteElement();
    } finally {
      this.loading.set(false);
    }
  }
}
