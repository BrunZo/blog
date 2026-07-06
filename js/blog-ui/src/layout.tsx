import Navbar from "@/ui/navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='es'>
      <head>
        <link rel="stylesheet" href="/global.css" />
      </head>
      <body className={'font-serif antialiasing'}>
        <div>
          <Navbar/>
        </div>
        <div className='flex justify-center'>
          <div className='pt-8 px-4 w-full md:w-5/6'>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
