import React from 'react';

const AboutPage = () => {
    return (
        <div className="about-page" style={{ padding: '20px', lineHeight: '1.6' }}>
            <h1>Über das Projekt Battery Failure Visualization</h1>
            <section>
                <h2>Zweck des Projekts</h2>
                <p>
                    Dieses Projekt visualisiert Batterieausfälle weltweit, um einen besseren Überblick über potenzielle Probleme in der Batterieindustrie zu bieten.
                    Es nutzt moderne Technologien zur interaktiven Darstellung und Datenanalyse, um wichtige Erkenntnisse zu ermöglichen.
                </p>
            </section>
            <section>
                <h2>Datenquellen</h2>
                <p>
                    Die verwendeten Daten stammen aus verschiedenen zuverlässigen Quellen, darunter:
                </p>
                <ul>
                    <li>Öffentliche API-Daten</li>
                    <li>Forschungsdatenbanken</li>
                    <li>Industrieberichte</li>
                </ul>
            </section>
            <section>
                <h2>Entwicklerteam & Open-Source-Bibliotheken</h2>
                <p>
                    Das Projekt wurde von einem engagierten Entwicklerteam umgesetzt und nutzt verschiedene Open-Source-Bibliotheken, wie zum Beispiel:
                </p>
                <ul>
                    <li>React</li>
                    <li>Leaflet</li>
                    <li>react-router-dom</li>
                </ul>
            </section>
            <section>
                <h2>Weiterführende Informationen</h2>
                <p>
                    Für weiterführende Informationen und wissenschaftliche Arbeiten besuchen Sie bitte die folgenden Links:
                </p>
                <ul>
                    <li><a href="https://www.example.com" target="_blank" rel="noopener noreferrer">Wissenschaftliche Studie 1</a></li>
                    <li><a href="https://www.example.org" target="_blank" rel="noopener noreferrer">Weitere Informationen</a></li>
                </ul>
            </section>
        </div>
    );
};

export default AboutPage;