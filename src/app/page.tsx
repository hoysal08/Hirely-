import { redirect } from 'next/navigation';

export default function Home() {
  // With auth removed, send users straight to the dashboard.
  redirect('/dashboard');
}
