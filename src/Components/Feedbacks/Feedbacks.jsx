import React, { useState, useEffect, useRef } from 'react';

const FeedbackSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  const feedbacks = [
    {
      name: "Mr.Ranjith Kariyawasham",
      role: "Managering Director",
      content: "The innovation and dedication brought to our project was remarkable. Every detail was crafted with precision and care.",
      rating: 5
    },
    {
      name: "Mr.Udaya Kumara",
      role: "Director R&D",
      content: "From concept to execution, the journey was seamless. They turned our ambitious vision into reality with exceptional skill.",
      rating: 5
    },
    {
      name: "Mr.Shishira Jayakodi",
      role: "Deputy general manager R&D",
      content: "Outstanding collaboration and creativity. The results exceeded our expectations and delivered measurable impact to our business.",
      rating: 5
    },
    {
      name: "Mr.Praveen Chiranga",
      role: "executive R&D",
      content: "Technical excellence combined with strategic thinking. They understood our challenges and provided solutions that truly work.",
      rating: 5
    },
    {
      name: "Dinuka shehan",
      role: "Marketing Director at BrandWave",
      content: "Responsive, professional, and incredibly talented. Working with them was one of the best decisions we made this year.",
      rating: 5
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
        setIsTransitioning(false);
      }, 600);
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
        setIsTransitioning(false);
      }, 600);
    }
  };

  const goToSlide = (index) => {
    if (!isTransitioning && index !== currentIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 600);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div 
        ref={containerRef}
        style={{
          ...styles.container,
          opacity: scrollProgress,
          transform: `translateY(${(1 - scrollProgress) * 50}px)`
        }}
      >
        <div style={styles.content}>
          <div style={{
            ...styles.headerSection,
            opacity: scrollProgress,
            transform: `translateY(${(1 - scrollProgress) * 30}px)`
          }}>
            <div style={styles.badge}>TESTIMONIALS</div>
            <h1 style={styles.mainTitle}>What Our Clients Say</h1>
            <p style={styles.description}>
              Trusted by industry leaders worldwide. Discover why clients choose to work with us.
            </p>
          </div>

          <div style={styles.sliderSection}>
            <div style={styles.cardsContainer}>
              {feedbacks.map((feedback, index) => {
                const offset = ((index - currentIndex + feedbacks.length) % feedbacks.length);
                const isActive = index === currentIndex;
                const isPrev = offset === feedbacks.length - 1;
                const isNext = offset === 1;
                const isVisible = isActive || isPrev || isNext;

                let translateX = 0;
                let scale = 0.85;
                let opacity = 0;
                let zIndex = 0;
                let rotateY = 0;

                if (isActive) {
                  translateX = 0;
                  scale = 1;
                  opacity = 1;
                  zIndex = 3;
                  rotateY = 0;
                } else if (isPrev) {
                  translateX = -450;
                  scale = 0.85;
                  opacity = 0.4;
                  zIndex = 2;
                  rotateY = 25;
                } else if (isNext) {
                  translateX = 450;
                  scale = 0.85;
                  opacity = 0.4;
                  zIndex = 2;
                  rotateY = -25;
                }

                return (
                  <div
                    key={index}
                    style={{
                      ...styles.card,
                      transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg) ${isTransitioning ? 'translateZ(-100px)' : 'translateZ(0)'}`,
                      opacity: isVisible ? opacity : 0,
                      zIndex: zIndex,
                      pointerEvents: isActive ? 'auto' : 'none',
                      transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                  >
                    <div style={styles.greenBar}></div>
                    <div style={styles.cardInner}>
                      <div style={styles.quoteIcon}>❝</div>
                      
                      <div style={styles.starsMain}>
                        {[...Array(feedback.rating)].map((_, i) => (
                          <span 
                            key={i} 
                            style={{
                              ...styles.starMain,
                              animation: isActive ? `starPop 0.3s ease ${i * 0.1}s both` : 'none'
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      <p style={{
                        ...styles.mainText,
                        opacity: isActive ? 1 : 0.7,
                        transform: isActive ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all 0.6s ease 0.2s'
                      }}>
                        {feedback.content}
                      </p>

                      <div style={{
                        ...styles.mainAuthor,
                        opacity: isActive ? 1 : 0.7,
                        transform: isActive ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all 0.6s ease 0.3s'
                      }}>
                        <div style={styles.avatarMain}>
                          {feedback.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={styles.mainAuthorName}>{feedback.name}</div>
                          <div style={styles.mainAuthorRole}>{feedback.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              ...styles.controls,
              opacity: scrollProgress,
              transform: `translateY(${(1 - scrollProgress) * 20}px)`
            }}>
              <button 
                onClick={handlePrev} 
                style={styles.controlBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(-5deg)';
                  e.currentTarget.style.background = '#7ab02d';
                  e.currentTarget.style.borderColor = '#7ab02d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.background = '#1f1f1f';
                  e.currentTarget.style.borderColor = '#2a2a2a';
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              
              <div style={styles.dotsContainer}>
                {feedbacks.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.dot,
                      ...(index === currentIndex ? styles.dotActive : {})
                    }}
                    onClick={() => goToSlide(index)}
                    onMouseEnter={(e) => {
                      if (index !== currentIndex) {
                        e.currentTarget.style.background = '#4a5568';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (index !== currentIndex) {
                        e.currentTarget.style.background = '#2a2a2a';
                      }
                    }}
                  />
                ))}
              </div>

              <button 
                onClick={handleNext} 
                style={styles.controlBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                  e.currentTarget.style.background = '#7ab02d';
                  e.currentTarget.style.borderColor = '#7ab02d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.background = '#1f1f1f';
                  e.currentTarget.style.borderColor = '#2a2a2a';
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <style>
          {`
            @keyframes starPop {
              0% {
                transform: scale(0) rotate(-180deg);
                opacity: 0;
              }
              50% {
                transform: scale(1.3) rotate(10deg);
              }
              100% {
                transform: scale(1) rotate(0deg);
                opacity: 1;
              }
            }

            @keyframes progressBar {
              from {
                width: 0%;
              }
              to {
                width: 100%;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#0a0a0a',
    overflow: 'hidden'
  },
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    transition: 'opacity 0.6s ease, transform 0.6s ease'
  },
  content: {
    maxWidth: '1400px',
    width: '100%'
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '80px',
    transition: 'opacity 0.8s ease, transform 0.8s ease'
  },
  badge: {
    display: 'inline-block',
    padding: '8px 20px',
    background: 'rgba(122, 176, 45, 0.1)',
    border: '1px solid rgba(122, 176, 45, 0.3)',
    borderRadius: '20px',
    color: '#7ab02d',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '1.5px',
    marginBottom: '20px'
  },
  mainTitle: {
    fontSize: '56px',
    fontWeight: '700',
    color: 'white',
    margin: '0 0 16px 0',
    letterSpacing: '-0.03em'
  },
  description: {
    fontSize: '18px',
    color: '#94a3b8',
    margin: 0,
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: '1.6'
  },
  sliderSection: {
    position: 'relative'
  },
  cardsContainer: {
    position: 'relative',
    height: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    perspective: '2000px',
    marginBottom: '60px'
  },
  card: {
    position: 'absolute',
    width: '600px',
    background: 'white',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
    transformStyle: 'preserve-3d',
    willChange: 'transform, opacity'
  },
  greenBar: {
    height: '6px',
    background: 'linear-gradient(90deg, #7ab02d 0%, #a0d049 100%)',
    animation: 'progressBar 5s linear infinite'
  },
  cardInner: {
    padding: '48px'
  },
  quoteIcon: {
    fontSize: '64px',
    color: 'rgba(122, 176, 45, 0.15)',
    fontFamily: 'Georgia, serif',
    lineHeight: '1',
    marginBottom: '20px',
    fontWeight: '700'
  },
  starsMain: {
    display: 'flex',
    gap: '6px',
    marginBottom: '28px'
  },
  starMain: {
    color: '#7ab02d',
    fontSize: '22px',
    display: 'inline-block'
  },
  mainText: {
    fontSize: '19px',
    lineHeight: '1.7',
    color: '#1e293b',
    margin: '0 0 36px 0',
    fontWeight: '400',
    minHeight: '100px'
  },
  mainAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    paddingTop: '32px',
    borderTop: '2px solid #f1f5f9'
  },
  avatarMain: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #7ab02d 0%, #a0d049 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(122, 176, 45, 0.3)'
  },
  mainAuthorName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0a0a0a',
    marginBottom: '4px'
  },
  mainAuthorRole: {
    fontSize: '14px',
    color: '#64748b'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '40px',
    transition: 'opacity 0.8s ease, transform 0.8s ease'
  },
  controlBtn: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    background: '#1f1f1f',
    border: '2px solid #2a2a2a',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  dotsContainer: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#2a2a2a',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  dotActive: {
    width: '36px',
    borderRadius: '5px',
    background: '#7ab02d',
    boxShadow: '0 0 20px rgba(122, 176, 45, 0.5)'
  }
};

export default FeedbackSlider;