import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { ArrowRight } from "lucide-react";
import { boUsersService, UserStats } from "@/services/bo-users.service";

interface UserSummaryProps {
  adminCount?: number;
  instructorCount?: number;
  parentCount?: number;
  studentCount?: number;
}

const cardData = [
  {
    label: "No. of Dojo Admins",
    valueKey: "dojoOwners",
    icon: (
      // SVG 1
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_dd_10818_110547)">
          <rect x="6" y="2" width="32" height="32" rx="16" fill="#FFE5E5"/>
          <rect x="6.5" y="2.5" width="31" height="31" rx="15.5" stroke="#FCC2C3"/>
        </g>
        <path d="M21.9669 15.2998L21.0241 16.2426L19.3342 14.552L19.3337 23.3333H18.0004L18.0009 14.552L16.31 16.2426L15.3672 15.2998L18.667 12L21.9669 15.2998ZM28.6335 20.7002L25.3337 24L22.0339 20.7002L22.9767 19.7573L24.6675 21.448L24.667 12.6667H26.0003L26.0009 21.448L27.6907 19.7573L28.6335 20.7002Z" fill="#E51B1B"/>
        <defs>
          <filter id="filter0_dd_10818_110547" x="0" y="0" width="44" height="44" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_10818_110547"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10818_110547"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect2_dropShadow_10818_110547"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="4"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
            <feBlend mode="normal" in2="effect1_dropShadow_10818_110547" result="effect2_dropShadow_10818_110547"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_10818_110547" result="shape"/>
          </filter>
        </defs>
      </svg>
    ),
    percent: "0.004%",
    chart: false,
    infoIcon: false,
  },
  {
    label: "No. of Instructors",
    valueKey: "instructors",
    icon: (
      // SVG 2
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_dd_10818_110564)">
          <rect x="6" y="2" width="32" height="32" rx="16" fill="#FFE5E5"/>
          <rect x="6.5" y="2.5" width="31" height="31" rx="15.5" stroke="#FCC2C3"/>
        </g>
        <path d="M21.9669 15.2998L21.0241 16.2426L19.3342 14.552L19.3337 23.3333H18.0004L18.0009 14.552L16.31 16.2426L15.3672 15.2998L18.667 12L21.9669 15.2998ZM28.6335 20.7002L25.3337 24L22.0339 20.7002L22.9767 19.7573L24.6675 21.448L24.667 12.6667H26.0003L26.0009 21.448L27.6907 19.7573L28.6335 20.7002Z" fill="#E51B1B"/>
        <defs>
          <filter id="filter0_dd_10818_110564" x="0" y="0" width="44" height="44" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_10818_110564"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10818_110564"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect2_dropShadow_10818_110564"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="4"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
            <feBlend mode="normal" in2="effect1_dropShadow_10818_110564" result="effect2_dropShadow_10818_110564"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_10818_110564" result="shape"/>
          </filter>
        </defs>
      </svg>
    ),
    percent: "0.004%",
    chart: false,
    infoIcon: false,
  },
  {
    label: "No. of Parents",
    valueKey: "parents",
    icon: (
      // SVG 3
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_dd_10818_110564)">
          <rect x="6" y="2" width="32" height="32" rx="16" fill="#FFE5E5"/>
          <rect x="6.5" y="2.5" width="31" height="31" rx="15.5" stroke="#FCC2C3"/>
        </g>
        <path d="M21.9669 15.2998L21.0241 16.2426L19.3342 14.552L19.3337 23.3333H18.0004L18.0009 14.552L16.31 16.2426L15.3672 15.2998L18.667 12L21.9669 15.2998ZM28.6335 20.7002L25.3337 24L22.0339 20.7002L22.9767 19.7573L24.6675 21.448L24.667 12.6667H26.0003L26.0009 21.448L27.6907 19.7573L28.6335 20.7002Z" fill="#E51B1B"/>
        <defs>
          <filter id="filter0_dd_10818_110564" x="0" y="0" width="44" height="44" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_10818_110564"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10818_110564"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect2_dropShadow_10818_110564"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="4"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
            <feBlend mode="normal" in2="effect1_dropShadow_10818_110564" result="effect2_dropShadow_10818_110564"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_10818_110564" result="shape"/>
          </filter>
        </defs>
      </svg>
    ),
    percent: "0.004%",
    chart: false,
    infoIcon: false,
  },
  {
    label: "No. of Students",
    valueKey: "children",
    icon: (
      // SVG 4
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_dd_10818_110564)">
          <rect x="6" y="2" width="32" height="32" rx="16" fill="#FFE5E5"/>
          <rect x="6.5" y="2.5" width="31" height="31" rx="15.5" stroke="#FCC2C3"/>
        </g>
        <path d="M21.9669 15.2998L21.0241 16.2426L19.3342 14.552L19.3337 23.3333H18.0004L18.0009 14.552L16.31 16.2426L15.3672 15.2998L18.667 12L21.9669 15.2998ZM28.6335 20.7002L25.3337 24L22.0339 20.7002L22.9767 19.7573L24.6675 21.448L24.667 12.6667H26.0003L26.0009 21.448L27.6907 19.7573L28.6335 20.7002Z" fill="#E51B1B"/>
        <defs>
          <filter id="filter0_dd_10818_110564" x="0" y="0" width="44" height="44" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_10818_110564"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10818_110564"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect2_dropShadow_10818_110564"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="4"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
            <feBlend mode="normal" in2="effect1_dropShadow_10818_110564" result="effect2_dropShadow_10818_110564"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_10818_110564" result="shape"/>
          </filter>
        </defs>
      </svg>
    ),
    percent: "0.004%",
    chart: false,
    infoIcon: false,
  },
  // Next row
  {
    label: "Pending Profiles",
    valueKey: "card5",
    icon: (
      // SVG 5
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_dd_10818_110564)">
          <rect x="6" y="2" width="32" height="32" rx="16" fill="#FFE5E5"/>
          <rect x="6.5" y="2.5" width="31" height="31" rx="15.5" stroke="#FCC2C3"/>
        </g>
        <path d="M21.9669 15.2998L21.0241 16.2426L19.3342 14.552L19.3337 23.3333H18.0004L18.0009 14.552L16.31 16.2426L15.3672 15.2998L18.667 12L21.9669 15.2998ZM28.6335 20.7002L25.3337 24L22.0339 20.7002L22.9767 19.7573L24.6675 21.448L24.667 12.6667H26.0003L26.0009 21.448L27.6907 19.7573L28.6335 20.7002Z" fill="#E51B1B"/>
        <defs>
          <filter id="filter0_dd_10818_110564" x="0" y="0" width="44" height="44" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_10818_110564"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10818_110564"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect2_dropShadow_10818_110564"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="4"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
            <feBlend mode="normal" in2="effect1_dropShadow_10818_110564" result="effect2_dropShadow_10818_110564"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_10818_110564" result="shape"/>
          </filter>
        </defs>
      </svg>
    ),
    percent: "0.004%",
    chart: false,
    infoIcon: false,
  },
  {
    label: "Recent Profiles",
    valueKey: "card6",
    icon: (
      // SVG 6
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_dd_10818_110581)">
          <rect x="6" y="2" width="32" height="32" rx="16" fill="#FFE5E5"/>
          <rect x="6.5" y="2.5" width="31" height="31" rx="15.5" stroke="#FCC2C3"/>
        </g>
        <path d="M17.3333 12V22.6667H28V24H16V12H17.3333ZM27.5286 14.1953L28.4714 15.1381L24.6667 18.9428L22.6667 16.9433L19.8047 19.8047L18.8619 18.8619L22.6667 15.0572L24.6667 17.0567L27.5286 14.1953Z" fill="#E51B1B"/>
        <defs>
          <filter id="filter0_dd_10818_110581" x="0" y="0" width="44" height="44" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_10818_110581"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10818_110581"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect2_dropShadow_10818_110581"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="4"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
            <feBlend mode="normal" in2="effect1_dropShadow_10818_110581" result="effect2_dropShadow_10818_110581"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_10818_110581" result="shape"/>
          </filter>
        </defs>
      </svg>
    ),
    percent: "0.004%",
    chart: false,
    infoIcon: false,
  },
  {
    label: "User Activity Trends",
    valueKey: "card7",
    icon: (
      // SVG 7
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_dd_10818_110564)">
          <rect x="6" y="2" width="32" height="32" rx="16" fill="#FFE5E5"/>
          <rect x="6.5" y="2.5" width="31" height="31" rx="15.5" stroke="#FCC2C3"/>
        </g>
        <path d="M21.9669 15.2998L21.0241 16.2426L19.3342 14.552L19.3337 23.3333H18.0004L18.0009 14.552L16.31 16.2426L15.3672 15.2998L18.667 12L21.9669 15.2998ZM28.6335 20.7002L25.3337 24L22.0339 20.7002L22.9767 19.7573L24.6675 21.448L24.667 12.6667H26.0003L26.0009 21.448L27.6907 19.7573L28.6335 20.7002Z" fill="#E51B1B"/>
        <defs>
          <filter id="filter0_dd_10818_110564" x="0" y="0" width="44" height="44" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_10818_110564"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10818_110564"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect2_dropShadow_10818_110564"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="4"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
            <feBlend mode="normal" in2="effect1_dropShadow_10818_110564" result="effect2_dropShadow_10818_110564"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_10818_110564" result="shape"/>
          </filter>
        </defs>
      </svg>
    ),
    percent: "0.004%",
    chart: true,
    infoIcon: true,
  },
];

