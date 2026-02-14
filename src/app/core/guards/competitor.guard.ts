import { inject } from "@angular/core";
import { CanMatchFn, Router } from "@angular/router";

export const competitorGuard: CanMatchFn = () => {
    const router = inject(Router);
    const perfil = localStorage.getItem('perfil');

    if (perfil !== null && perfil === 'competidor') {
        return true;
    }

    return router.createUrlTree(['/public/home'])

}