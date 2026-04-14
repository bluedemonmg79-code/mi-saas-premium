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
  Server,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Briefcase
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

// COMPONENTE DE TARJETA DE PRECIO CUSTOM
const PricingCard = ({ title, price, description, features, accent, highlighted, buttonText, waMessage }) => {
  const whatsappNumber = "525512345678"; // Número de placeholder
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="bento-card reveal-on-scroll" style={{ 
      gridColumn: highlighted ? 'span 6' : 'span 3',
      padding: '3.5rem 2.5rem',
      borderRadius: '40px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      background: highlighted ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
      border: highlighted ? `1px solid ${accent}` : '1px solid rgba(255,255,255,0.05)',
      transform: highlighted ? 'scale(1.02)' : 'scale(1)',
      zIndex: highlighted ? 2 : 1
    }}>
      {highlighted && (
        <div style={{ 
          position: 'absolute', top: '-15px', right: '2rem', background: accent, 
          padding: '6px 16px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 900,
          boxShadow: `0 0 20px ${accent}`
        }}>
          POPULAR
        </div>
      )}
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 950, marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>{description}</p>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '3rem', fontWeight: 950 }}>MX${price}</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>/mes</span>
        </div>
      </div>

      <div style={{ flex: 1, marginBottom: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>
              <CheckCircle size={18} color={accent} />
              {f}
            </div>
          ))}
        </div>
      </div>

      <a 
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ 
          padding: '18px', background: highlighted ? accent : 'white', 
          color: highlighted ? 'white' : 'black',
          borderRadius: '16px', textAlign: 'center', textDecoration: 'none',
          fontWeight: 900, fontSize: '1rem', transition: 'all 0.3s',
          boxShadow: highlighted ? `0 15px 30px -10px ${accent}` : 'none'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {buttonText}
      </a>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
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
      
      <div className="aura-bg"></div>

      {/* NAVBAR */}
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
            <a key={item} href={`#${item === 'Funciones' ? 'features' : item.toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.3s' }}>
              {item}
            </a>
          ))}
          <Link to="/login" style={{ 
            padding: '12px 28px', borderRadius: '14px', background: 'white', color: '#070a14', 
            textDecoration: 'none', fontSize: '0.95rem', fontWeight: 800
          }}>
            Entrar
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{ padding: '200px 20px 100px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="reveal-on-scroll" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid rgba(255, 255, 255, 0.08)', padding: '8px 20px', borderRadius: '30px', 
            marginBottom: '3rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600
          }}>
            <Sparkles size={16} color="var(--accent-cyan)" /> <span style={{ color: 'white' }}>Lanzamiento Oficial</span> — Elite v4.0
          </div>
          
          <h1 style={{ fontSize: 'max(4rem, 7vw)', fontWeight: 950, lineHeight: 0.95, letterSpacing: '-4px', marginBottom: '2.5rem' }} className="glow-text">
            Gestiona tu éxito <br/>
            <span style={{ background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Sin límites.
            </span>
          </h1>
          
          <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.5)', maxWidth: '800px', margin: '0 auto 4.5rem', lineHeight: 1.5 }}>
            La plataforma definitiva para profesionales de élite. Agendamiento inteligente, gestión de clientes y marca blanca total.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '8rem' }}>
            <Link to="/login" style={{ 
              padding: '20px 50px', background: 'white', color: '#000', borderRadius: '20px', 
              fontSize: '1.2rem', fontWeight: 900, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              Empezar Gratis <ArrowRight size={22} />
            </Link>
            <a href="#features" style={{ 
              padding: '20px 50px', background: 'rgba(255,255,255,0.03)', color: 'white', 
              borderRadius: '20px', fontSize: '1.2rem', fontWeight: 700, textDecoration: 'none', 
              border: '1px solid rgba(255,255,255,0.1)'
            }}>Ver funciones</a>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '-30px', background: 'radial-gradient(circle, #6366f1, transparent 70%)', opacity: 0.2, filter: 'blur(60px)', zIndex: -1 }}></div>
            <div style={{ 
              padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', 
              borderRadius: '35px', boxShadow: '0 50px 100px rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)'
            }}>
              <img src="/pronexus_hero_mockup_1776126850527.png" alt="ProNexus UI" style={{ width: '100%', borderRadius: '25px', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', width: '200%', animation: 'marquee 40s linear infinite', gap: '150px', alignItems: 'center', opacity: 0.25 }}>
          {[1,2,3,4,1,2,3,4].map((_, i) => (
            <div key={i} style={{ fontSize: '1.8rem', fontWeight: 950, display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Activity size={24}/> DENTI-MAX <Server size={24}/> LEGAL-CORE <Users size={24}/> COACH-PRO <Briefcase size={24}/> EXPERT-HUB
            </div>
          ))}
        </div>
      </div>

      {/* BENTO GRID */}
      <section id="features" style={{ padding: '140px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal-on-scroll" style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '4rem', fontWeight: 950, letterSpacing: '-3px', marginBottom: '1.5rem' }}>Poder absoluto en <span style={{ color: 'var(--accent-cyan)' }}>tus manos.</span></h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: 'minmax(220px, auto)', gap: '25px' }}>
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 8', gridRow: 'span 2', padding: '3.5rem', borderRadius: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Agenda Inteligente 🏛️</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', maxWidth: '450px' }}>Tu link público detecta espacios libres y bloquea choques automáticamente. Ahorra hasta <Counter end={10} suffix=" horas" /> a la semana.</p>
            </div>
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 4', gridRow: 'span 2', padding: '3rem', borderRadius: '40px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), transparent)' }}>
              <Layout size={50} color="var(--accent-purple)" style={{ marginBottom: '2rem' }}/>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.2rem' }}>Marca Blanca Pro</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>Personaliza logo y colores para una identidad propia de alto nivel.</p>
            </div>
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 4', padding: '2.5rem', borderRadius: '40px' }}>
              <Activity size={32} color="#10b981" style={{ marginBottom: '1rem' }}/>
              <div style={{ fontSize: '2rem', fontWeight: 900 }}><Counter end={99} suffix="%" /></div>
              <div style={{ color: 'rgba(255,255,255,0.4)' }}>Uptime Garantizado</div>
            </div>
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 4', padding: '2.5rem', borderRadius: '40px' }}>
              <Shield size={32} color="#6366f1" style={{ marginBottom: '1rem' }}/>
              <div style={{ fontSize: '2rem', fontWeight: 900 }}>AES-256</div>
              <div style={{ color: 'rgba(255,255,255,0.4)' }}>Cifrado Bancario</div>
            </div>
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 4', padding: '2.5rem', borderRadius: '40px' }}>
              <Users size={32} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }}/>
              <div style={{ fontSize: '2rem', fontWeight: 900 }}><Counter end={100} suffix="K+" /></div>
              <div style={{ color: 'rgba(255,255,255,0.4)' }}>Citas Procesadas</div>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM PRICING SECTION - REPLACING STRIPE TABLE */}
      <section id="precios" style={{ padding: '140px 20px', background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.08), transparent 70%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal-on-scroll" style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '4rem', fontWeight: 950, letterSpacing: '-px', marginBottom: '1.5rem' }}>Elegancia en <span style={{ color: 'var(--accent-purple)' }}>cada plan.</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.3rem' }}>Sin sorpresas. Solo el poder que necesitas.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '30px', alignItems: 'center' }}>
            <PricingCard 
              title="Plan Básico"
              price="299"
              description="Ideal para profesionistas independientes."
              accent="var(--accent-cyan)"
              highlighted={false}
              buttonText="Activar Básico"
              waMessage="Hola, me interesa activar el Plan Básico de ProNexusGlobal para mi negocio."
              features={[
                "Hasta 50 clientes",
                "Agenda de citas web",
                "Panel de estadísticas básico",
                "Soporte por correo electrónico",
                "Marca blanca parcial"
              ]}
            />
            
            <PricingCard 
              title="Plan Pro"
              price="599"
              description="Para expertos que no aceptan límites."
              accent="var(--accent-purple)"
              highlighted={true}
              buttonText="¡Activar Pro Ahora!"
              waMessage="Hola, me interesa activar el Plan Pro Élite de ProNexusGlobal. Quiero todas las funciones sin límites."
              features={[
                "Clientes ilimitados",
                "Agenda avanzada 'Modo Dios'",
                "Reportes de ingresos pro",
                "Múltiples sucursales",
                "Soporte prioritario 24/7",
                "Marca blanca TOTAL"
              ]}
            />
          </div>
        </div>
      </section>

      {/* FOOTER v4.0 */}
      <footer style={{ padding: '120px 20px 60px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#03050a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '4rem', marginBottom: '6rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                <Zap size={30} color="#6366f1" fill="#6366f1" />
                <span style={{ fontSize: '1.8rem', fontWeight: 950 }}>ProNexusGlobal</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.3)', lineHeight: 1.8 }}>Elevando el estándar de la gestión profesional a nivel mundial. Inteligencia, diseño y seguridad.</p>
              
              {/* SOCIAL ICONS */}
              <div style={{ display: 'flex', gap: '15px', marginTop: '2.5rem' }}>
                <a href="#" style={{ color: 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#1877F2'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}><Facebook size={24}/></a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#E4405F'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}><Instagram size={24}/></a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#0A66C2'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}><Linkedin size={24}/></a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#1DA1F2'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}><Twitter size={24}/></a>
              </div>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Ubicación & Soporte</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'rgba(255,255,255,0.7)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Mail size={16} color="var(--accent-cyan)" /> support@pronexusglobal.com</div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <MapPin size={18} color="var(--accent-cyan)" style={{ marginTop: '4px', flexShrink: 0 }} /> 
                  <span style={{ lineHeight: 1.5 }}>Av. Paseo de la Reforma 222, Piso 12,<br/>Cuauhtémoc, CDMX, 06600</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Phone size={16} color="var(--accent-cyan)" /> +52 (55) 1234-5678</div>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Newsletter</h4>
              <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Recibe tips de gestión y actualizaciones semanales.</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="email" placeholder="Email" style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '14px', color: 'white' }} />
                <button style={{ background: 'white', color: 'black', borderRadius: '15px', padding: '0 25px', fontWeight: 900, border: 'none' }}>OK</button>
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

export default LandingPage;
