'use client';
import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronLeft, FiChevronRight, FiChevronUp } from "react-icons/fi";
import { ArrowUpIcon, ArrowRightIcon, ReadMoreIcon, IconA, IconB, IconC, IconD, IconE, IconF, IconG, IconH, IconI } from './dashboardData.js';
import { boDashboardService, DashboardStats } from '@/services/bo-dashboard.service';
import { boUsersService } from '@/services/bo-users.service';
import { formatDateCustom } from '@/lib/dateFormatter';

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const YEARS = Array.from({ length: 20 }, (_, i) => 2016 + i);

const METRIC_LABELS = [
  'Active Dojos',
  'Active Subscriptions',
  'Active Classes',
  'Revenue',
  'Avg. Revenue Per Dojo',
  'Gross Transaction Vol.',
  'Completed Onboarding',
  'Incomplete Onboarding',
  'Dojo Engagement Index'
];

function chunkArray<T>(arr: T[], chunkSizes: number[]) {
  let result = [];
  let i = 0;
  for (let size of chunkSizes) {
    result.push(arr.slice(i, i + size));
    i += size;
  }
  return result;
}

function getIcon(label: string) {
  switch (label) {
    case 'Active Dojos': return <IconA />;
    case 'Active Subscriptions': return <IconB />;
    case 'Active Classes': return <IconD />;
    case 'Revenue': return <IconE />;
    case 'Avg. Revenue Per Dojo': return <IconE />;
    case 'Gross Transaction Vol.': return <IconF />;
    case 'Completed Onboarding': return <IconG />;
    case 'Incomplete Onboarding': return <IconH />;
    case 'Dojo Engagement Index': return <IconI />;
    default: return <IconA />;
  }
}
// Transform API data into stats array for cards
function buildStatsFromApiData(apiData: DashboardStats | null, totalUsers: number = 0) {
  if (!apiData) return METRIC_LABELS.map(label => ({
    label,
    value: 0,
    icon: getIcon(label),
    percentage: "0%"
  }));

  return [
    { label: "Active Dojos", value: apiData.activeDojos ?? 0, icon: getIcon("Active Dojos"), percentage: "0%" },
    { label: "Active Subscriptions", value: apiData.activeSubscriptions ?? 0, icon: getIcon("Active Subscriptions"), percentage: "0%" },
    { label: "Active Classes", value: apiData.activeClasses ?? 0, icon: getIcon("Active Classes"), percentage: "0%" },
    { label: "Revenue", value: apiData.totalRevenue ?? "0", icon: getIcon("Revenue"), percentage: "0%" },
    { label: "Avg. Revenue Per Dojo", value: apiData.avgRevenuePerDojo ?? "0", icon: getIcon("Avg. Revenue Per Dojo"), percentage: "0%" },
    { label: "Gross Transaction Vol.", value: apiData.grossTransactionVolume ?? "0", icon: getIcon("Gross Transaction Vol."), percentage: "0%" },
    { label: "Completed Onboarding", value: apiData.completedOnboarding ?? 0, icon: getIcon("Completed Onboarding"), percentage: "0%" },
    { label: "Incomplete Onboarding", value: apiData.incompleteOnboarding ?? 0, icon: getIcon("Incomplete Onboarding"), percentage: "0%" },
    { label: "Dojo Engagement Index", value: apiData.dojoEngagementIndex ?? "0", icon: getIcon("Dojo Engagement Index"), percentage: "0%" }
  ];
}

