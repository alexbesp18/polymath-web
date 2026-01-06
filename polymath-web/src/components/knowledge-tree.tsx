'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useRouter } from 'next/navigation';
import type { DomainWithProgress } from '@/types';
import { BRANCH_COLORS } from '@/types';

interface KnowledgeTreeProps {
  domains: DomainWithProgress[];
  domainsByBranch: Record<string, DomainWithProgress[]>;
}

export function KnowledgeTree({ domains, domainsByBranch }: KnowledgeTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;
    const innerRadius = 60;
    const outerRadius = Math.min(width, height) / 2 - 40;

    // Sort branches
    const sortedBranches = Object.keys(domainsByBranch).sort();
    const branchCount = sortedBranches.length;
    const anglePerBranch = (2 * Math.PI) / branchCount;

    // Create main group
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    // Draw center circle
    g.append('circle')
      .attr('r', innerRadius)
      .attr('fill', '#f4f4f5')
      .attr('stroke', '#d4d4d8')
      .attr('stroke-width', 2);

    // Center text
    const totalRead = domains.filter(d => d.status === 'read').length;
    const coverage = Math.round((totalRead / domains.length) * 100);

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .attr('fill', '#18181b')
      .text(`${coverage}%`);

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .attr('font-size', '12px')
      .attr('fill', '#71717a')
      .text('coverage');

    // Draw branches and domains
    sortedBranches.forEach((branchId, branchIndex) => {
      const branchDomains = domainsByBranch[branchId] || [];
      const startAngle = branchIndex * anglePerBranch - Math.PI / 2;
      const endAngle = startAngle + anglePerBranch;
      const midAngle = (startAngle + endAngle) / 2;
      const branchColor = BRANCH_COLORS[branchId] || '#71717a';

      // Draw branch arc
      const arc = d3.arc()
        .innerRadius(innerRadius + 5)
        .outerRadius(innerRadius + 15)
        .startAngle(startAngle + 0.02)
        .endAngle(endAngle - 0.02);

      g.append('path')
        .attr('d', arc as unknown as string)
        .attr('fill', branchColor)
        .attr('opacity', 0.3);

      // Draw domains as dots along the branch
      const domainCount = branchDomains.length;
      const radiusStep = (outerRadius - innerRadius - 30) / Math.max(domainCount, 1);

      branchDomains.forEach((domain, domainIndex) => {
        const radius = innerRadius + 30 + domainIndex * radiusStep;
        const x = Math.cos(midAngle) * radius;
        const y = Math.sin(midAngle) * radius;

        // Determine color based on status
        let fillColor = '#d4d4d8'; // unread - gray
        let strokeColor = '#a1a1aa';
        if (domain.status === 'reading') {
          fillColor = '#3b82f6'; // blue
          strokeColor = '#2563eb';
        } else if (domain.status === 'read') {
          fillColor = '#22c55e'; // green
          strokeColor = '#16a34a';
        }

        // Draw domain dot
        const dotGroup = g.append('g')
          .attr('transform', `translate(${x}, ${y})`)
          .style('cursor', 'pointer')
          .on('click', () => {
            router.push(`/domains/${domain.domain_id}`);
          });

        // Circle
        dotGroup.append('circle')
          .attr('r', domain.is_hub ? 8 : 5)
          .attr('fill', fillColor)
          .attr('stroke', strokeColor)
          .attr('stroke-width', domain.is_hub ? 2 : 1)
          .on('mouseenter', function() {
            d3.select(this).attr('r', domain.is_hub ? 10 : 7);
          })
          .on('mouseleave', function() {
            d3.select(this).attr('r', domain.is_hub ? 8 : 5);
          });

        // Tooltip on hover
        dotGroup.append('title')
          .text(`${domain.domain_id} ${domain.name}\n${domain.status}${domain.book_title ? `\n${domain.book_title}` : ''}`);
      });

      // Branch label
      const labelRadius = outerRadius + 15;
      const labelX = Math.cos(midAngle) * labelRadius;
      const labelY = Math.sin(midAngle) * labelRadius;
      const rotation = (midAngle * 180) / Math.PI;

      // Adjust rotation for readability
      const adjustedRotation = rotation > 90 || rotation < -90
        ? rotation + 180
        : rotation;
      const textAnchor = rotation > 90 || rotation < -90 ? 'end' : 'start';

      g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', textAnchor)
        .attr('transform', `rotate(${adjustedRotation}, ${labelX}, ${labelY})`)
        .attr('font-size', '10px')
        .attr('fill', branchColor)
        .attr('font-weight', '500')
        .text(branchId);
    });

  }, [domains, domainsByBranch, router]);

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-xl border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Knowledge Tree</h2>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-zinc-300"></span>
            Unread
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            Reading
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            Read
          </span>
        </div>
      </div>
      <svg ref={svgRef} className="w-full" style={{ minHeight: '500px' }} />
      <p className="text-xs text-center text-zinc-500 mt-2">
        Click any domain to view details
      </p>
    </div>
  );
}
