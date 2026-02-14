import { Routes } from '@angular/router';
import { CompetitorComponent } from './layout/competitor/competitor.component';
import { PublicComponent } from './layout/public/public.component';
import { AdminComponent } from './layout/admin/admin.component';
import { competitorGuard } from './core/guards/competitor.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'public/home'
    },
    {
        path: 'public',
        component: PublicComponent,
        children: [
            {
                path: 'home',
                loadComponent: () => import('./pages/home/home.component')
                .then((m) => m.HomeComponent)
            },
            {
                path: 'login',
                loadComponent: () => import('./pages/login/login.component')
                .then((m) => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./pages/register/register.component')
                .then((m) => m.RegisterComponent)
            }
        ]
    },
    {
        path: 'competitor',
        canMatch: [competitorGuard],
        component: CompetitorComponent,
        children: [
            {
                path: 'available-cups',
                loadComponent: () => import('./pages/user/competitor/available-cups/available-cups.component')
                .then((m) => m.AvailableCupsComponent)
            },
            {
                path: 'available-cups/:id',
                loadComponent: () => import('./pages/user/competitor/available-cups-detail/available-cups-detail.component')
                .then((m) => m.AvailableCupsDetailComponent)
            },
            {
                path: 'my-team',
                loadComponent: () => import('./pages/user/competitor/my-team/my-team.component')
                .then((m) => m.MyTeamComponent)
            },
            {
                path: 'my-team-edit',
                loadComponent: () => import('./pages/user/competitor/my-team-edit/my-team-edit.component')
                .then((m) => m.MyTeamEditComponent)
            },
            {
                path: 'my-account',
                loadComponent: () => import('./pages/user/competitor/my-account/my-account.component')
                .then((m) => m.MyAccountComponent)
            }
        ]
    },
    {
        path: 'admin',
        canMatch: [adminGuard],
        component: AdminComponent,
        children: [
            {
                path: 'cups',
                loadComponent: () => import('./pages/user/admin/cups/cups.component')
                .then((m) => m.CupsComponent)
            },
            {
                path: 'cups/:id',
                loadComponent: () => import('./pages/user/admin/cup-edit/cup-edit.component')
                .then((m) => m.CupEditComponent)
            },
            {
                path: 'cup-register',
                loadComponent: () => import('./pages/user/admin/cup-register/cup-register.component')
                .then((m) => m.CupRegisterComponent)
            },
            {
                path: 'submit-results',
                loadComponent: () => import('./pages/user/admin/submit-results/submit-results.component')
                .then((m) => m.SubmitResultsComponent)
            }
        ]
    }
];
