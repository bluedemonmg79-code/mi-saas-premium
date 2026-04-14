import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Zap, 
  Shield, 
  Users, 
  Calendar, 
  Globe, 
  CheckCircle, 
  ArrowRight, 
  Mail, 
  MapPin, 
  Phone, 
  Layout, 
  Star,
  Award,
  Sparkles,
  MousePointer2,
  Lock,
  MessageSquare,
  Activity,
  Server
} from 'lucide-react';

// Componente para contadores animados
const Counter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    // Escuchar movimiento del mouse para el efecto glow de las bento cards
    const handleMouseMove = (e) => {
      for (const card of document.getElementsByClassName("bento-card")) {
        const rect = card.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    
    // Revelar elementos al hacer scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="landing-root" style={{ 
      background: '#070a14', color: 'white', minHeight: '100vh', 
      fontFamily: 'Outfit, sans-serif', overflowX: 'hidden'
    }}>
      
      {/* FONDO ANIMADO DE AURA */}
      <div className="aura-bg"></div>

      {/* NAVBAR v3.0 */}
      <nav style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, 
        padding: scrolled ? '0.8rem 2rem' : '1.5rem 2rem', 
        background: scrolled ? 'rgba(7, 10, 20, 0.7)' : 'transparent', 
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'linear-gradient(45deg, #6366f1, #a855f7)', borderRadius: '12px', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
            <Zap size={22} fill="white" />
          </div>
          <span style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-1.5px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ProNexusGlobal
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          {['Funciones', 'Testimonios', 'Precios'].map(item => (
            <a key={item} href={`#${item === 'Funciones' ? 'features' : item.toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.3s' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
              {item}
            </a>
          ))}
          <Link to="/login" style={{ 
            padding: '12px 28px', borderRadius: '14px', background: 'white', color: '#070a14', 
            textDecoration: 'none', fontSize: '0.95rem', fontWeight: 800, transition: 'all 0.4s',
            boxShadow: scrolled ? '0 10px 20px rgba(255,255,255,0.1)' : 'none'
          }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            Entrar
          </Link>
        </div>
      </nav>

      {/* HERO SECTION v3.0 */}
      <section style={{ 
        padding: '200px 20px 100px', textAlign: 'center', 
        position: 'relative', zIndex: 1
      }}>
        <div className="reveal-on-scroll" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid rgba(255, 255, 255, 0.08)', padding: '8px 20px', borderRadius: '30px', 
            marginBottom: '3rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600,
            backdropFilter: 'blur(10px)'
          }}>
            <Sparkles size={16} color="var(--accent-cyan)" /> <span style={{ color: 'white' }}>Nueva v3.0 Élite</span> — Inteligencia de Agenda
          </div>
          
          <h1 style={{ 
            fontSize: 'max(4rem, 7vw)', fontWeight: 950, lineHeight: 0.95, letterSpacing: '-4px', marginBottom: '2.5rem'
          }} className="glow-text">
            Gestiona tu éxito <br/>
            <span style={{ background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Sin límites.
            </span>
          </h1>
          
          <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.5)', maxWidth: '800px', margin: '0 auto 4.5rem', lineHeight: 1.5 }}>
            La plataforma definitiva para profesionales que valoran su tiempo. Agendamiento inteligente, gestión de clientes y marca blanca en una sola suite.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '8rem' }}>
            <Link to="/login" style={{ 
              padding: '20px 50px', background: 'white', color: '#000', borderRadius: '20px', 
              fontSize: '1.2rem', fontWeight: 900, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 20px 50px rgba(99,102,241,0.2)', transition: 'all 0.3s'
            }} className="magnetic-button" onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              Empezar Gratis <ArrowRight size={22} />
            </Link>
            <a href="#features" style={{ 
              padding: '200px 50px', // Corregido el padding accidental de 200px
              padding: '20px 50px', background: 'rgba(255,255,255,0.03)', color: 'white', 
              borderRadius: '20px', fontSize: '1.2rem', fontWeight: 700, textDecoration: 'none', 
              border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s'
            }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>Ver funciones</a>
          </div>

          {/* MOCKUP v3.0 - Visual Showcase */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '-30px', background: 'radial-gradient(circle, #6366f1, transparent 70%)', opacity: 0.2, filter: 'blur(60px)', zIndex: -1 }}></div>
            <div style={{ 
              padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', 
              borderRadius: '35px', boxShadow: '0 50px 100px rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)'
            }}>
              <img src="/pronexus_hero_mockup_1776126850527.png" alt="ProNexus UI" style={{ width: '100%', borderRadius: '25px', display: 'block' }} />
            </div>
            
            {/* Stats Badges Floating */}
            <div style={{ position: 'absolute', top: '15%', right: '-4%', animation: 'float 5s ease-in-out infinite alternate', background: 'rgba(30,41,59,0.8)', padding: '20px 30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(15px)', textAlign: 'left' }}>
              <div style={{ color: 'var(--accent-cyan)', fontSize: '1.8rem', fontWeight: 900 }}><Counter end={500} suffix="+" /></div>
              <div style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Profesionales Activos</div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE TRUST */}
      <div style={{ padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', width: '200%', animation: 'marquee 40s linear infinite', gap: '150px', alignItems: 'center', opacity: 0.25 }}>
          {[1,2,3,4,1,2,3,4].map((_, i) => (
            <div key={i} style={{ fontSize: '1.8rem', fontWeight: 950, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '20px', letterSpacing: '-1px' }}>
              <Activity size={24}/> DENTI-MAX <Server size={24}/> LEGAL-CORE <Users size={24}/> COACH-PRO <Briefcase size={24}/> EXPERT-HUB
            </div>
          ))}
        </div>
      </div>

      {/* BENTO GRID v3.0 */}
      <section id="features" style={{ padding: '140px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal-on-scroll" style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '4rem', fontWeight: 950, letterSpacing: '-3px', marginBottom: '1.5rem' }}>Poder absoluto en <span style={{ color: 'var(--accent-cyan)' }}>tus manos.</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.3rem', maxWidth: '600px', margin: '0 auto' }}>Diseñamos cada función para ahorrarte tiempo y elevar tu marca personal.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: 'minmax(220px, auto)', gap: '25px' }}>
            {/* Bento Principal */}
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 8', gridRow: 'span 2', padding: '3.5rem', borderRadius: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ position: 'absolute', top: '3rem', right: '3rem', color: 'var(--accent-blue)', opacity: 0.15 }}><Sparkles size={160} /></div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Agenda Inteligente 🏛️</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', maxWidth: '450px', lineHeight: 1.6 }}>Tu link público detecta espacios libres y bloquea choques automáticamente. <br/><strong>Ahorra hasta <Counter end={10} suffix=" horas" /> a la semana.</strong></p>
            </div>
            {/* White Label Box */}
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 4', gridRow: 'span 2', padding: '3rem', borderRadius: '40px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), transparent)' }}>
              <Layout size={50} color="var(--accent-purple)" style={{ marginBottom: '2rem' }}/>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.2rem' }}>Marca Blanca Pro</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>No es nuestro software, es el tuyo. Personaliza logo y colores para una identidad propia de alto nivel.</p>
            </div>
            {/* Stats Items */}
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 4', padding: '2.5rem', borderRadius: '40px' }}>
              <Activity size={32} color="#10b981" style={{ marginBottom: '1rem' }}/>
              <div style={{ fontSize: '2rem', fontWeight: 900 }}><Counter end={99} suffix="%" /></div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Uptime Garantizado</div>
            </div>
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 4', padding: '2.5rem', borderRadius: '40px' }}>
              <Shield size={32} color="#6366f1" style={{ marginBottom: '1rem' }}/>
              <div style={{ fontSize: '2rem', fontWeight: 900 }}>AES-256</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Cifrado Bancario</div>
            </div>
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 4', padding: '2.5rem', borderRadius: '40px' }}>
              <Users size={32} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }}/>
              <div style={{ fontSize: '2rem', fontWeight: 900 }}><Counter end={100} suffix="K+" /></div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Citas Procesadas</div>
            </div>
          </div>
        </div>
      </section>

      {/* SEGURIDAD & CONFIANZA SECTION */}
      <section style={{ padding: '80px 20px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <Lock size={40} color="#10b981" />
             <div>
               <div style={{ fontWeight: 900, fontSize: '1.2rem' }}>Privacidad Total</div>
               <div style={{ opacity: 0.5, fontSize: '0.9rem' }}>Cumplimiento con Ley de Datos</div>
             </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <Shield size={40} color="var(--accent-purple)" />
             <div>
               <div style={{ fontWeight: 900, fontSize: '1.2rem' }}>Pago Seguro</div>
               <div style={{ opacity: 0.5, fontSize: '0.9rem' }}>Procesado por Stripe 3D Secure</div>
             </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <Zap size={40} color="var(--accent-cyan)" />
             <div>
               <div style={{ fontWeight: 900, fontSize: '1.2rem' }}>Ultra Veloz</div>
               <div style={{ opacity: 0.5, fontSize: '0.9rem' }}>Infraestructura en la Nube AWS</div>
             </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS v3.0 */}
      <section id="testimonios" style={{ padding: '120px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal-on-scroll" style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 950, marginBottom: '1.2rem' }}>Líderes que confían en <span style={{ color: '#10b981' }}>nosotros.</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
            {[
              { author: "Dr. Roberto M.", role: "Clínica Dental Premium", text: "ProNexusGlobal eliminó el caos de mi recepción. Mis ingresos crecieron 30% gracias al agendamiento automático." },
              { author: "Lic. Andrea Ruiz", role: "Socia en Bufete Jurídico", text: "La estética de la plataforma es impecable. Mis clientes notan la diferencia en profesionalismo desde la primera cita." },
              { author: "Coach Julián T.", role: "CEO High Performance", text: "Es la herramienta más potente que he usado para escalar mi práctica. Los recordatorios de WhatsApp son clave." }
            ].map((t, i) => (
              <div key={i} className="reveal-on-scroll" style={{ padding: '3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '35px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-20px', left: '3rem', background: 'linear-gradient(45deg, #6366f1, #a855f7)', padding: '12px', borderRadius: '15px' }}><Star size={20} fill="white" /></div>
                <p style={{ fontSize: '1.2rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem' }}>"{t.text}"</p>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '20px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900 }}>{t.author[0]}</div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{t.author}</div>
                    <div style={{ opacity: 0.5, fontSize: '0.85rem', fontWeight: 600 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TABLE */}
      <section id="precios" style={{ padding: '120px 20px', background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.05), transparent 70%)' }}>
        <div className="reveal-on-scroll" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '4rem', fontWeight: 950, marginBottom: '5rem', letterSpacing: '-3px' }}>Da el paso a la <span style={{ color: 'var(--accent-purple)' }}>grandeza.</span></h2>
          <div style={{ background: 'rgba(7, 10, 20, 0.4)', padding: '2rem', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(30px)' }}>
            <stripe-pricing-table
              pricing-table-id="prctbl_1TKmNeRzHRtT8e1b7CUMp6tx"
              publishable-key="pk_test_51TKlBcRzHRtT8e1byh4GMNN27g3iPpEX4MD6gIUFWCYEH7CkYQhQYQVYJcNno1M5FGWXIjJx5UsvWCIQj5dOPDCk00xMl03wSR"
            ></stripe-pricing-table>
          </div>
        </div>
      </section>

      {/* FOOTER v3.0 */}
      <footer style={{ padding: '120px 20px 60px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#03050a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '6rem', marginBottom: '6rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                <Zap size={30} color="#6366f1" fill="#6366f1" />
                <span style={{ fontSize: '1.8rem', fontWeight: 950 }}>ProNexusGlobal</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.3)', lineHeight: 1.8, fontSize: '1.1rem' }}>Elevando el estándar de la gestión profesional a nivel mundial. Inteligencia, diseño y seguridad.</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Compañía</h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Sobre Nosotros</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contacto</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Soporte</a>
              </nav>
            </div>
            <div>
              <h4 style={{ marginBottom: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Newsletter</h4>
              <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Recibe tips de gestión y actualizaciones semanales.</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="email" placeholder="Email" style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '14px', color: 'white', fontWeight: 600 }} />
                <button style={{ background: 'white', color: 'black', borderRadius: '15px', padding: '0 25px', fontWeight: 900, border: 'none', cursor: 'pointer' }}>OK</button>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.1)', fontSize: '0.9rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            © {new Date().getFullYear()} ProNexusGlobal. Todas las marcas registradas. Proceso de calidad certificado.
          </div>
        </div>
      </footer>
      
      <style>{`
        .nav-links a:hover { color: white !important; }
        html { scroll-behavior: smooth; }
        @media (max-width: 1024px) {
          .nav-links { display: none !important; }
        }
      `}</style>

    </div>
  );
};

// Icono faltante
const Briefcase = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

export default LandingPage;
