import React, { useState } from 'react';
import Filter from '../components/Filter';
import WorldMap from '../components/WorldMap';

const Home = () => {
    const [filters, setFilters] = useState({ country: '', batteryType: '' });

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="home-page">
            <header>
                <h1>Battery Failure Visualization</h1>
            </header>
            <main>
                <Filter onFilterChange={handleFilterChange} />
                <WorldMap filters={filters} />
            </main>
        </div>
    );
};

export default Home;