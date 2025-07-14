"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { ForecastDataPoint } from "@/hooks/useForecasting";

interface ForecastChartProps {
  data: ForecastDataPoint[];
  selectedProduct: string;
  selectedRegion: string;
  confidenceLevel: number;
}

export function ForecastChart({
  data,
  selectedProduct,
  selectedRegion,
  confidenceLevel,
}: ForecastChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    data: ForecastDataPoint;
  } | null>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };

    // Separate historical and forecast data
    const historicalData = data.filter(d => d.actual !== undefined);
    const forecastData = data.filter(d => d.predicted !== undefined);

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const allValues = [
      ...data.map(d => d.actual || 0),
      ...data.map(d => d.predicted || 0),
      ...data.map(d => d.upperBound || 0),
      ...data.map(d => d.lowerBound || 0),
    ].filter(v => v > 0);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(allValues) as number])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Create line generators
    const actualLine = d3
      .line<ForecastDataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.actual || 0))
      .curve(d3.curveMonotoneX);

    const predictedLine = d3
      .line<ForecastDataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.predicted || 0))
      .curve(d3.curveMonotoneX);

    const confidenceArea = d3
      .area<ForecastDataPoint>()
      .x(d => xScale(d.date))
      .y0(d => yScale(d.lowerBound || 0))
      .y1(d => yScale(d.upperBound || 0))
      .curve(d3.curveMonotoneX);

    // Add axes
    const xAxis = d3.axisBottom(xScale).tickFormat((d) => d3.timeFormat("%b %Y")(d as Date));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".0s"));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .style("fill", "var(--muted-foreground)")
      .style("font-size", "12px");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .selectAll("text")
      .style("fill", "var(--muted-foreground)")
      .style("font-size", "12px");

    // Add axis lines
    svg.selectAll(".domain, .tick line")
      .style("stroke", "var(--border)");

    // Add confidence interval area
    if (forecastData.length > 0) {
      svg
        .append("path")
        .datum(forecastData)
        .attr("fill", "var(--supply-primary)")
        .attr("fill-opacity", 0.2)
        .attr("d", confidenceArea);
    }

    // Add historical data line
    if (historicalData.length > 0) {
      svg
        .append("path")
        .datum(historicalData)
        .attr("fill", "none")
        .attr("stroke", "var(--supply-info)")
        .attr("stroke-width", 2)
        .attr("d", actualLine);
    }

    // Add forecast line
    if (forecastData.length > 0) {
      svg
        .append("path")
        .datum(forecastData)
        .attr("fill", "none")
        .attr("stroke", "var(--supply-primary)")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("d", predictedLine);
    }

    // Add data points for historical data
    svg
      .selectAll(".actual-point")
      .data(historicalData.filter((_, i) => i % 7 === 0)) // Show every 7th point
      .enter()
      .append("circle")
      .attr("class", "actual-point")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.actual || 0))
      .attr("r", 3)
      .attr("fill", "var(--supply-info)")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        setTooltip({
          x: event.pageX,
          y: event.pageY,
          data: d
        });
        d3.select(this).attr("r", 5);
      })
      .on("mouseout", function() {
        setTooltip(null);
        d3.select(this).attr("r", 3);
      });

    // Add data points for forecast data
    svg
      .selectAll(".forecast-point")
      .data(forecastData.filter((_, i) => i % 7 === 0)) // Show every 7th point
      .enter()
      .append("circle")
      .attr("class", "forecast-point")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.predicted || 0))
      .attr("r", 3)
      .attr("fill", "var(--supply-primary)")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        setTooltip({
          x: event.pageX,
          y: event.pageY,
          data: d
        });
        d3.select(this).attr("r", 5);
      })
      .on("mouseout", function() {
        setTooltip(null);
        d3.select(this).attr("r", 3);
      });

    // Add vertical line to separate historical and forecast
    const today = new Date();
    svg
      .append("line")
      .attr("x1", xScale(today))
      .attr("x2", xScale(today))
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "var(--muted-foreground)")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3")
      .attr("opacity", 0.7);

    // Add "Today" label
    svg
      .append("text")
      .attr("x", xScale(today) + 5)
      .attr("y", margin.top + 15)
      .attr("font-size", "12px")
      .attr("fill", "var(--muted-foreground)")
      .text("Today");

    // Add legend
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 150}, ${margin.top})`);

    const legendData = [
      { label: "Historical", color: "var(--supply-info)", dashed: false },
      { label: "Forecast", color: "var(--supply-primary)", dashed: true },
      { label: `${confidenceLevel}% Confidence`, color: "var(--supply-primary)", area: true },
    ];

    legendData.forEach((item, index) => {
      const legendItem = legend
        .append("g")
        .attr("transform", `translate(0, ${index * 20})`);

      if (item.area) {
        legendItem
          .append("rect")
          .attr("width", 15)
          .attr("height", 8)
          .attr("fill", item.color)
          .attr("fill-opacity", 0.2);
      } else {
        legendItem
          .append("line")
          .attr("x1", 0)
          .attr("x2", 15)
          .attr("y1", 4)
          .attr("y2", 4)
          .attr("stroke", item.color)
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", item.dashed ? "3,3" : "none");
      }

      legendItem
        .append("text")
        .attr("x", 20)
        .attr("y", 8)
        .attr("font-size", "12px")
        .attr("fill", "var(--foreground)")
        .text(item.label);
    });

    // Add chart title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "var(--foreground)")
      .text(`Demand Forecast - ${selectedProduct} (${selectedRegion})`);

  }, [data, selectedProduct, selectedRegion, confidenceLevel]);

  return (
    <div className="relative w-full h-[400px] bg-muted/10 rounded-lg overflow-hidden">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 800 400"
        className="w-full h-full"
      />
      
      {tooltip && (
        <div
          className="absolute z-10 bg-card border border-border rounded-lg p-3 shadow-lg pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
          }}
        >
          <div className="text-sm">
            <div className="font-medium text-foreground">
              {tooltip.data.date.toLocaleDateString()}
            </div>
            {tooltip.data.actual !== undefined && (
              <div className="text-supply-info">
                Actual: {tooltip.data.actual.toLocaleString()}
              </div>
            )}
            {tooltip.data.predicted !== undefined && (
              <div className="text-supply-primary">
                Predicted: {tooltip.data.predicted.toLocaleString()}
              </div>
            )}
            {tooltip.data.upperBound !== undefined && tooltip.data.lowerBound !== undefined && (
              <div className="text-muted-foreground text-xs">
                Range: {tooltip.data.lowerBound.toLocaleString()} - {tooltip.data.upperBound.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}