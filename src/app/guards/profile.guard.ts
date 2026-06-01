import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';

export const profileGuard: CanActivateFn & CanActivateChildFn = () => {
  const profile = inject(ProfileService);
  const router = inject(Router);

  if (profile.hasProfile) {
    return true;
  }
  const arch = localStorage.getItem('dropi.selectedArch') || 'old';
  return router.createUrlTree(['/' + arch + '/profile-select']);
};
