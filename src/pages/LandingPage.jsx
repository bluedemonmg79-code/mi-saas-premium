import React from 'react';
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
  Award
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-root" style={{ 
      background: '#0a0f1d', 
      color: 'white', 
      minHeight: '100vh', 
      fontFamily: 'Outfit, sans-serif' 
    }}>
      
      {/* NAVBAR */}
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000, 
        padding: '1.5rem 2rem', 
        background: 'rgba(10, 15, 29, 0.8)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'linear-gradient(45deg, #6366f1, #a855f7)', borderRadius: '12px' }}>
            <Zap size={20} fill="white" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ProNexusGlobal
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#features" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Funciones</a>
          <a href="#pricing" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Planes</a>
          <Link to="/login" style={{ 
            padding: '10px 24px', 
            borderRadius: '12px', 
            border: '1px solid rgba(255,255,255,0.1)', 
            background: 'rgba(255,255,255,0.05)', 
            color: 'white', 
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            transition: 'all 0.3s'
          }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} 
             onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            Iniciar Sesión
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{ 
        paddingTop: '160px', 
        paddingBottom: '100px', 
        textAlign: 'center', 
        background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15), transparent 70%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'rgba(99, 102, 241, 0.1)', 
            border: '1px solid rgba(99, 102, 241, 0.2)', 
            padding: '8px 20px', 
            borderRadius: '30px', 
            marginBottom: '2rem',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            <Award size={14} /> El SaaS No. 1 para Profesionales Independientes
          </div>
          
          <h1 style={{ 
            fontSize: 'max(3rem, 5vw)', 
            fontWeight: 900, 
            lineHeight: 1.1, 
            letterSpacing: '-2px',
            marginBottom: '1.5rem'
          }}>
            La Inteligencia Artificial que <br/>
            <span style={{ background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Agenda tu Éxito
            </span>
          </h1>
          
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'rgba(255,255,255,0.5)', 
            maxWidth: '700px', 
            margin: '0 auto 3rem',
            lineHeight: 1.6
          }}>
            ProNexusGlobal es el cerebro digital para médicos, abogados y coaches. 
            Automatiza tus citas, personaliza tu marca y escala tu negocio mientras tú te enfocas en lo que amas.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
            <Link to="/login" style={{ 
              padding: '16px 40px', 
              background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
              color: 'white', 
              borderRadius: '16px', 
              fontSize: '1.1rem', 
              fontWeight: 700, 
              textDecoration: 'none',
              boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              Empezar Gratis Ahora <ArrowRight size={20} />
            </Link>
          </div>

          {/* MOCKUP IMAGE */}
          <div style={{ 
            position: 'relative',
            maxWidth: '1100px',
            margin: '0 auto',
            borderRadius: '24px',
            padding: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
            transition: 'transform 0.5s'
          }}>
            <img 
              src="/pronexus_hero_mockup_1776126850527.png" 
              alt="Dashboard Preview" 
              style={{ width: '100%', borderRadius: '18px', display: 'block' }} 
            />
            {/* Overlay glow */}
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              boxShadow: 'inset 0 0 100px rgba(99,102,241,0.1)',
              pointerEvents: 'none'
            }} />
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" style={{ padding: '100px 20px', background: '#0a0f1d' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Todo lo que necesitas en un solo lugar</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Herramientas diseñadas por y para profesionales exigentes.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <Calendar color="var(--accent-cyan)" />, title: 'Agendamiento Autónomo', text: 'Tus clientes agendan desde tu propio link sin que tengas que mover un dedo.' },
              { icon: <Users color="#f59e0b" />, title: 'CRM Multi-Nicho', text: 'Organiza pacientes, clientes o prospectos con expedientes digitales de alta gama.' },
              { icon: <Layout color="#a855f7" />, title: 'White Label Branding', text: 'Sube tu logo y personaliza la app con tu propia identidad corporativa.' },
              { icon: <Shield color="#10b981" />, title: 'Seguridad Bancaria', text: 'Tus datos están encriptados y protegidos con los estándares más altos de la industria.' },
              { icon: <Globe color="#6366f1" />, title: 'Link Público "Modo Dios"', text: 'Una URL única (pronexus.app/u/tu-nombre) para compartir en redes sociales.' },
              { icon: <Zap color="#ec4899" />, title: 'Resultados Instantáneos', text: 'Instala, configura y empieza a recibir citas en menos de 5 minutos.' }
            ].map((f, i) => (
              <div key={i} className="feature-card" style={{ 
                padding: '2rem', 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '24px',
                transition: 'all 0.3s'
              }}>
                <div style={{ marginBottom: '1.5rem', width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TABLE INTEGRATION */}
      <section id="pricing" style={{ padding: '100px 20px', position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '600px', 
          height: '600px', 
          background: 'rgba(99, 102, 241, 0.05)', 
          filter: 'blur(100px)', 
          borderRadius: '50%',
          zIndex: -1
        }} />
        
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '4rem' }}>Planes simples y <span style={{ color: 'var(--accent-cyan)' }}>transparentes</span></h2>
          
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '30px', padding: '2rem', backdropFilter: 'blur(20px)' }}>
            {/* Widget oficial de Stripe */}
            <stripe-pricing-table
              pricing-table-id="prctbl_1TKmNeRzHRtT8e1b7CUMp6tx"
              publishable-key="pk_test_51TKlBcRzHRtT8e1byh4GMNN27g3iPpEX4MD6gIUFWCYEH7CkYQhQYQVYJcNno1M5FGWXIjJx5UsvWCIQj5dOPDCk00xMl03wSR"
            ></stripe-pricing-table>
          </div>
        </div>
      </section>

      {/* FOOTER / CONTACT */}
      <footer style={{ padding: '100px 20px 50px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#070a14' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <Zap size={24} color="#6366f1" />
                <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>ProNexusGlobal</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.3)', lineHeight: 1.6, marginBottom: '2rem' }}>
                Redefiniendo el futuro de la gestión profesional con inteligencia y diseño.
              </p>
            </div>

            <div>
              <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Contacto & Soporte</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.5)' }}>
                  <Mail size={16} /> support@pronexusglobal.com
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.5)' }}>
                  <MapPin size={16} /> Ciudad de México, MX
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.5)' }}>
                  <Phone size={16} /> (55) 1234-5678
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Legal</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Términos de Servicio</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Política de Privacidad</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Deslinde Médico</a>
              </div>
            </div>

          </div>

          <div style={{ textAlign: 'center', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
            © 2026 ProNexusGlobal Labs. Todos los derechos reservados.
          </div>
        </div>
      </footer>
      
      <style>{`
        .feature-card:hover {
          background: rgba(255,255,255,0.05) !important;
          transform: translateY(-5px);
          border-color: rgba(99,102,241,0.3) !important;
        }
        @keyframes float {
          0% { transform: translateY(0px) }
          50% { transform: translateY(-10px) }
          100% { transform: translateY(0px) }
        }
        html { scroll-behavior: smooth; }
      `}</style>

    </div>
  );
};

export default LandingPage;
