import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('jwt');
  let request;
  if (token) {
    request = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(request);
  }
  return next(req);
};
