export default defineNuxtRouteMiddleware((to) => {
  const tokenCookie = useCookie<string | null>('susi_air_token');
  const token = tokenCookie.value;

  const isLoginPage = to.path === '/login';

  if (!token && !isLoginPage) {
    return navigateTo('/login');
  }

  if (token && isLoginPage) {
    return navigateTo('/');
  }
});
