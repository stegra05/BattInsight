import React from 'react';

const AboutPage = () => {
    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-primary mb-6">
                Über das Projekt Battery Failure Visualization
            </h1>
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-secondary">Zweck des Projekts</h2>
                <p className="text-lg leading-relaxed text-gray-700">
                    Dieses Projekt visualisiert Batterieausfälle weltweit, um einen besseren 
                    Überblick über potenzielle Probleme in der Batterieindustrie zu bieten.
                    Es nutzt moderne Technologien zur interaktiven Darstellung und Datenanalyse, 
                    um wichtige Erkenntnisse zu ermöglichen.
                </p>
            </section>
        </div>
    );
};

export default AboutPage;