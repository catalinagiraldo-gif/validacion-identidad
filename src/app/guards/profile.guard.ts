import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn } from '@angular/router';
import { ProfileService } from '../services/profile.service';

export const profileGuard: CanActivateFn & CanActivateChildFn = () => {
  inject(ProfileService).ensureDefaultProfile();
  return true;
};
