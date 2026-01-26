import { HttpInterceptorFn } from "@angular/common/http";


export const authInterceptor: HttpInterceptorFn = (req, next) => {
    if (!req.url.startsWith('api')) {
        return next(req);
    }

    const token = localStorage.getItem('accessToken');

    if (token === undefined) {
        return next(req);
    }

    const requisicaoAutorizada = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });

    return next(requisicaoAutorizada);
}