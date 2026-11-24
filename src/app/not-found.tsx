import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex flex-col items-center py-24 text-center">
      <p className="text-6xl font-extrabold text-brand-500">404</p>
      <h1 className="mt-4 text-2xl font-extrabold">This page went shopping</h1>
      <p className="mt-2 text-stone-500">We could not find what you were looking for.</p>
      <Link href="/" className="btn btn-primary mt-8">Back to home</Link>
    </div>
  );
}
