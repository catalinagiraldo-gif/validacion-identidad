import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';

export const profileGuard: CanActivateFn & CanActivateChildFn = () => {
  const profile = inject(ProfileService);
  const router = inject(Router);

  if (profile.hasProfile) {
    return true;
  }
  return router.createUrlTree(['/profile-select']);
};