export default function DashboardSummary() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'Today' | 'This week' | 'This month' | 'All time' | 'Custom date'>('Today');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMonthYearModal, setShowMonthYearModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [highlightRange, setHighlightRange] = useState<{ start: number | null; end: number | null }>({ start: null, end: null });

  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [monthPage, setMonthPage] = useState(0);
  const [yearPage, setYearPage] = useState(0);
  const [tempMonth, setTempMonth] = useState(calendarMonth);
  const [tempYear, setTempYear] = useState(calendarYear);

  // API-driven dashboard data
  const [apiData, setApiData] = useState<any>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userStats, setUserStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch dashboard metrics and user stats from API
  useEffect(() => {
    setLoading(true);
    
    let dashboardComplete = false;
    let usersComplete = false;

    const markComplete = () => {
      if (dashboardComplete && usersComplete) {
        setLoading(false);
      }
    };

    // Fetch dashboard stats
    boDashboardService.getDashboardStats()
      .then((dashResponse) => {
        if (dashResponse && dashResponse.data) {
          setApiData(dashResponse.data);
        } else {
          setApiData(null);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch dashboard stats:', error);
        setApiData(null);
      })
      .finally(() => {
        dashboardComplete = true;
        markComplete();
      });

    // Fetch user list for calculating stats (respect server limits)
    (async () => {
      const limit = 100;
      try {
        const first = await boUsersService.listUsers({ page: 1, limit, role: 'all', sortBy: 'createdAt', sortOrder: 'desc' });
        console.log('listUsers first page response:', first);

        const total = first?.meta?.totalCount ?? 0;
        const totalPages = first?.meta?.totalPages ?? Math.max(1, Math.ceil((first?.meta?.totalCount ?? 0) / limit));
        setTotalUsers(total);

        // Start counts from the first page
        const counts = {
          dojoOwners: (first.data || []).filter((u: any) => u.role === 'dojo_owner').length,
          instructors: (first.data || []).filter((u: any) => u.role === 'instructor').length,
          parents: (first.data || []).filter((u: any) => u.role === 'parent').length,
          children: (first.data || []).filter((u: any) => u.role === 'child').length,
        };

        // If there are more pages, fetch them sequentially and aggregate counts
        if (totalPages > 1) {
          for (let p = 2; p <= totalPages; p++) {
            try {
              const pageResp = await boUsersService.listUsers({ page: p, limit, role: 'all', sortBy: 'createdAt', sortOrder: 'desc' });
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

        setUserStats([
          { label: 'Dojo Admins', value: counts.dojoOwners, color: '#F09898' },
          { label: 'Instructors', value: counts.instructors, color: '#E51B1B' },
          { label: 'Parents', value: counts.parents, color: '#E51B1B' },
          { label: 'Students', value: counts.children, color: '#E51B1B' }
        ]);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setTotalUsers(0);
        setUserStats([
          { label: 'Dojo Admins', value: 0, color: '#F09898' },
          { label: 'Instructors', value: 0, color: '#E51B1B' },
          { label: 'Parents', value: 0, color: '#E51B1B' },
          { label: 'Students', value: 0, color: '#E51B1B' }
        ]);
      } finally {
        usersComplete = true;
        markComplete();
      }
    })();
  }, []);

  // Calendar logic
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();
  const prevMonthDays = Array.from({ length: firstDayOfWeek }, (_, i) => ({
    day: new Date(calendarYear, calendarMonth, -firstDayOfWeek + i + 1).getDate(),
    isPrev: true
  }));
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    isPrev: false
  }));
  const calendarDays = [...prevMonthDays, ...monthDays];

  // Build stats for cards from API data
  const stats = buildStatsFromApiData(apiData, totalUsers);
  const cardRows = chunkArray(stats, [3, 3, 3]);

  // Dummy dojos for Top Dojo Revenue 
  type DojoType = {
    dojoName?: string;
    name?: string;
    revenue?: number | string;
    percentage?: string | number;
    [key: string]: any;
  };

  const [dojosState, setDojosState] = useState<DojoType[]>([]);

  // Fetch top dojos revenue separately and keep only first 5
  useEffect(() => {
    let mounted = true;
    boDashboardService.getDojosRevenue({ page: 1, limit: 10 })
      .then((resp) => {
        if (!mounted) return;
        const list = Array.isArray(resp?.data) ? resp.data : [];
        const mapped = list.map((d: any) => {
          const raw = d.revenue ?? d.amount ?? d.total ?? d.value ?? 0;
          const revenueNum = typeof raw === 'number' ? raw : Number(String(raw).replace(/[^0-9.-]+/g, '')) || 0;
          const perc = d.percentage ?? d.pct ?? d.percent ?? d.perc ?? '0%';
          return {
            dojoName: d.dojoName || d.name || d.dojo_name || d.title || 'Unknown Dojo',
            revenue: revenueNum,
            percentage: typeof perc === 'number' ? `${perc}%` : String(perc)
          };
        });
        setDojosState(mapped.slice(0, 5));
      })
      .catch((e) => {
        console.warn('Failed to fetch dojos revenue:', e);
        // fallback to any apiData.dojos if present
        if (Array.isArray(apiData?.dojos)) {
          const mapped = apiData.dojos.map((d: any) => {
            const raw = d.revenue ?? d.amount ?? d.total ?? 0;
            const revenueNum = typeof raw === 'number' ? raw : Number(String(raw).replace(/[^0-9.-]+/g, '')) || 0;
            return {
              dojoName: d.dojoName || d.name || d.dojo_name || 'Unknown Dojo',
              revenue: revenueNum,
              percentage: d.percentage ?? '0%'
            };
          });
          setDojosState(mapped.slice(0, 5));
        }
      });
    return () => { mounted = false; };
  }, [apiData]);

  const formatCurrency = (n: number) => {
    try {
      return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    } catch {
      return String(n);
    }
  };

  const filterOptions = [
    'Today', 'This week', 'This month', 'All time', 'Custom date'
  ] as const;




  // Month/Year modal logic
  const monthsPerPage = 4;
  const yearsPerPage = 5;
  const monthStart = monthPage * monthsPerPage;
  const monthEnd = monthStart + monthsPerPage;
  const yearStart = yearPage * yearsPerPage;
  const yearEnd = yearStart + yearsPerPage;

  // Helper for green badge
  const GreenBadge = ({ value }: { value: string | number }) => (
    <span className="ml-auto rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
      {value ?? "0%"}
    </span>
  );
     // Modal for first card
  const FirstCardModal = () => (
  <>
    <div
      className="fixed inset-0 z-40"
      style={{ background: 'transparent' }}
      onClick={() => setOpenModal(null)}
    />
    <div
      className="absolute z-50 mt-2 right-0 bg-white border border-gray-300 rounded-md p-3 w-56"
      style={{ top: '40px', boxShadow: 'none' }}
    >
      <div className="text-gray-500 text-xs mb-3">Info</div>
      <div className="flex items-center justify-between mb-2 text-gray-600 text-sm">
        <span className="flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-[#E51B1B] mr-2"></span>
           Total Dojos
        </span>
        <span className="font-bold">{apiData?.total_dojos ?? 0}</span>
      </div>
      <div className="flex items-center justify-between mb-2 text-gray-600 text-sm">
        <span className="flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-[#E51B1B] mr-2"></span>
          Active Dojos
        </span>
        <span className="font-bold">{apiData?.active_dojos ?? 0}</span>
      </div>
      <div className="flex items-center justify-between mb-2 text-gray-600 text-sm">
        <span className="flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-[#E51B1B] mr-2"></span>
          Inactive Dojos
        </span>
        <span className="font-bold">{apiData?.inactive_dojos ?? 0}</span>
      </div>
     </div>
  </>
);




// Modal for 7th card
const SeventhCardModal = () => (
  <>
    <div
      className="fixed inset-0 z-40"
      style={{ background: 'transparent' }}
      onClick={() => setOpenModal(null)}
    />
    <div
      className="absolute z-50 mt-2 right-0 bg-white border border-gray-300 rounded-md p-3 w-56"
      style={{ top: '40px', boxShadow: 'none' }}
    >
      <div className="text-gray-500 text-xs mb-3">
        Total earnings across platform (subscriptions + other payments)
      </div>
    </div>
  </>
);

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <h1 className="text-2xl text-[#0F1828] font-semibold">Dashboard</h1>
        <div className="flex flex-wrap gap-2 sm:justify-end relative">
          {filterOptions.map((label) => (
            <button
              key={label}
              className={`px-4 py-1 border rounded-full whitespace-nowrap flex items-center gap-1 cursor-pointer
                ${activeFilter === label
                  ? 'bg-red-100 text-red-600 border-red-300'
                  : 'bg-white text-gray-600 border-gray-300'
                }`}
              onClick={() => {
                setActiveFilter(label);
                if (label === 'Custom date') setShowCalendar(true);
                else setShowCalendar(false);
              }}
            >
              {label}
              {label === 'Custom date' && (
                <FiChevronDown className="text-gray-500 text-lg" />
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Calendar Modal */}
      {showCalendar && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.03)' }}
            onClick={() => setShowCalendar(false)}
          />
          <div
            className="absolute z-50 mt-2 right-8 bg-white rounded-xl p-6 shadow-2xl border border-gray-300 w-[340px] h-[350px] flex flex-col"
            style={{ minWidth: 280, paddingRight: 16 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-black font-semibold text-lg cursor-pointer"
                  onClick={() => {
                    setShowMonthYearModal(true);
                    setShowCalendar(false);
                  }}
                >
                  {MONTHS[calendarMonth]} {calendarYear}
                </span>
                <button
                  className="ml-1 cursor-pointer"
                  onClick={() => {
                    setShowMonthYearModal(true);
                    setShowCalendar(false);
                  }}
                >
                  <FiChevronDown className="text-[#E51B1B] text-xl" />
                </button>
              </div>
              <div className="flex gap-4 ml-2">
                <button
                  className="cursor-pointer"
                  onClick={() => setCalendarMonth(m => m === 0 ? 11 : m - 1)}
                >
                  <FiChevronLeft className="text-[#E51B1B] text-xl" />
                </button>
                <button
                  className="cursor-pointer"
                  onClick={() => setCalendarMonth(m => m === 11 ? 0 : m + 1)}
                >
                  <FiChevronRight className="text-[#E51B1B] text-xl" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 text-xs text-gray-400 mb-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2 flex-1">
              {calendarDays.map(({ day, isPrev }, idx) => {
                let highlightClass = "";
                if (
                  !isPrev &&
                  highlightRange.start !== null &&
                  highlightRange.end !== null &&
                  day >= Math.min(highlightRange.start, highlightRange.end) &&
                  day <= Math.max(highlightRange.start, highlightRange.end)
                ) {
                  if (day === highlightRange.start || day === highlightRange.end) {
                    highlightClass = "bg-red-100 border border-red-500 text-black";
                  } else {
                    highlightClass = "bg-red-100 text-black";
                  }
                } else if (isPrev) {
                  highlightClass = "bg-gray-100 text-gray-300";
                } else {
                  highlightClass = "bg-white text-gray-700";
                }
                return (
                  <button
                    key={idx}
                    className={`py-2 rounded text-sm w-8 h-8 ${highlightClass} hover:border hover:border-red-500 cursor-pointer`}
                    disabled={isPrev}
                    onClick={() => {
                      if (!isPrev) {
                        if (highlightRange.start === null || (highlightRange.start !== null && highlightRange.end !== null)) {
                          setHighlightRange({ start: day, end: null });
                        } else {
                          setHighlightRange({ start: highlightRange.start, end: day });
                        }
                        setSelectedDate(new Date(calendarYear, calendarMonth, day));
                        setActiveFilter('Custom date');
                        setShowCalendar(false);
                      }
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Month/Year Picker Modal */}
      {showMonthYearModal && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.03)' }}
            onClick={() => {
              setShowMonthYearModal(false);
              setShowCalendar(true);
            }}
          />
          <div className="absolute z-50 mt-2 right-8 bg-white rounded-xl p-6 shadow-2xl border border-gray-300 w-[400px] flex flex-col" style={{ minWidth: 340 }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-black font-semibold text-lg">{MONTHS[tempMonth]} {tempYear}</span>
                <FiChevronUp className="text-[#E51B1B] text-xl ml-2" />
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 font-semibold">Month</span>
              <div className="flex gap-4">
                <button
                  className="cursor-pointer"
                  onClick={() => setMonthPage(p => Math.max(0, p - 1))}
                  disabled={monthPage === 0}
                >
                  <FiChevronLeft className="text-[#E51B1B] text-xl" />
                </button>
                <button
                  className="cursor-pointer"
                  onClick={() => setMonthPage(p => p < 2 ? p + 1 : p)}
                  disabled={monthPage >= 2}
                >
                  <FiChevronRight className="text-[#E51B1B] text-xl" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {MONTHS.slice(monthStart, monthEnd).map((m, idx) => {
                const isActive = tempMonth === monthStart + idx;
                return (
                  <button
                    key={m}
                    className={`py-2 px-2 rounded-md border text-xs font-semibold cursor-pointer
                      ${isActive ? 'bg-red-100 border-red-500 text-red-700' : 'bg-gray-50 border-gray-300 text-gray-700'}`}
                    onClick={() => setTempMonth(monthStart + idx)}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 font-semibold">Year</span>
              <div className="flex gap-4">
                <button
                  className="cursor-pointer"
                  onClick={() => setYearPage(p => Math.max(0, p - 1))}
                  disabled={yearPage === 0}
                >
                  <FiChevronLeft className="text-[#E51B1B] text-xl" />
                </button>
                <button
                  className="cursor-pointer"
                  onClick={() => setYearPage(p => yearEnd < YEARS.length ? p + 1 : p)}
                  disabled={yearEnd >= YEARS.length}
                >
                  <FiChevronRight className="text-[#E51B1B] text-xl" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {YEARS.slice(yearStart, yearEnd).map((y) => (
                <button
                  key={y}
                  className={`py-2 px-2 rounded-md border text-xs font-semibold cursor-pointer
                    ${tempYear === y ? 'bg-red-100 border-red-500 text-red-700' : 'bg-gray-50 border-gray-300 text-gray-700'}`}
                  onClick={() => setTempYear(y)}
                >
                  {y}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="px-4 py-1 rounded-md bg-white text-gray-600 border-none cursor-pointer"
                onClick={() => {
                  setShowMonthYearModal(false);
                  setShowCalendar(true);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 rounded-md bg-[#F53033] text-white border-[#F53033] cursor-pointer"
                onClick={() => {
                  setCalendarMonth(tempMonth);
                  setCalendarYear(tempYear);
                  setShowMonthYearModal(false);
                  setShowCalendar(true);
                }}
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}

      {/* Metrics Section */}
      <div className="bg-[#FFFFFF] p-4 gap-4 rounded-xl" style={{ border: '1px solid #ECE4E4' }}>
        <h1 className="text-base font-semibold mb-4 text-[#475367]">Metrics</h1>
        
          <>
            {/* First row: 4 cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  {cardRows[0].map((card, idx) => (
    <div
      key={card.label}
      className="bg-gray-50 flex flex-col rounded-lg p-4 h-[130px] shadow-sm relative"
    >
      <div className="flex items-center mb-2">
        <span style={{ border: "1px solid #FCC2C3" }} className="h-8 w-8 rounded-full bg-[#FFE5E5] flex items-center justify-center">
          {card.icon}
        </span>
      </div>
      <div className="text-lg text-[#0F1828] font-semibold mb-1">{card.value ?? 0}</div>
      <div className="flex items-center w-full">
        <span className="text-xs text-gray-600 truncate">{card.label}</span>
        <GreenBadge value={card.percentage ?? "0%"} />
      </div>
                  {/* Card 3 (Active Classes): Show "View All", Card 1 (Active Dojos): info modal */}
                 {idx === 2 ? (
        <button
          className="absolute top-4 right-4 flex items-center gap-1 text-gray-500 font-semibold cursor-pointer bg-transparent border-none"
          style={{ textDecoration: 'none', fontSize: '0.85rem' }}
          onClick={() => alert('View all Active Classes')}
        >
          View all <ArrowRightIcon />
        </button>
      ) : idx === 0 ? (
        <>
          <button
            className="absolute top-4 right-4 cursor-pointer"
            onClick={() => setOpenModal(card.label)}
            aria-label="Open details"
          >
            <ReadMoreIcon />
          </button>
          {openModal === card.label && <FirstCardModal />}
        </>
) : (
        <button
          className="absolute top-4 right-4 cursor-pointer text-gray-400"
          aria-label="Info"
          tabIndex={-1}
          style={{ pointerEvents: 'none' }}
        >
<ReadMoreIcon />
        </button>
      )}
    </div>
  ))}
</div>
 
   {/* Cards 5, 6, 7 as full width on their own rows */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full">
  {cardRows[1].map((card, idx) => (
    <div
      key={card.label}
      className="bg-gray-50 flex flex-col rounded-lg p-4 h-[130px] shadow-sm relative w-full"
    >
      <div className="flex items-center mb-2">
        <span style={{ border: "1px solid #FCC2C3" }} className="h-8 w-8 rounded-full bg-[#FFE5E5] flex items-center justify-center">
          {card.icon}
        </span>
      </div>
      <div className="text-lg text-[#0F1828] font-semibold mb-1">{card.value ?? 0}</div>
      <div className="flex items-center w-full">
        <span className="text-xs text-gray-600 truncate">{card.label}</span>
        <GreenBadge value={card.percentage ?? "0%"} />
      </div>
      {/* Only card 7 (idx === 2) opens modal */}
      {idx === 2 ? (
        <>
<button
  className="absolute top-4 right-4 cursor-pointer"
  onClick={() => setOpenModal(card.label)}
  aria-label="Open details"
>
  <ReadMoreIcon />
</button>
{openModal === card.label && <SeventhCardModal />}
        </>
      ) : (
        <button
          className="absolute top-4 right-4 cursor-pointer text-gray-400"
          aria-label="Info"
          tabIndex={-1}
          style={{ pointerEvents: 'none' }}
        >
          <ReadMoreIcon />
        </button>
      )}
</div>
  ))}
</div>
       {/* Third row: 3 cards, full width */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full">
  {cardRows[2].map(({ label, value, icon, percentage }, idx) => (
    <div key={label} className="bg-gray-50 flex flex-col rounded-lg p-4 h-[130px] shadow-sm relative w-full">
      <div className="flex items-center mb-2">
        <span style={{ border: "1px solid #FCC2C3" }} className="h-8 w-8 rounded-full bg-[#FFE5E5] flex items-center justify-center">
          {icon}
        </span>
      </div>
      <div className="text-lg text-[#0F1828] font-semibold mb-2">{value ?? 0}</div>
      <div className="flex items-center justify-between mt-auto w-full">
        <span className="text-xs text-gray-600">{label}</span>
        <GreenBadge value={percentage ?? "0%"} />
      </div>
      {/* Info icon, not clickable, no modal */}
      <button
        className="absolute top-4 right-4 cursor-pointer text-gray-400"
        aria-label="Info"
        tabIndex={-1}
        style={{ pointerEvents: 'none' }}
      >
        <ReadMoreIcon />
      </button>
    </div>
  ))}
</div>
            {/* Two-column container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Total Users */}
              <div className="flex flex-col justify-between bg-gray-50 rounded-lg p-6 h-[370px]">
                <div>
                  <h2 className="text-base font-semibold text-[#475367] mb-1">Total Users</h2>
                  <div className="text-2xl font-bold text-[#0F1828] mb-8">
                    {totalUsers ? Number(totalUsers).toLocaleString() : "0"}
                  </div>
                  {/* Add extra space before user profiles */}
                  <div className="mb-6"></div>
                  <div className="space-y-4">
                    {userStats.map((user) => (
                      <div key={user.label} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span
                            className="inline-block w-3 h-3 rounded-full mr-3"
                            style={{ background: user.color ?? "#EEE" }}
                          ></span>
                          <span className="text-sm text-[#475367]">{user.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-[#0F1828]">
                          {typeof user.value === "number" ? user.value.toLocaleString() : "0"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="mt-6 text-[#E51B1B] font-semibold hover:underline focus:outline-none cursor-pointer">
                  View Details
                </button>
              </div>
              {/* Right: Top Dojo Revenue */}
              <div className="flex flex-col justify-between bg-gray-50 rounded-lg p-6 h-[370px]">
                <div>
                  <h2 className="text-base font-semibold text-[#475367] mb-4">Top Dojo Revenue</h2>
                  <div className="space-y-4">
                    {(dojosState.length > 0 ? dojosState : [{ dojoName: "Dojo A", revenue:0 }, { dojoName: "Dojo B", revenue:0 }, { dojoName: "Dojo C", revenue:0 }]).slice(0, 5).map((dojo: any, idx: number) => (
                      <div key={dojo.dojoName || dojo.name || idx} className="flex items-center justify-between">
                        <span className="text-sm text-[#0F1828] font-medium">{dojo.dojoName || dojo.name}</span>
                        <span className="text-sm text-[#0F1828] font-semibold">£{formatCurrency(Number(dojo.revenue || 0))}</span>
                        <span className="text-xs text-gray-400 font-semibold">{dojo.percentage ?? "0%"}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="mt-6 text-[#E51B1B] font-semibold hover:underline focus:outline-none cursor-pointer">
                  View More
                </button>
              </div>
            </div>
          </>
      </div>
    </div>
  );
}