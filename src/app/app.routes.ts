import { Routes } from '@angular/router';
import { CompetitorComponent } from './layout/competitor/competitor.component';
import { PublicComponent } from './layout/public/public.component';

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
                path: 'my-team-detail',
                loadComponent: () => import('./pages/user/competitor/my-team-detail/my-team-detail.component')
                .then((m) => m.MyTeamDetailComponent)
            },
            {
                path: 'my-account',
                loadComponent: () => import('./pages/user/competitor/my-account/my-account.component')
                .then((m) => m.MyAccountComponent)
            }
        ]
    }
];
