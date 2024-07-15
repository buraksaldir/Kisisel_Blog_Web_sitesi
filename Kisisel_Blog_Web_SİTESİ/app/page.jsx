import Image from "next/image";
import burak from '@/public/img/burak.jpg';
import proje from '@/public/img/blog_img_1.jpg';
import { FaTwitter, FaLinkedin, FaGithub, FaFacebook, FaTiktok } from 'react-icons/fa';

const projects = [
  { id: 1, image: proje, title: 'Mobil Programlama Restoran Uygulaması', description: 'Mobil Programlama Restoran Uygulaması' },
  { id: 2, image: proje, title: 'Restoran Rezervasyon Uygulaması MasaRahat', description: 'Restoran Rezervasyon Uygulaması MasaRahat' },
  { id: 3, image: proje, title: 'Hırdavat Kiralama', description: 'Hırdavat Kiralama' },
  { id: 4, image: proje, title: 'Mobil Programlama Restoran Uygulaması', description: 'Başka bir proje 4 açıklaması' },
  { id: 5, image: proje, title: 'Restoran Rezervasyon Uygulaması MasaRahat', description: 'Başka bir proje 5 açıklaması' },
  { id: 6, image: proje, title: 'Hırdavat Kiralama', description: 'Başka bir proje 6 açıklaması' },
  { id: 7, image: proje, title: 'Mobil Programlama Restoran Uygulaması', description: 'Başka bir proje 7 açıklaması' },
  { id: 8, image: proje, title: 'Restoran Rezervasyon Uygulaması MasaRahat', description: 'Başka bir proje 8 açıklaması' },
  { id: 9, image: proje, title: 'Hırdavat Kiralama', description: 'Başka bir proje 9 açıklaması' },
];

export default function Home() {
  return (
    <div className="container mx-auto p-5 space-y-10">
      
      {/* Giriş (Introduction) */}
      <section className="flex flex-col md:flex-row gap-5 h-[calc(100vh-4rem)]">
        <div className="basis-full flex flex-col justify-center md:basis-2/3">
          <p className="special-word text-xs">Kişisel Blog Web Sitesi</p>
          <h1 className="pb-5 text-4xl font-bold">
            BURAK <span className="special-word">SALDIR</span><br />
          </h1>
          <p className="text-lg mb-5">
            İş sorunlarını çözüyoruz, her müşteri katılımında danışmanlık 
            yaklaşımını benimsiyoruz ve kuruluşunuzun en iyi iş sonuçlarına
            yardımcı olacak uygulanabilir çözümler buluyoruz.
            İş sorunlarını çözüyoruz, her müşteri katılımında danışmanlık
            yaklaşımını benimsiyoruz ve kuruluşunuzun en iyi iş
            sonuçlarına ulaşmasına yardımcı olacak uygulanabilir
            çözümler buluyoruz.
          </p>
        </div>
        <div className="hidden md:flex basis-1/3 justify-center items-center">
          <div className="relative w-full h-full">
            <Image 
              src={burak}
              alt="burak"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </section>

      {/* Hakkında (About) */}
      <section className="my-5">
        <h2 className="text-3xl font-semibold mb-3">Hakkımda</h2>
        <p className="text-lg">
          Ben Burak Saldır, yazılım geliştiricisi ve teknoloji meraklısıyım. 
          İş sorunlarını çözmek ve her müşteri etkileşiminde danışmanlık yaklaşımı 
          benimsemek benim için önemlidir. Müşterilerimize en iyi iş sonuçlarını 
          sağlamak için uygulanabilir çözümler sunuyorum.
        </p>
      </section>

      {/* Projeler (Projects) */}
      <section className="my-5">
        <h2 className="text-3xl font-semibold mb-3">Projeler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div key={project.id} className="border rounded-lg overflow-hidden shadow-md">
              <Image 
                src={project.image}
                alt={project.title}
                width={300}
                height={300}
                className="w-full h-auto"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-sm">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    

      {/* İletişim (Contact) */}
        <section className="my-5">
          <h2 className="text-3xl font-semibold mb-3">İletişim</h2>
          <p className="text-lg mb-5">Bana ulaşmak için aşağıdaki sosyal medya hesaplarımı kullanabilirsiniz:</p>
          <div className="flex gap-3">
            <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-2xl" />
            </a>
            <a href="https://facebook.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-2xl" />
            </a>
            <a href="https://tiktok.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <FaTiktok className="text-2xl" />
            </a>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-2xl" />
            </a>
            <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <FaGithub className="text-2xl" />
            </a>
          </div>
        </section>
      </div>
    );
  }