"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { RouteNode, RouteEdge } from "@/hooks/useRouting";

interface RouteVisualizationProps {
  nodes: RouteNode[];
  edges: RouteEdge[];
  optimalRoute?: string[];
  sourceNode?: string | null;
  targetNode?: string | null;
}

export function RouteVisualization({
  nodes,
  edges,
  optimalRoute,
  sourceNode,
  targetNode,
}: RouteVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Create scales for positioning
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(nodes, (d) => d.location.lng) as [number, number])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(nodes, (d) => d.location.lat) as [number, number])
      .range([height - margin.bottom, margin.top]);

    // Create main group
    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Draw edges
    const edgeGroup = g.append("g").attr("class", "edges");
    
    edges.forEach((edge) => {
      const sourceNodeData = nodes.find((n) => n.id === edge.from);
      const targetNodeData = nodes.find((n) => n.id === edge.to);
      
      if (!sourceNodeData || !targetNodeData) return;

      const isOptimalRoute = optimalRoute && 
        optimalRoute.includes(edge.from) && 
        optimalRoute.includes(edge.to) &&
        Math.abs(optimalRoute.indexOf(edge.from) - optimalRoute.indexOf(edge.to)) === 1;

      const line = edgeGroup
        .append("line")
        .attr("x1", xScale(sourceNodeData.location.lng))
        .attr("y1", yScale(sourceNodeData.location.lat))
        .attr("x2", xScale(targetNodeData.location.lng))
        .attr("y2", yScale(targetNodeData.location.lat))
        .attr("stroke", isOptimalRoute ? "#3b82f6" : "#6b7280")
        .attr("stroke-width", isOptimalRoute ? 3 : 1)
        .attr("stroke-opacity", isOptimalRoute ? 1 : 0.6)
        .attr("stroke-dasharray", edge.transportMode === "air" ? "5,5" : "none");

      // Add edge labels
      const midX = (xScale(sourceNodeData.location.lng) + xScale(targetNodeData.location.lng)) / 2;
      const midY = (yScale(sourceNodeData.location.lat) + yScale(targetNodeData.location.lat)) / 2;

      if (isOptimalRoute) {
        edgeGroup
          .append("text")
          .attr("x", midX)
          .attr("y", midY - 5)
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .attr("fill", "#1f2937")
          .attr("font-weight", "bold")
          .text(`$${edge.cost} | ${edge.time}d`);
      }
    });

    // Draw nodes
    const nodeGroup = g.append("g").attr("class", "nodes");

    nodes.forEach((node) => {
      const isSource = node.id === sourceNode;
      const isTarget = node.id === targetNode;
      const isInRoute = optimalRoute?.includes(node.id);
      const isSelected = node.id === selectedNode;

      // Node color based on type and state
      let nodeColor = "#6b7280";
      if (isSource) nodeColor = "#10b981";
      else if (isTarget) nodeColor = "#ef4444";
      else if (isInRoute) nodeColor = "#3b82f6";
      else {
        switch (node.type) {
          case "supplier": nodeColor = "#8b5cf6"; break;
          case "warehouse": nodeColor = "#f59e0b"; break;
          case "distribution": nodeColor = "#06b6d4"; break;
          case "port": nodeColor = "#84cc16"; break;
          case "customer": nodeColor = "#ec4899"; break;
        }
      }

      // Draw node circle
      const circle = nodeGroup
        .append("circle")
        .attr("cx", xScale(node.location.lng))
        .attr("cy", yScale(node.location.lat))
        .attr("r", isSelected ? 12 : (isSource || isTarget || isInRoute) ? 10 : 8)
        .attr("fill", nodeColor)
        .attr("stroke", isSelected ? "#1f2937" : "#ffffff")
        .attr("stroke-width", isSelected ? 3 : 2)
        .attr("cursor", "pointer")
        .on("click", () => {
          setSelectedNode(selectedNode === node.id ? null : node.id);
        })
        .on("mouseover", function() {
          d3.select(this).attr("r", 12);
        })
        .on("mouseout", function() {
          d3.select(this).attr("r", isSelected ? 12 : (isSource || isTarget || isInRoute) ? 10 : 8);
        });

      // Add node labels
      nodeGroup
        .append("text")
        .attr("x", xScale(node.location.lng))
        .attr("y", yScale(node.location.lat) + 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "#1f2937")
        .text(node.name.split(" ")[0]); // Show first word only

      // Add type icon
      const iconSize = 6;
      let iconSymbol = "";
      switch (node.type) {
        case "supplier": iconSymbol = "S"; break;
        case "warehouse": iconSymbol = "W"; break;
        case "distribution": iconSymbol = "D"; break;
        case "port": iconSymbol = "P"; break;
        case "customer": iconSymbol = "C"; break;
      }

      nodeGroup
        .append("text")
        .attr("x", xScale(node.location.lng))
        .attr("y", yScale(node.location.lat) + 4)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .attr("fill", "#ffffff")
        .text(iconSymbol);
    });

    // Add legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 150}, 20)`);

    const legendData = [
      { label: "Source", color: "#10b981" },
      { label: "Target", color: "#ef4444" },
      { label: "Optimal Route", color: "#3b82f6" },
      { label: "Supplier", color: "#8b5cf6" },
      { label: "Warehouse", color: "#f59e0b" },
      { label: "Port", color: "#84cc16" },
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
        .attr("fill", "#374151")
        .text(item.label);
    });

  }, [nodes, edges, optimalRoute, sourceNode, targetNode, selectedNode]);

  return (
    <div className="w-full h-[500px] bg-muted/20 rounded-lg overflow-hidden">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 800 500"
        className="w-full h-full"
      />
      {selectedNode && (
        <div className="absolute top-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg">
          {(() => {
            const node = nodes.find(n => n.id === selectedNode);
            if (!node) return null;
            return (
              <div>
                <h4 className="font-semibold text-foreground">{node.name}</h4>
                <p className="text-sm text-muted-foreground capitalize">{node.type}</p>
                {node.capacity && (
                  <p className="text-sm text-muted-foreground">
                    Capacity: {node.capacity.toLocaleString()}
                  </p>
                )}
                {node.currentStock && (
                  <p className="text-sm text-muted-foreground">
                    Stock: {node.currentStock.toLocaleString()}
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}