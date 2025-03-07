import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';

function WorldMap({ data, darkMode }) {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const fetchAndRenderMap = async () => {
      // Fetch world topology data
      const topology = await fetch('https://unpkg.com/world-atlas@2/countries-110m.json')
        .then(response => response.json());
      
      const countries = feature(topology, topology.objects.countries);
      
      // Setup dimensions
      const width = 960;
      const height = 500;
      
      // Create color scale for the gradient
      const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
        .domain([0, d3.max(data, d => d.failures) || 100]);

      // Setup projection
      const projection = d3.geoMercator()
        .fitSize([width, height], countries);
      
      const path = d3.geoPath().projection(projection);

      // Clear existing SVG
      d3.select(svgRef.current).selectAll("*").remove();

      // Create SVG
      const svg = d3.select(svgRef.current)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("class", "w-full h-full");

      // Create tooltip
      const tooltip = d3.select(tooltipRef.current);

      // Draw map
      svg.selectAll("path")
        .data(countries.features)
        .join("path")
        .attr("d", path)
        .attr("class", `${darkMode ? 'fill-gray-800' : 'fill-gray-200'} stroke-gray-400 transition-colors duration-200`)
        .attr("fill", d => {
          const countryData = data.find(item => item.country === d.properties.name);
          return countryData ? colorScale(countryData.failures) : (darkMode ? '#374151' : '#e5e7eb');
        })
        .on("mouseover", (event, d) => {
          const countryData = data.find(item => item.country === d.properties.name);
          tooltip
            .style("opacity", 1)
            .html(`
              <div class="bg-white dark:bg-gray-800 p-2 rounded shadow-lg">
                <strong>${d.properties.name}</strong><br/>
                ${countryData ? `Failures: ${countryData.failures}` : 'No data'}
              </div>
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });

      // Add legend
      const legendWidth = 200;
      const legendHeight = 10;

      const legendScale = d3.scaleLinear()
        .domain(colorScale.domain())
        .range([0, legendWidth]);

      const legendAxis = d3.axisBottom(legendScale)
        .tickSize(legendHeight)
        .tickFormat(d3.format("d"));

      const legend = svg.append("g")
        .attr("transform", `translate(${width - legendWidth - 20}, ${height - 30})`);

      legend.append("g")
        .call(legendAxis)
        .attr("class", `${darkMode ? 'text-gray-300' : 'text-gray-700'}`);
    };

    fetchAndRenderMap();
  }, [data, darkMode]);

  return (
    <div className="relative w-full h-[70vh]">
      <svg ref={svgRef} className="w-full h-full" />
      <div ref={tooltipRef} className="absolute pointer-events-none opacity-0 z-10" />
    </div>
  );
}

export default WorldMap;