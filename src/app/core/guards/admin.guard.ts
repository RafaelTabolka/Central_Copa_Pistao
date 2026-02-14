import { inject } from "@angular/core";
import { CanMatchFn, Router } from "@angular/router";

export const adminGuard: CanMatchFn = () => {
    const router = inject(Router);
    const perfil = localStorage.getItem('perfil');

    if (perfil !== null && perfil === 'admin') {
        return true;
    }

    return router.createUrlTree(['/public/home'])

}