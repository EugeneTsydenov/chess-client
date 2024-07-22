import { http } from '@shared/lib';

const test = async () => {
  const res = await http.get<{ displayName: string }>({ url: '/users/4' });
  console.log(res.data.displayName);
};

export default async function Home() {
  await test();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      next
    </main>
  );
}
