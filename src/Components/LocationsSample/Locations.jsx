import React, { useState, useEffect } from 'react';
import { Truck, Clock, MapPin, Navigation, Activity, Radio } from 'lucide-react';

function Locations() {
  // Truck data with routes in Sri Lanka
  const [trucks, setTrucks] = useState([
    { 
      id: 1, 
      name: 'Truck 1',
      lat: 6.9271, 
      lng: 79.8612,
      destination: 'Kandy',
      estimatedArrival: '2:45 PM',
      speed: 45,
      status: 'On Route',
      driver: 'Kamal Silva'
    },
    { 
      id: 2, 
      name: 'Truck 2',
      lat: 7.2906, 
      lng: 80.6337,
      destination: 'Galle',
      estimatedArrival: '4:20 PM',
      speed: 52,
      status: 'On Route',
      driver: 'Sunil Fernando'
    },
  ]);

  // Simulate real-time movement
  useEffect(() => {
    const interval = setInterval(() => {
      setTrucks((prevTrucks) =>
        prevTrucks.map((truck) => ({
          ...truck,
          lat: Math.min(Math.max(truck.lat + (Math.random() - 0.5) * 0.015, 5.9), 9.9),
          lng: Math.min(Math.max(truck.lng + (Math.random() - 0.5) * 0.015, 79.7), 81.9),
          speed: Math.floor(40 + Math.random() * 20),
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
  window.location.href = '/presign';
};


  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={handleBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              background: '#1a73e8',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              boxShadow: '0 1px 2px rgba(26, 115, 232, 0.2)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#1765cc';
              e.target.style.boxShadow = '0 2px 4px rgba(26, 115, 232, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#1a73e8';
              e.target.style.boxShadow = '0 1px 2px rgba(26, 115, 232, 0.2)';
            }}
          >
            <Navigation size={16} style={{ transform: 'rotate(180deg)' }} />
            Back
          </button>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#202124',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            margin: 0
          }}>
            <div style={{
              background: '#1a73e8',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck size={24} color="white" />
            </div>
            Sample Transport Tracking
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: '#e8f5e9',
            borderRadius: '20px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#34a853',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></div>
            <span style={{ color: '#1e8e3e', fontSize: '0.875rem', fontWeight: '500' }}>Live</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Map Section */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#202124' }}>
                  Live Map View
                </h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', background: '#ea4335', borderRadius: '50%' }}></div>
                    <span style={{ color: '#5f6368' }}>Truck 1</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', background: '#1a73e8', borderRadius: '50%' }}></div>
                    <span style={{ color: '#5f6368' }}>Truck 2</span>
                  </div>
                </div>
              </div>
              <div style={{ position: 'relative', height: '600px', background: '#f8f9fa' }}>
                {/* Real Sri Lanka Map using OpenStreetMap tiles */}
                <iframe
                  src={`data:text/html;charset=utf-8,${encodeURIComponent(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                      <style>
                        body { margin: 0; padding: 0; }
                        #map { width: 100vw; height: 100vh; }
                        .truck-marker-1 {
                          background: #ea4335;
                          width: 36px;
                          height: 36px;
                          border-radius: 50%;
                          border: 3px solid white;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          font-weight: bold;
                          color: white;
                          font-size: 14px;
                          box-shadow: 0 2px 8px rgba(234, 67, 53, 0.4);
                          position: relative;
                        }
                        .truck-marker-2 {
                          background: #1a73e8;
                          width: 36px;
                          height: 36px;
                          border-radius: 50%;
                          border: 3px solid white;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          font-weight: bold;
                          color: white;
                          font-size: 14px;
                          box-shadow: 0 2px 8px rgba(26, 115, 232, 0.4);
                          position: relative;
                        }
                        .truck-marker-1::before,
                        .truck-marker-2::before {
                          content: '';
                          position: absolute;
                          width: 100%;
                          height: 100%;
                          border-radius: 50%;
                          animation: ripple 2s infinite;
                        }
                        .truck-marker-1::before {
                          border: 2px solid #ea4335;
                        }
                        .truck-marker-2::before {
                          border: 2px solid #1a73e8;
                        }
                        @keyframes ripple {
                          0% {
                            transform: scale(1);
                            opacity: 1;
                          }
                          100% {
                            transform: scale(2.5);
                            opacity: 0;
                          }
                        }
                        .leaflet-popup-content-wrapper {
                          border-radius: 8px;
                          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                        }
                        .leaflet-popup-content {
                          margin: 12px;
                          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                        }
                      </style>
                    </head>
                    <body>
                      <div id="map"></div>
                      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                      <script>
                        const map = L.map('map', {
                          center: [7.8731, 80.7718],
                          zoom: 8,
                          minZoom: 7,
                          maxZoom: 18,
                          maxBounds: [[5.8, 79.5], [10.0, 82.0]]
                        });
                        
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                          attribution: '© OpenStreetMap contributors',
                          maxZoom: 18
                        }).addTo(map);

                        const trucks = ${JSON.stringify(trucks)};
                        const markers = {};

                        trucks.forEach(truck => {
                          const icon = L.divIcon({
                            html: '<div class="truck-marker-' + truck.id + '">' + truck.id + '</div>',
                            className: '',
                            iconSize: [36, 36],
                            iconAnchor: [18, 18]
                          });
                          
                          const marker = L.marker([truck.lat, truck.lng], { icon })
                            .addTo(map)
                            .bindPopup(
                              '<div style="min-width: 200px;">' +
                              '<h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #202124;">' + truck.name + '</h3>' +
                              '<div style="color: #5f6368; font-size: 13px; line-height: 1.6;">' +
                              '<div style="margin-bottom: 4px;"><strong>Driver:</strong> ' + truck.driver + '</div>' +
                              '<div style="margin-bottom: 4px;"><strong>Destination:</strong> ' + truck.destination + '</div>' +
                              '<div style="margin-bottom: 4px;"><strong>Speed:</strong> ' + truck.speed + ' km/h</div>' +
                              '<div><strong>ETA:</strong> ' + truck.estimatedArrival + '</div>' +
                              '</div>' +
                              '</div>'
                            );
                          
                          markers[truck.id] = marker;
                        });

                        window.addEventListener('message', (e) => {
                          if (e.data.type === 'updateTrucks') {
                            e.data.trucks.forEach(truck => {
                              if (markers[truck.id]) {
                                markers[truck.id].setLatLng([truck.lat, truck.lng]);
                                markers[truck.id].setPopupContent(
                                  '<div style="min-width: 200px;">' +
                                  '<h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #202124;">' + truck.name + '</h3>' +
                                  '<div style="color: #5f6368; font-size: 13px; line-height: 1.6;">' +
                                  '<div style="margin-bottom: 4px;"><strong>Driver:</strong> ' + truck.driver + '</div>' +
                                  '<div style="margin-bottom: 4px;"><strong>Destination:</strong> ' + truck.destination + '</div>' +
                                  '<div style="margin-bottom: 4px;"><strong>Speed:</strong> ' + truck.speed + ' km/h</div>' +
                                  '<div><strong>ETA:</strong> ' + truck.estimatedArrival + '</div>' +
                                  '</div>' +
                                  '</div>'
                                );
                              }
                            });
                          }
                        });
                      </script>
                    </body>
                    </html>
                  `)}`}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  ref={(iframe) => {
                    if (iframe) {
                      const interval = setInterval(() => {
                        try {
                          iframe.contentWindow.postMessage({ type: 'updateTrucks', trucks }, '*');
                        } catch (e) {}
                      }, 2000);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Truck Status Cards */}
          {trucks.map((truck, index) => (
            <div
              key={truck.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Card Header */}
              <div style={{
                background: index === 0 ? '#ea4335' : '#1a73e8',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.25)',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <Truck size={20} color="white" />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>
                        {truck.name}
                      </h3>
                      <p style={{ margin: '2px 0 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.813rem' }}>
                        {truck.driver}
                      </p>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    padding: '0.375rem 0.875rem',
                    borderRadius: '20px',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem'
                  }}>
                    <Radio size={12} color="white" />
                    <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: '500' }}>
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.25rem' }}>
                {/* Arrival Time - Featured */}
                <div style={{
                  background: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  border: '1px solid #e8eaed'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <Clock size={18} color="#5f6368" />
                    <span style={{ color: '#5f6368', fontSize: '0.813rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Estimated Arrival
                    </span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#202124', letterSpacing: '-0.5px' }}>
                    {truck.estimatedArrival}
                  </div>
                </div>

                {/* Destination */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <MapPin size={16} color="#5f6368" />
                    <span style={{ color: '#5f6368', fontSize: '0.75rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Destination
                    </span>
                  </div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#202124', paddingLeft: '1.5rem' }}>
                    {truck.destination}
                  </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{
                    background: '#f8f9fa',
                    padding: '0.875rem',
                    borderRadius: '8px',
                    border: '1px solid #e8eaed'
                  }}>
                    <div style={{ color: '#5f6368', fontSize: '0.75rem', marginBottom: '0.25rem', fontWeight: '500' }}>
                      Speed
                    </div>
                    <div style={{ color: '#202124', fontWeight: '700', fontSize: '1.25rem' }}>
                      {truck.speed}
                      <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#5f6368', marginLeft: '2px' }}>km/h</span>
                    </div>
                  </div>
                  <div style={{
                    background: '#f8f9fa',
                    padding: '0.875rem',
                    borderRadius: '8px',
                    border: '1px solid #e8eaed'
                  }}>
                    <div style={{ color: '#5f6368', fontSize: '0.75rem', marginBottom: '0.25rem', fontWeight: '500' }}>
                      Status
                    </div>
                    <div style={{ color: '#34a853', fontWeight: '600', fontSize: '0.875rem' }}>
                      {truck.status}
                    </div>
                  </div>
                </div>

                {/* Location Coordinates */}
                <div style={{
                  background: '#f8f9fa',
                  padding: '0.875rem',
                  borderRadius: '8px',
                  border: '1px solid #e8eaed'
                }}>
                  <div style={{ color: '#5f6368', fontSize: '0.75rem', marginBottom: '0.25rem', fontWeight: '500' }}>
                    Current Position
                  </div>
                  <div style={{ color: '#202124', fontFamily: 'monospace', fontSize: '0.813rem', fontWeight: '500' }}>
                    {truck.lat.toFixed(4)}°N, {truck.lng.toFixed(4)}°E
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginTop: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#5f6368',
                    marginBottom: '0.5rem',
                    fontWeight: '500'
                  }}>
                    <span>Journey Progress</span>
                    <span>{Math.floor(Math.random() * 30 + 50)}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    background: '#e8eaed',
                    borderRadius: '4px',
                    height: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: index === 0 ? '#ea4335' : '#1a73e8',
                      height: '100%',
                      borderRadius: '4px',
                      width: `${Math.floor(Math.random() * 30 + 50)}%`,
                      transition: 'width 0.5s'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default Locations;