import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
          boxShadow: `0 0 20px ${accent}`, color: 'white'
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
          <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>/mo</span>
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

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0];

  const toggleLanguage = () => {
    const nextLang = currentLang === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button 
      onClick={toggleLanguage}
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '8px 14px',
        borderRadius: '12px',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.85rem',
        fontWeight: 800,
        transition: 'all 0.3s'
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
    >
      <Globe size={14} />
      {currentLang.toUpperCase()}
    </button>
  );
};

const LandingPage = () => {
  const { t } = useTranslation();
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
          <div className="nav-links" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            <a href="#features" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>{t('nav.features')}</a>
            <a href="#testimonials" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>{t('nav.testimonials')}</a>
            <a href="#precios" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>{t('nav.pricing')}</a>
          </div>
          
          <LanguageSwitcher />

          <Link to="/login" style={{ 
            padding: '12px 28px', borderRadius: '14px', background: 'white', color: '#070a14', 
            textDecoration: 'none', fontSize: '0.95rem', fontWeight: 800
          }}>
            {t('nav.login')}
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
            <Sparkles size={16} color="var(--accent-cyan)" /> <span style={{ color: 'white' }}>{t('hero.badge')}</span>
          </div>
          
          <h1 style={{ fontSize: 'max(4rem, 7vw)', fontWeight: 950, lineHeight: 0.95, letterSpacing: '-4px', marginBottom: '2.5rem' }} className="glow-text">
            {t('hero.title_part1')} <br/>
            <span style={{ background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t('hero.title_part2')}
            </span>
          </h1>
          
          <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.5)', maxWidth: '800px', margin: '0 auto 4.5rem', lineHeight: 1.5 }}>
            {t('hero.description')}
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '8rem' }}>
            <Link to="/login" style={{ 
              padding: '20px 50px', background: 'white', color: '#000', borderRadius: '20px', 
              fontSize: '1.2rem', fontWeight: 900, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              {t('hero.cta_primary')} <ArrowRight size={22} />
            </Link>
            <a href="#features" style={{ 
              padding: '20px 50px', background: 'rgba(255,255,255,0.03)', color: 'white', 
              borderRadius: '20px', fontSize: '1.2rem', fontWeight: 700, textDecoration: 'none', 
              border: '1px solid rgba(255,255,255,0.1)'
            }}>{t('hero.cta_secondary')}</a>
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
              <Activity size={24}/> {t('marquee.dental')} <Server size={24}/> {t('marquee.legal')} <Users size={24}/> {t('marquee.coach')} <Briefcase size={24}/> {t('marquee.legal')}
            </div>
          ))}
        </div>
      </div>

      {/* BENTO GRID */}
      <section id="features" style={{ padding: '140px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal-on-scroll" style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '4rem', fontWeight: 950, letterSpacing: '-3px', marginBottom: '1.5rem' }}>{t('features.title_part1')} <span style={{ color: 'var(--accent-cyan)' }}>{t('features.title_part2')}</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem' }}>{t('features.description')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: 'minmax(220px, auto)', gap: '25px' }}>
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 8', gridRow: 'span 2', padding: '3.5rem', borderRadius: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>{t('features.agenda_title')}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', maxWidth: '450px' }}>{t('features.agenda_desc')} {t('features.agenda_save', { count: 10 })}</p>
            </div>
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 4', gridRow: 'span 2', padding: '3rem', borderRadius: '40px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), transparent)' }}>
              <Layout size={50} color="var(--accent-purple)" style={{ marginBottom: '2rem' }}/>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.2rem' }}>{t('features.white_label_title')}</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>{t('features.white_label_desc')}</p>
            </div>
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 4', padding: '2.5rem', borderRadius: '40px' }}>
              <Activity size={32} color="#10b981" style={{ marginBottom: '1rem' }}/>
              <div style={{ fontSize: '2rem', fontWeight: 900 }}><Counter end={99} suffix="%" /></div>
              <div style={{ color: 'rgba(255,255,255,0.4)' }}>{t('features.uptime_title')}</div>
            </div>
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 4', padding: '2.5rem', borderRadius: '40px' }}>
              <Shield size={32} color="#6366f1" style={{ marginBottom: '1rem' }}/>
              <div style={{ fontSize: '2rem', fontWeight: 900 }}>AES-256</div>
              <div style={{ color: 'rgba(255,255,255,0.4)' }}>{t('features.security_title')}</div>
            </div>
            <div className="bento-card reveal-on-scroll" style={{ gridColumn: 'span 4', padding: '2.5rem', borderRadius: '40px' }}>
              <Users size={32} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }}/>
              <div style={{ fontSize: '2rem', fontWeight: 900 }}><Counter end={100} suffix="K+" /></div>
              <div style={{ color: 'rgba(255,255,255,0.4)' }}>{t('features.processed_title')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM PRICING SECTION */}
      <section id="precios" style={{ padding: '140px 20px', background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.08), transparent 70%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal-on-scroll" style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '4rem', fontWeight: 950, letterSpacing: '-2px', marginBottom: '1.5rem' }}>{t('pricing.title_part1')} <span style={{ color: 'var(--accent-purple)' }}>{t('pricing.title_part2')}</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.3rem' }}>{t('pricing.subtitle')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '30px', alignItems: 'center' }}>
            <PricingCard 
              title={t('pricing.basic.title')}
              price="299"
              description={t('pricing.basic.desc')}
              accent="var(--accent-cyan)"
              highlighted={false}
              buttonText={t('pricing.basic.button')}
              waMessage={t('pricing.basic.wa_message')}
              features={[
                t('pricing.basic.f1'),
                t('pricing.basic.f2'),
                t('pricing.basic.f3'),
                t('pricing.basic.f4'),
                t('pricing.basic.f5')
              ]}
            />
            
            <PricingCard 
              title={t('pricing.pro.title')}
              price="599"
              description={t('pricing.pro.desc')}
              accent="var(--accent-purple)"
              highlighted={true}
              buttonText={t('pricing.pro.button')}
              waMessage={t('pricing.pro.wa_message')}
              features={[
                t('pricing.pro.f1'),
                t('pricing.pro.f2'),
                t('pricing.pro.f3'),
                t('pricing.pro.f4'),
                t('pricing.pro.f5'),
                t('pricing.pro.f6')
              ]}
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ padding: '140px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal-on-scroll" style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '4rem', fontWeight: 950, letterSpacing: '-2px', marginBottom: '1.5rem' }}>{t('testimonials.title_part1')} <br/> <span style={{ color: 'var(--accent-cyan)' }}>{t('testimonials.title_part2')}</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {[1,2,3].map(i => (
              <div key={i} className="bento-card reveal-on-scroll" style={{ padding: '3rem', borderRadius: '40px' }}>
                <div style={{ display: 'flex', gap: '5px', marginBottom: '1.5rem' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="var(--accent-cyan)" color="var(--accent-cyan)" />)}
                </div>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem', color: 'rgba(255,255,255,0.7)' }}>
                  "{t(`testimonials.t${i}.text`)}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                  <div>
                    <h4 style={{ fontWeight: 900 }}>{t(`testimonials.t${i}.author`)}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>{t(`testimonials.t${i}.role`)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '120px 20px 60px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#03050a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '4rem', marginBottom: '6rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                <Zap size={30} color="#6366f1" fill="#6366f1" />
                <span style={{ fontSize: '1.8rem', fontWeight: 950 }}>ProNexusGlobal</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.3)', lineHeight: 1.8 }}>{t('footer.slogan')}</p>
              
              <div style={{ display: 'flex', gap: '15px', marginTop: '2.5rem' }}>
                <a href="#" style={{ color: 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#1877F2'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}><Facebook size={24}/></a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#E4405F'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}><Instagram size={24}/></a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#0A66C2'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}><Linkedin size={24}/></a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#1DA1F2'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}><Twitter size={24}/></a>
              </div>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>{t('footer.company')}</h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{t('footer.about')}</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{t('footer.contact')}</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{t('footer.support')}</a>
              </nav>
            </div>

            <div>
              <h4 style={{ marginBottom: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>{t('footer.location_title')}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'rgba(255,255,255,0.7)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Mail size={16} color="var(--accent-cyan)" /> support@pronexusglobal.com</div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <MapPin size={18} color="var(--accent-cyan)" style={{ marginTop: '4px', flexShrink: 0 }} /> 
                  <span style={{ lineHeight: 1.5 }}>{t('footer.location_desc')}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Phone size={16} color="var(--accent-cyan)" /> +52 (55) 1234-5678</div>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>{t('footer.newsletter')}</h4>
              <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{t('footer.newsletter_desc')}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="email" placeholder="Email" style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '14px', color: 'white' }} />
                <button style={{ background: 'white', color: 'black', borderRadius: '15px', padding: '0 25px', fontWeight: 900, border: 'none' }}>OK</button>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.1)', fontSize: '0.9rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {t('footer.rights', { year: new Date().getFullYear() })}
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