export default function UserSummary({
  adminCount,
  instructorCount,
  parentCount,
  studentCount,
}: UserSummaryProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // First try the dedicated stats endpoint
        const response = await boUsersService.getUserStats();
        
        // Check if we got actual data (not all zeros)
        const hasData = response.data && (
          response.data.dojoOwners.count > 0 ||
          response.data.instructors.count > 0 ||
          response.data.parents.count > 0 ||
          response.data.children.count > 0
        );
        
        if (hasData) {
          setStats(response.data);
        } else {
          // If stats endpoint returns zeros, calculate from a larger user list fetch
          await fetchAndCalculateStats();
        }
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
        // Fallback to calculating from user list
        await fetchAndCalculateStats();
      } finally {
        setLoading(false);
      }
    };
    
    const fetchAndCalculateStats = async () => {
      try {
        const limit = 100; // respect server max
        const first = await boUsersService.listUsers({ page: 1, limit, role: 'all' });
        const totalPages = first?.meta?.totalPages ?? Math.max(1, Math.ceil((first?.meta?.totalCount ?? 0) / limit));

        const counts = {
          dojoOwners: (first.data || []).filter((u: any) => u.role === 'dojo_owner').length,
          instructors: (first.data || []).filter((u: any) => u.role === 'instructor').length,
          parents: (first.data || []).filter((u: any) => u.role === 'parent').length,
          children: (first.data || []).filter((u: any) => u.role === 'child').length,
        };

        if (totalPages > 1) {
          for (let p = 2; p <= totalPages; p++) {
            try {
              const pageResp = await boUsersService.listUsers({ page: p, limit, role: 'all' });
              const users = pageResp.data || [];
              counts.dojoOwners += users.filter((u: any) => u.role === 'dojo_owner').length;
              counts.instructors += users.filter((u: any) => u.role === 'instructor').length;
              counts.parents += users.filter((u: any) => u.role === 'parent').length;
              counts.children += users.filter((u: any) => u.role === 'child').length;
            } catch (e) {
              console.warn('Failed fetching users page', p, e);
            }
          }
        }

        setStats({
          dojoOwners: { count: counts.dojoOwners, percentageChange: 0 },
          instructors: { count: counts.instructors, percentageChange: 0 },
          parents: { count: counts.parents, percentageChange: 0 },
          children: { count: counts.children, percentageChange: 0 },
        });
      } catch (error) {
        console.error('Failed to calculate stats from user list:', error);
      }
    };
    
    fetchStats();
  }, []);

  // Merge values from props or fetched data
  const values: Record<string, number> = {
    dojoOwners: stats?.dojoOwners.count ?? adminCount ?? 0,
    instructors: stats?.instructors.count ?? instructorCount ?? 0,
    parents: stats?.parents.count ?? parentCount ?? 0,
    children: stats?.children.count ?? studentCount ?? 0,
  };
  // Percentage values: prefer backend percentageChange when available
  const percentValues: Record<string, string> = {
    dojoOwners: stats?.dojoOwners?.percentageChange !== undefined ? `${stats.dojoOwners.percentageChange}%` : cardData.find(c => c.valueKey === 'dojoOwners')?.percent ?? '0%',
    instructors: stats?.instructors?.percentageChange !== undefined ? `${stats.instructors.percentageChange}%` : cardData.find(c => c.valueKey === 'instructors')?.percent ?? '0%',
    parents: stats?.parents?.percentageChange !== undefined ? `${stats.parents.percentageChange}%` : cardData.find(c => c.valueKey === 'parents')?.percent ?? '0%',
    children: stats?.children?.percentageChange !== undefined ? `${stats.children.percentageChange}%` : cardData.find(c => c.valueKey === 'children')?.percent ?? '0%',
  };
