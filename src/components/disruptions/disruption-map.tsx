"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Disruption } from "@/hooks/useDisruptions";

interface DisruptionMapProps {
  disruptions: Disruption[];
  selectedType: string;
}

export function DisruptionMap({ disruptions, selectedType }: DisruptionMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedDisruption, setSelectedDisruption] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || disruptions.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Filter disruptions by type
    const filteredDisruptions = selectedType === "all" 
      ? disruptions 
      : disruptions.filter(d => d.type === selectedType);

    // Create projection for world map
    const projection = d3
      .geoNaturalEarth1()
      .scale(120)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Create main group
    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Simple world outline (simplified for demo)
    const worldOutline = g.append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("fill", "var(--muted)")
      .attr("stroke", "var(--border)")
      .attr("opacity", 0.1);

    // Add continent shapes (simplified)
    const continents = [
      { name: "North America", x: 150, y: 100, width: 200, height: 150 },
      { name: "South America", x: 200, y: 250, width: 100, height: 120 },
      { name: "Europe", x: 350, y: 80, width: 80, height: 100 },
      { name: "Africa", x: 350, y: 180, width: 100, height: 150 },
      { name: "Asia", x: 450, y: 60, width: 250, height: 200 },
      { name: "Australia", x: 600, y: 280, width: 80, height: 60 },
    ];

    continents.forEach(continent => {
      g.append("rect")
        .attr("x", continent.x)
        .attr("y", continent.y)
        .attr("width", continent.width)
        .attr("height", continent.height)
        .attr("fill", "var(--muted)")
        .attr("stroke", "var(--border)")
        .attr("opacity", 0.3)
        .attr("rx", 10);
    });

    // Color scale for severity
    const severityColors = {
      low: "#10b981",
      medium: "#f59e0b", 
      high: "#ef4444",
      critical: "#dc2626"
    };

    // Size scale for impact
    const impactScale = d3
      .scaleSqrt()
      .domain([0, d3.max(filteredDisruptions, d => d.impact.cost) || 100000])
      .range([5, 25]);

    // Plot disruptions
    const disruptionGroup = g.append("g").attr("class", "disruptions");

    filteredDisruptions.forEach((disruption, index) => {
      // Convert lat/lng to screen coordinates
      const coords = projection([disruption.location.lng, disruption.location.lat]);
      if (!coords) return;

      const [x, y] = coords;
      const radius = impactScale(disruption.impact.cost);
      const isSelected = selectedDisruption === disruption.id;

      // Create disruption circle
      const circle = disruptionGroup
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0)
        .attr("fill", severityColors[disruption.severity as keyof typeof severityColors])
        .attr("stroke", "#ffffff")
        .attr("stroke-width", isSelected ? 3 : 1)
        .attr("opacity", 0.8)
        .attr("cursor", "pointer")
        .on("click", () => {
          setSelectedDisruption(selectedDisruption === disruption.id ? null : disruption.id);
        })
        .on("mouseover", function() {
          d3.select(this)
            .attr("stroke-width", 3)
            .attr("opacity", 1);
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("stroke-width", isSelected ? 3 : 1)
            .attr("opacity", 0.8);
        });

      // Animate circle appearance
      circle
        .transition()
        .delay(index * 100)
        .duration(500)
        .attr("r", radius);

      // Add pulsing animation for active disruptions
      if (disruption.status === "active") {
        const pulseCircle = disruptionGroup
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", radius)
          .attr("fill", "none")
          .attr("stroke", severityColors[disruption.severity as keyof typeof severityColors])
          .attr("stroke-width", 2)
          .attr("opacity", 0.6);

        // Pulse animation
        const pulse = () => {
          pulseCircle
            .attr("r", radius)
            .attr("opacity", 0.6)
            .transition()
            .duration(2000)
            .attr("r", radius * 2)
            .attr("opacity", 0)
            .on("end", pulse);
        };
        pulse();
      }

      // Add disruption label
      if (radius > 10) {
        disruptionGroup
          .append("text")
          .attr("x", x)
          .attr("y", y - radius - 5)
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .attr("font-weight", "bold")
          .attr("fill", "var(--foreground)")
          .text(disruption.type.charAt(0).toUpperCase() + disruption.type.slice(1));
      }
    });

    // Add legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 150}, 30)`);

    const legendData = [
      { label: "Critical", color: severityColors.critical },
      { label: "High", color: severityColors.high },
      { label: "Medium", color: severityColors.medium },
      { label: "Low", color: severityColors.low },
    ];

    legendData.forEach((item, index) => {
      const legendItem = legend.append("g")
        .attr("transform", `translate(0, ${index * 20})`);

      legendItem.append("circle")
        .attr("r", 6)
        .attr("fill", item.color);

      legendItem.append("text")
        .attr("x", 15)
        .attr("y", 4)
        .attr("font-size", "12px")
        .attr("fill", "var(--foreground)")
        .text(item.label);
    });

    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "var(--foreground)")
      .text("Global Supply Chain Disruptions");

  }, [disruptions, selectedType, selectedDisruption]);

  return (
    <div className="relative w-full h-[400px] bg-muted/10 rounded-lg overflow-hidden">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 800 400"
        className="w-full h-full"
      />
      
      {selectedDisruption && (
        <div className="absolute top-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg max-w-xs">
          {(() => {
            const disruption = disruptions.find(d => d.id === selectedDisruption);
            if (!disruption) return null;
            return (
              <div>
                <h4 className="font-semibold text-foreground text-sm">
                  {disruption.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {disruption.description}
                </p>
                <div className="mt-2 space-y-1">
                  <div className="text-xs">
                    <span className="text-muted-foreground">Severity: </span>
                    <span className={`font-medium ${
                      disruption.severity === 'critical' ? 'text-supply-error' :
                      disruption.severity === 'high' ? 'text-supply-warning' :
                      disruption.severity === 'medium' ? 'text-supply-info' :
                      'text-supply-success'
                    }`}>
                      {disruption.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground">Impact: </span>
                    <span className="text-foreground font-medium">
                      ${disruption.impact.cost.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground">Probability: </span>
                    <span className="text-foreground font-medium">
                      {Math.round(disruption.probability * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
        Click disruptions for details • Scroll to zoom
      </div>
    </div>
  );
}