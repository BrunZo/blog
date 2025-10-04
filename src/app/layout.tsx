import '@/ui/global.css';
import { inter } from '@/ui/fonts';
import Navbar from "@/ui/navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='es'>
      <body className={`${inter.className} antialiasing`}>
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