import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../utils/api/api.service';
import { inject } from '@angular/core';

export const guardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const serviceService = inject(ApiService);
  if (serviceService.isLoggedIn()) {
    return true
  } else {
    router.navigate(['/login']);
    return false;
  }


};
