import Navbar from "@/ui/navbar";
import "@/ui/global.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='es'>
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
