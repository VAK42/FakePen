import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./styles/global.css";
export const links: any = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous", },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap", },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }
];
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="FakePen - Connect With People & Share Your Thoughts" />
        <meta property="og:title" content="FakePen" />
        <meta property="og:description" content="Connect With People & Share Your Thoughts" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FakePen" />
        <meta name="twitter:description" content="Connect With People & Share Your Thoughts" />
        <title>FakePen</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
export default function App() {
  return <Outlet />;
}
export function ErrorBoundary({ error }: any) {
  let message = "Oops!";
  let details = "An Unexpected Error Occurred!";
  let stack: string | undefined;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The Requested Page Could Not Be Found!" : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-2">{message}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">{details}</p>
        </div>
        {stack && (
          <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded overflow-x-auto text-sm">
            <code>{stack}</code>
          </pre>
        )}
        <a href="/" className="mt-6 block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
          Go Home
        </a>
      </div>
    </main>
  )
}