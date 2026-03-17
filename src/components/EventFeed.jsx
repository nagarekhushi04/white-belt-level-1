import React from 'react';
import { CONTRACT_ID } from '../config';

/**
 * EventFeed
 * 
 * Props:
 *   events - Array of event objects: { id, type, user, count, timestamp }
 */
export default function EventFeed({ events }) {
    const isDeployed = CONTRACT_ID && CONTRACT_ID !== "YOUR_DEPLOYED_CONTRACT_ID_HERE";

    if (!isDeployed) return null;

    return (
        <div className="card" style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#e8e8f0', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <span>📡</span> Live Contract Events
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#00e676',
                        animation: 'pulse 2s infinite'
                    }} />
                    <span style={{ fontSize: '0.75rem', color: '#00e676', fontWeight: 600, textTransform: 'uppercase' }}>
                        Live
                    </span>
                    <style>
                        {`
                        @keyframes pulse {
                            0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(0, 230, 118, 0.7); }
                            70% { transform: scale(1.1); opacity: 0.8; box-shadow: 0 0 0 6px rgba(0, 230, 118, 0); }
                            100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(0, 230, 118, 0); }
                        }
                        @keyframes fadeInSlide {
                            from { opacity: 0; transform: translateY(-10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        `}
                    </style>
                </div>
            </div>

            {events.length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: '#555577', fontSize: '0.875rem' }}>
                    Waiting for contract activity...
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    maxHeight: '320px',
                    overflowY: 'auto',
                    paddingRight: '4px'
                }}>
                    {events.map((event) => (
                        <div
                            key={`${event.id}-${event.timestamp || Date.now()}`}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '8px',
                                padding: '12px 14px',
                                animation: 'fadeInSlide 0.4s ease-out forwards',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold',
                                    letterSpacing: '0.05em',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    background: event.type === 'increment' ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255, 82, 82, 0.1)',
                                    color: event.type === 'increment' ? '#00d4ff' : '#ff5252'
                                }}>
                                    {event.type}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#555577' }}>
                                    {new Date(event.timestamp).toLocaleTimeString()}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.85rem', color: '#8888aa', fontFamily: 'monospace' }}>
                                    By: {event.user.slice(0, 4)}...{event.user.slice(-4)}
                                </div>
                                {event.count !== undefined && (
                                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#e8e8f0' }}>
                                        #{event.count}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