// Modal state and ref for outside click
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!showModal) return;
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  return (
   <div className="gap-4 rounded-xl">
      {/* Row 1: 4 role stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {cardData.slice(0, 4).map(({ label, valueKey, icon }) => (
          <div
            key={label}
            className="bg-white flex flex-col justify-between rounded-lg p-4 h-[130px] shadow-sm w-full cursor-pointer relative"
            onClick={() => router.push(`/dashboard/users/Summary/${valueKey}`)}
            style={{ minWidth: 0 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">{icon}</div>
              <button
                className="flex items-center gap-1 text-xs text-gray-500 font-medium hover:underline focus:outline-none"
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  router.push(`/dashboard/users/Summary/${valueKey}`);
                }}
              >
                View all <ArrowRight size={13} />
              </button>
            </div>
            <div className="flex flex-col flex-1 justify-center">
              <div className="text-lg text-[#0F1828] font-semibold mb-1">
                {loading ? <span className="inline-block w-8 h-4 bg-gray-100 rounded animate-pulse" /> : (values[valueKey] ?? 0)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{label}</span>
                <div className="flex items-center bg-[#E6F4EA] text-[#15803D] rounded px-1.5 py-0.5 ml-2 text-[11px] font-semibold">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 11V3M7 3L3 7M7 3L11 7" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span className="ml-1">{percentValues[valueKey]}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Pending Profiles, Recent Profiles, User Activity Trends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Pending Profiles */}
        <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            {cardData[4].icon}
            <span className="text-xs text-gray-400 font-medium">Pending</span>
          </div>
          <div className="text-lg font-semibold text-[#0F1828]">
            {loading ? <span className="inline-block w-8 h-4 bg-gray-100 rounded animate-pulse" /> : 0}
          </div>
          <span className="text-xs text-gray-500">Pending Profiles</span>
        </div>

        {/* Recent Profiles */}
        <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            {cardData[5].icon}
            <span className="text-xs text-gray-400 font-medium">Recent</span>
          </div>
          <div className="text-lg font-semibold text-[#0F1828]">
            {loading ? <span className="inline-block w-8 h-4 bg-gray-100 rounded animate-pulse" /> : (
              stats
                ? stats.dojoOwners.count + stats.instructors.count + stats.parents.count + stats.children.count
                : Object.values(values).reduce((a, b) => a + b, 0)
            )}
          </div>
          <span className="text-xs text-gray-500">Recent Profiles</span>
        </div>

        {/* User Activity Trends */}
        <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            {cardData[6].icon}
            <span className="text-xs text-gray-400 font-medium">Trends</span>
          </div>
          <div className="text-xs text-gray-600 font-medium mb-1">User Activity Trends</div>
          <svg viewBox="0 0 120 40" className="w-full h-10" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#E51B1B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="0,35 20,28 40,32 60,18 80,22 100,10 120,15"
            />
            <polyline
              fill="rgba(229,27,27,0.08)"
              stroke="none"
              points="0,35 20,28 40,32 60,18 80,22 100,10 120,15 120,40 0,40"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}