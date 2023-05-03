import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-bg-light text-text-light dark:bg-bg-dark dark:text-text-dark font-rubik">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
