"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Company } from "@/data/companies";
import { generateGraphData, GraphNode, GraphLink } from "@/utils/graphGenerator";

const ForceGraph2DNoSSR = dynamic(
    () => import("react-force-graph-2d"),
    { ssr: false }
);

export default function NexusGraph({ data }: { data: Company[] }) {
    const [graphData, setGraphData] = useState<{ nodes: GraphNode[], links: GraphLink[] }>({ nodes: [], links: [] });
    const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
    const graphRef = useRef<any>();

    useEffect(() => {
        const rawData = generateGraphData(data);

        // FIX 1: "Galaxy" Spawn Pattern
        // Instead of random noise, distribute them in a spiral.
        // This breaks the "Circle" equilibrium immediately.
        const nodes = rawData.nodes.map((node, i) => {
            const angle = 0.5 * i;
            const radius = 10 + 5 * i; // Spiral out
            return {
                ...node,
                x: radius * Math.cos(angle),
                y: radius * Math.sin(angle),
            };
        });

        setGraphData({ nodes, links: rawData.links });

        // FIX 2: Physics Engine Reconfiguration
        setTimeout(() => {
            if (graphRef.current) {
                // A. Weak Gravity (Don't pull to center so hard)
                graphRef.current.d3Force('charge').strength(-100);

                // B. Collision (Prevent overlap but allow organic clumping)
                // We need to import the force library dynamically or access it via the ref if available
                // Standard ForceGraph exposes d3 forces directly.

                // C. Longer Links for Hubs
                graphRef.current.d3Force('link').distance(40);

                // D. REHEAT: Run the simulation aggressively
                graphRef.current.d3ReheatSimulation();
            }
        }, 100);
    }, [data]);

    const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const isHovered = node === hoverNode;
        const isNeighbor = hoverNode && graphData.links.some(link =>
            (link.source.id === hoverNode.id && link.target.id === node.id) ||
            (link.target.id === hoverNode.id && link.source.id === node.id)
        );

        const isDimmed = hoverNode && !isHovered && !isNeighbor;

        // Draw Node
        const size = isHovered ? node.val * 1.5 : node.val;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size / 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = isDimmed ? "#1a1a1a" : node.color;
        ctx.fill();

        if (isHovered) {
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2 / globalScale;
            ctx.stroke();
        }

        // Label Logic (Unchanged from your preferred version)
        const shouldShowLabel = isHovered || (node.type === "person" && !hoverNode);

        if (shouldShowLabel && !isDimmed) {
            const label = node.name;
            const fontSize = (isHovered ? 14 : 10) / globalScale;
            ctx.font = `${fontSize}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const textWidth = ctx.measureText(label).width;
            ctx.fillStyle = "rgba(0,0,0,0.9)";
            ctx.fillRect(node.x - textWidth / 2 - 4, node.y + size / 2 + 4, textWidth + 8, fontSize + 6);

            ctx.fillStyle = node.color === "#ffffff" ? "#cccccc" : node.color;
            ctx.fillText(label, node.x, node.y + size / 2 + fontSize + 6);
        }
    }, [hoverNode, graphData.links]);

    return (
        <div className="border border-void-700 bg-void-800 h-[700px] w-full relative overflow-hidden group">

            {/* UI Overlay */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <h3 className="text-axiom-acid font-bold text-sm bg-void-900/80 px-2 py-1 inline-block border border-void-700">
                    NEXUS_VIEWER_v2
                </h3>
                <p className="text-axiom-muted text-xs mt-1 max-w-xs font-mono bg-void-900/50 p-1">
                    TOPOLOGY: {graphData.nodes.length} NODES<br />
                    STATUS: UNRESTRICTED
                </p>
            </div>

            {/* Manual Explode Button (Hidden unless hovered over graph) */}
            <button
                onClick={() => {
                    if (graphRef.current) {
                        graphRef.current.d3Force('charge').strength(-500);
                        graphRef.current.d3ReheatSimulation();
                        setTimeout(() => graphRef.current.d3Force('charge').strength(-100), 500);
                    }
                }}
                className="absolute bottom-4 right-4 z-20 bg-void-900 border border-void-700 text-axiom-acid px-3 py-1 text-xs font-bold hover:bg-axiom-acid hover:text-void-900 transition-all opacity-0 group-hover:opacity-100"
            >
                [ SCRAMBLE_PHYSICS ]
            </button>

            <ForceGraph2DNoSSR
                ref={graphRef}
                graphData={graphData}
                backgroundColor="#0a0a0a"
                nodeLabel=""
                nodeColor="color"
                linkColor={link => (hoverNode && (link.source.id === hoverNode.id || link.target.id === hoverNode.id)) ? "#ffffff" : "#222"}
                linkWidth={link => (hoverNode && (link.source.id === hoverNode.id || link.target.id === hoverNode.id)) ? 2 : 1}
                onNodeHover={setHoverNode}
                nodeCanvasObject={paintNode}

                // PHYSICS SETTINGS
                // Low alpha decay allows the simulation to run longer to find a non-circular shape
                d3AlphaDecay={0.01}
                d3VelocityDecay={0.4}
                warmupTicks={50}
                cooldownTicks={100}
            />
        </div>
    );
}