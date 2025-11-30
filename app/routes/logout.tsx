import { logout } from '~/services/auth.server';
export async function action({ request }: any) {
  return logout(request);
}