'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Mic,
  Square,
  Clock,
  Star,
  ChevronRight,
  Sparkles,
  Shield,
  Heart,
  Smile,
  Menu,
  X,
  MessageCircle
} from 'lucide-react';
import Image from 'next/image';
import Vapi from '@vapi-ai/web';
import AppointmentModal from './components/AppointmentModal';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [callStatus, setCallStatus] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '';
  const vapiAssistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!vapiPublicKey) {
      console.error('VAPI Public Key not configured in .env');
      return;
    }
    
    const vapiInstance = new Vapi(vapiPublicKey);
    setVapi(vapiInstance);

    vapiInstance.on('call-start', () => {
      setCallStatus('Bağlanıyor...');
      setIsCallActive(true);
    });

    vapiInstance.on('call-end', () => {
      setCallStatus('');
      setIsCallActive(false);
    });

    vapiInstance.on('speech-start', () => {
      setCallStatus('Asistan konuşuyor...');
    });

    vapiInstance.on('speech-end', () => {
      setCallStatus('Dinleniyor...');
    });

    vapiInstance.on('error', (error) => {
      console.error('Vapi error:', error);
      setCallStatus('Hata oluştu!');
      setIsCallActive(false);
    });

    return () => {
      if (vapiInstance) {
        vapiInstance.stop();
      }
    };
  }, [vapiPublicKey]);

  const handleMicClick = async () => {
    if (!vapi) return;

    if (!vapiAssistantId) {
      setCallStatus('Asistan yapılandırılmamış!');
      return;
    }

    if (isCallActive) {
      vapi.stop();
      setIsCallActive(false);
      setCallStatus('');
    } else {
      try {
        setCallStatus('Başlatılıyor...');
        await vapi.start(vapiAssistantId);
      } catch (error) {
        console.error('Failed to start call:', error);
        setCallStatus('Başlatılamadı!');
        setIsCallActive(false);
      }
    }
  };

  const services = [
    {
      title: 'İmplant Tedavisi',
      description: 'Eksik dişleriniz için kalıcı ve doğal görünümlü çözümler',
      icon: '🦷',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Diş Beyazlatma',
      description: 'Profesyonel beyazlatma ile ışıldayan gülüşler',
      icon: '✨',
      color: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Ortodonti',
      description: 'Şeffaf plak ve tel tedavisi ile düzgün dişler',
      icon: '😁',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Kanal Tedavisi',
      description: 'Ağrısız ve konforlu kanal tedavisi uygulamaları',
      icon: '💉',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Zirkonyum Kaplama',
      description: 'Dayanıklı ve estetik diş kaplamaları',
      icon: '💎',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      title: 'Çocuk Diş Hekimliği',
      description: 'Çocuklarınız için özel ve şefkatli bakım',
      icon: '👶',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const doctors = [
    {
      name: 'Dr. Can Yılmaz',
      specialty: 'Pedodonti (Çocuk Diş Hekimi)',
      experience: '12 Yıl Deneyim',
      image: '/can-yilmaz.jpg',
      description: 'Çocuk hastalarımıza özel, korku ve kaygı giderici yaklaşımlarla tedavi uygular.'
    },
    {
      name: 'Dr. Elif Demir',
      specialty: 'Ortodonti Uzmanı',
      experience: '10 Yıl Deneyim',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      description: 'Şeffaf plak ve tel tedavisi konusunda uzmanlaşmış, estetik gülüş tasarımcısı.'
    },
    {
      name: 'Dr. Mehmet Öz',
      specialty: 'Endodonti & Genel Tedavi',
      experience: '15 Yıl Deneyim',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
      description: 'Kanal tedavisi ve ağrı yönetimi konusunda deneyimli uzman hekim.'
    }
  ];

  const stats = [
    { number: '15K+', label: 'Mutlu Hasta' },
    { number: '12+', label: 'Yıllık Deneyim' },
    { number: '98%', label: 'Memnuniyet' },
    { number: '24/7', label: 'Acil Destek' }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a 
              href="#"
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🦷</span>
              </div>
              <span className={`text-2xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                Dentist<span className="text-blue-500">.</span>
              </span>
            </motion.a>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {[
                { name: 'Ana Sayfa', href: '#hero' },
                { name: 'Hizmetler', href: '#hizmetler' },
                { name: 'Hekimler', href: '#hekimler' },
                { name: 'Hakkımızda', href: '#hakkimizda' },
                { name: 'İletişim', href: '#iletisim' }
              ].map((item) => (
                <a 
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors hover:text-blue-500 ${
                    scrolled ? 'text-gray-700' : 'text-white/90'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <a 
                href="tel:02125555555" 
                className={`flex items-center space-x-2 font-medium ${
                  scrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>0212 555 55 55</span>
              </a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAppointmentModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
              >
                Randevu Al
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className={scrolled ? 'text-gray-900' : 'text-white'} />
              ) : (
                <Menu className={scrolled ? 'text-gray-900' : 'text-white'} />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-4 pb-4"
              >
                <div className="flex flex-col space-y-4 bg-white rounded-2xl p-6 shadow-xl">
                  {[
                    { name: 'Ana Sayfa', href: '#hero' },
                    { name: 'Hizmetler', href: '#hizmetler' },
                    { name: 'Hekimler', href: '#hekimler' },
                    { name: 'Hakkımızda', href: '#hakkimizda' },
                    { name: 'İletişim', href: '#iletisim' }
                  ].map((item) => (
                    <a 
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 font-medium hover:text-blue-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                  <button
                    onClick={() => {
                      setIsAppointmentModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold"
                  >
                    Randevu Al
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-blue-900/60" />
        </div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl"
        />

        <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-white/90 text-sm font-medium">İlk Muayene Ücretsiz</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Sağlıklı Gülüşler,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Mutlu Yaşamlar
                </span>
              </h1>
              
              <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-xl">
                Modern teknoloji ve uzman kadromuzla, ağız ve diş sağlığınız için en iyi hizmeti sunuyoruz. 
                <span className="text-cyan-400 font-semibold"> Yapay zeka asistanımızla</span> hemen randevu alın!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAppointmentModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2"
                >
                  <span>Randevu Al</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMicClick}
                  className={`${
                    isCallActive 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-white/10 backdrop-blur-sm hover:bg-white/20'
                  } text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 flex items-center justify-center space-x-2 transition-colors`}
                >
                  {isCallActive ? (
                    <>
                      <Square className="w-5 h-5 fill-white" />
                      <span>Aramayı Bitir</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      <span>Sesli Asistan</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-white">{stat.number}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-30" />
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                  <Image
                    src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80"
                    alt="Dental Care"
                    width={500}
                    height={600}
                    className="rounded-2xl shadow-2xl"
                  />
                  
                  {/* Floating Card */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -left-8 bottom-20 bg-white rounded-2xl p-4 shadow-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Güvenli Tedavi</div>
                        <div className="text-sm text-gray-500">Steril ortam garantisi</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Rating Card */}
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -right-8 top-20 bg-white rounded-2xl p-4 shadow-xl"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">4.9/5 (2,847 değerlendirme)</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section id="hizmetler" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Hizmetlerimiz</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Sunduğumuz Tedaviler
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              En son teknoloji ve uzman kadromuzla tüm diş sağlığı ihtiyaçlarınız için yanınızdayız
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {service.description}
                </p>
                <a href="#" className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                  Detaylı Bilgi
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="hakkimizda" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Neden Biz?</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">
                Farkımız Nedir?
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Yılların deneyimi, modern teknoloji ve hasta odaklı yaklaşımımızla fark yaratıyoruz.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Shield, title: 'Güvenli & Steril', desc: 'En yüksek hijyen standartları' },
                  { icon: Heart, title: 'Hasta Odaklı', desc: 'Konforunuz önceliğimiz' },
                  { icon: Smile, title: 'Ağrısız Tedavi', desc: 'Modern anestezi teknikleri' },
                  { icon: Clock, title: '7/24 Acil', desc: 'Her zaman yanınızdayız' }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80"
                  alt="Modern Klinik"
                  width={600}
                  height={500}
                  className="rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl">
                  <div className="text-4xl font-bold text-blue-600">12+</div>
                  <div className="text-gray-600">Yıllık Deneyim</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="hekimler" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Uzman Kadromuz</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Hekimlerimiz
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Alanında uzman, deneyimli ve güler yüzlü hekim kadromuzla tanışın
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-3xl mb-6">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={400}
                    height={500}
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                      <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                      <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 px-2">{doctor.description}</p>
                <div className="flex items-center space-x-2 mt-3 px-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{doctor.experience}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Sağlıklı Gülüşünüz İçin İlk Adımı Atın
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Ücretsiz ön muayene için hemen randevu alın. Yapay zeka asistanımız 7/24 hizmetinizde!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAppointmentModalOpen(true)}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Online Randevu Al
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMicClick}
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-lg border-2 border-white/30 flex items-center justify-center space-x-2"
              >
                <Mic className="w-5 h-5" />
                <span>Sesli Randevu</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="iletisim" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">İletişim</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">
                Bize Ulaşın
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Sorularınız için bize ulaşın, size yardımcı olmaktan mutluluk duyarız.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Adres</h3>
                    <p className="text-gray-600">Bağdat Caddesi No:123, Kadıköy, İstanbul</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Telefon</h3>
                    <p className="text-gray-600">0212 555 55 55</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Email</h3>
                    <p className="text-gray-600">info@dentist.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Çalışma Saatleri</h3>
                    <p className="text-gray-600">Pazartesi - Cumartesi: 09:00 - 17:30</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=800&q=80"
                alt="Klinik"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🦷</span>
                </div>
                <span className="text-2xl font-bold">Dentist<span className="text-blue-500">.</span></span>
              </div>
              <p className="text-gray-400">
                Modern diş hekimliği hizmetleri ile sağlıklı gülüşler için yanınızdayız.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Hızlı Linkler</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#hero" className="hover:text-white transition-colors">Ana Sayfa</a></li>
                <li><a href="#hizmetler" className="hover:text-white transition-colors">Hizmetler</a></li>
                <li><a href="#hekimler" className="hover:text-white transition-colors">Hekimler</a></li>
                <li><a href="#iletisim" className="hover:text-white transition-colors">İletişim</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Hizmetler</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">İmplant</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ortodonti</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Diş Beyazlatma</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kanal Tedavisi</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">İletişim</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Bağdat Cad. No:123</li>
                <li>Kadıköy, İstanbul</li>
                <li>0212 555 55 55</li>
                <li>info@dentist.com</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© 2026 Dentist. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3"
      >
        <AnimatePresence>
          {callStatus && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              className="bg-gray-900 text-white text-sm px-4 py-2 rounded-xl shadow-lg"
            >
              {callStatus}
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          onClick={handleMicClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`relative w-16 h-16 ${
            isCallActive 
              ? 'bg-gradient-to-r from-red-500 to-red-600' 
              : 'bg-gradient-to-r from-blue-600 to-cyan-500'
          } rounded-full shadow-2xl flex items-center justify-center group`}
        >
          <motion.div
            className={`absolute inset-0 rounded-full ${
              isCallActive ? 'bg-red-500' : 'bg-blue-500'
            }`}
            animate={{
              scale: [1, 1.4, 1.4],
              opacity: [0.5, 0, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
          
          {isCallActive ? (
            <Square className="w-6 h-6 text-white z-10 fill-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white z-10" />
          )}
          
          <div className="absolute right-full mr-4 px-4 py-2 bg-gray-900 text-white text-sm rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            {isCallActive ? 'Aramayı Bitir' : 'AI Asistan'}
          </div>
        </motion.button>
      </motion.div>

      {/* Appointment Modal */}
      <AppointmentModal 
        isOpen={isAppointmentModalOpen} 
        onClose={() => setIsAppointmentModalOpen(false)} 
      />
    </div>
  );
}
