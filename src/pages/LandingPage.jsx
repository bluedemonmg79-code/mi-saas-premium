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
  MessageSquare
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  
  // Script para el efecto de resplandor que sigue al mouse
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
    
    // Script para la revelación por scroll
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

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
      background: '#070a14', 
      color: 'white', 
      minHeight: '100vh', 
      fontFamily: 'Outfit, sans-serif',
      overflowX: 'hidden'
    }}>
      
      {/* NAVBAR v2.0 */}
      <nav style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, 
        padding: scrolled ? '1rem 2rem' : '1.5rem 2rem', 
        background: scrolled ? 'rgba(7, 10, 20, 0.8)' : 'transparent', 
        backdropFilter: scrolled ? 'blur(15px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'linear-gradient(45deg, #6366f1, #a855f7)', borderRadius: '12px', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
            <Zap size={20} fill="white" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-1px' }}>ProNexusGlobal</span>
        </div>
        
        <div style={{ display: 'none', lg: 'flex', gap: '2.5rem', alignItems: 'center' }} className="nav-links">
          {['Funciones', 'Testimonios', 'Precios'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
              {item}
            </a>
          ))}
          <Link to="/login" style={{ 
            padding: '10px 24px', borderRadius: '14px', background: 'white', color: '#070a14', 
            textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700, transition: 'all 0.3s'
          }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            Entrar
          </Link>
        </div>
      </nav>

      {/* HERO SECTION v2.0 */}
      <section style={{ 
        padding: '180px 20px 100px', textAlign: 'center', 
        background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.12), transparent 50%)',
        position: 'relative'
      }}>
        <div className="reveal-on-scroll" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.08)', 
            border: '1px solid rgba(99, 102, 241, 0.2)', padding: '6px 16px', borderRadius: '30px', 
            marginBottom: '2.5rem', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600
          }}>
            <Sparkles size={14} /> Nueva era en gestión profesional
          </div>
          
          <h1 style={{ 
            fontSize: 'max(3.5rem, 6vw)', fontWeight: 950, lineHeight: 1, letterSpacing: '-3px', marginBottom: '2rem'
          }} className="glow-text">
            Software de Elite para <br/>
            <span style={{ color: 'var(--accent-cyan)' }}>Mentes Brillantes.</span>
          </h1>
          
          <p style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.5)', maxWidth: '750px', margin: '0 auto 4rem', lineHeight: 1.6 }}>
            No es solo una agenda. Es el centro de mando inteligente para médicos, abogados y expertos que exigen perfección en su flujo de trabajo.
          </p>

          <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', marginBottom: '6rem' }}>
            <Link to="/login" style={{ 
              padding: '18px 45px', background: 'white', color: '#000', borderRadius: '18px', 
              fontSize: '1.1rem', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 20px 40px rgba(255,255,255,0.1)'
            }}>
              Empezar Gratis <ArrowRight size={20} />
            </Link>
            <a href="#features" style={{ 
              padding: '18px 45px', background: 'rgba(255,255,255,0.05)', color: 'white', 
              borderRadius: '18px', fontSize: '1.1rem', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)'
            }}>Ver Funciones</a>
          </div>

          {/* MOCKUP v2.0 - Cinematic look */}
          <div style={{ position: 'relative', marginTop: '4rem' }}>
            <div style={{ position: 'absolute', inset: '-20px', background: 'linear-gradient(to bottom, #6366f1, #a855f7)', opacity: 0.15, filter: 'blur(80px)', borderRadius: '40px', zIndex: -1 }}></div>
            <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '32px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
              <img src="/pronexus_hero_mockup_1776126850527.png" alt="SaaS Mockup" style={{ width: '100%', borderRadius: '24px', display: 'block' }} />
            </div>
            
            {/* Floating Badges (Marketing effect) */}
            <div style={{ position: 'absolute', top: '10%', left: '-5%', animation: 'float 6s ease-in-out infinite', background: 'rgba(15,23,42,0.9)', padding: '15px 25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ background: '#10b981', padding: '6px', borderRadius: '8px' }}><CheckCircle size={14}/></div>
              <div><div style={{ fontSize: '10px', opacity: 0.5 }}>Citas Hoy</div><div style={{ fontWeight: 800 }}>+12 Nuevas</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE LOGOS (Social Proof) */}
      <div style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ display: 'flex', width: '200%', animation: 'marquee 30s linear infinite', gap: '100px', alignItems: 'center', opacity: 0.3 }}>
          {[1,2,3,4,5,6,1,2,3,4,5,6].map((i, idx) => (
            <div key={idx} style={{ fontSize: '1.5rem', fontWeight: 900, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={20} /> MEDICAL FLOW <Award size={20}/> LEGAL PRO <Star size={20}/> COACH HUB
            </div>
          ))}
        </div>
      </div>

      {/* BENTO GRID FEATURES */}
      <section id="funciones" style={{ padding: '120px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal-on-scroll" style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '1.2rem' }}>Diseño pensado en el <span style={{ color: 'var(--accent-purple)' }}>Éxito.</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem' }}>Una suite de herramientas robustas bajo una interfaz minimalista.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: 'minmax(200px, auto)', gap: '20px' }}>
            {/* Bento Item 1 */}
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 8', gridRow: 'span 2', padding: '3rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ position: 'absolute', top: '2rem', right: '2rem', opacity: 0.1 }}><Calendar size={120}/></div>
              <Calendar size={32} color="var(--accent-cyan)" style={{ marginBottom: '1.5rem' }}/>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Agendamiento "Modo Dios" 🏛️</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '400px' }}>Tus clientes se agendan solos 24/7 con detección inteligente de choques de horario. Tu tiempo es sagrado, nosotros lo protegemos.</p>
            </div>
            {/* Bento Item 2 */}
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 4', gridRow: 'span 2', padding: '2.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(168,85,247,0.1), transparent)' }}>
              <MousePointer2 size={40} color="var(--accent-purple)" style={{ marginBottom: '1.5rem' }}/>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>White Label Total</h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.4)' }}>Sube tu logo y personaliza colores. La plataforma se ve y se siente como si la hubieras construido tú mismo.</p>
            </div>
            {/* Bento Item 3 */}
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 4', padding: '2rem', borderRadius: '32px' }}>
              <Lock size={24} color="#10b981" style={{ marginBottom: '1rem' }}/>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Seguridad Militar</h4>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>Datos encriptados de extremo a extremo con respaldo en la nube de nivel bancario.</p>
            </div>
            {/* Bento Item 4 */}
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 4', padding: '2rem', borderRadius: '32px' }}>
              <Globe size={24} color="#6366f1" style={{ marginBottom: '1rem' }}/>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Link Universal</h4>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>Tu marca disponible en cualquier parte del mundo con links cortos y elegantes.</p>
            </div>
            {/* Bento Item 5 */}
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 4', padding: '2rem', borderRadius: '32px', background: 'rgba(34,211,238,0.05)' }}>
              <MessageSquare size={24} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }}/>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>WhatsApp Magic</h4>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>Envío de recordatorios y confirmaciones con un solo clic desde tu dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonios" style={{ padding: '100px 20px', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="reveal-on-scroll" style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Ellos ya están en el <span style={{ color: '#10b981' }}>siguiente nivel.</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Únete a los cientos de profesionales que ya automatizaron su agenda.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {[
              { author: "Dr. Roberto Mendoza", role: "Odontología Estética", text: "ProNexusGlobal cambió mi vida. Antes perdía horas en WhatsApp; ahora mi agenda se llena sola mientras atiendo pacientes." },
              { author: "Lic. Andrea Ruiz", role: "Derecho Corporativo", text: "El sistema de marca blanca es impresionante. Mis clientes creen que desarrollé mi propia app de gestión." },
              { author: "Coach Julián Torres", role: "High Performance Coach", text: "La interfaz es tan limpia que usarla es un placer. La mejor inversión que he hecho para mi negocio digital este año." }
            ].map((t, i) => (
              <div key={i} className="reveal-on-scroll" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                <div style={{ display: 'flex', gap: '4px', color: '#f59e0b', marginBottom: '1.5rem' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="#f59e0b" />)}
                </div>
                <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', lineHeight: 1.6 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(45deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800 }}>{t.author[0]}</div>
                  <div>
                    <div style={{ fontWeight: 800 }}>{t.author}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="precios" style={{ padding: '120px 20px' }}>
        <div className="reveal-on-scroll" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '4rem' }}>Planes diseñados para tu <span style={{ color: 'var(--accent-purple)' }}>crecimiento.</span></h2>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '2rem', backdropFilter: 'blur(20px)', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.4)' }}>
            <stripe-pricing-table
              pricing-table-id="prctbl_1TKmNeRzHRtT8e1b7CUMp6tx"
              publishable-key="pk_test_51TKlBcRzHRtT8e1byh4GMNN27g3iPpEX4MD6gIUFWCYEH7CkYQhQYQVYJcNno1M5FGWXIjJx5UsvWCIQj5dOPDCk00xMl03wSR"
            ></stripe-pricing-table>
          </div>
        </div>
      </section>

      {/* FOOTER v2.0 */}
      <footer style={{ padding: '100px 20px 50px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#05080f' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <Zap size={24} color="#6366f1" fill="#6366f1" />
                <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>ProNexusGlobal</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>El futuro de la gestión profesional, hoy. Automatiza tu éxito con la plataforma más avanzada del mercado.</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Contacto Directo</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', color: 'rgba(255,255,255,0.4)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Mail size={16}/> support@pronexusglobal.com</div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><MapPin size={16}/> Ciudad de México, MX</div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Phone size={16}/> +52 (55) 1234-5678</div>
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Newsletter Élite</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Tu email" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: 'white' }} />
                <button style={{ background: 'white', color: 'black', border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: 800 }}>Unirse</button>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.15)', fontSize: '0.8rem' }}>
            © 2026 ProNexusGlobal Labs. Todos los derechos reservados.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
