'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import MainLayout from '@/components/Dashboard/MainLayout';
import Pagination from '@/components/classes/Pagination';
import SearchActionBar from '@/components/classes/ClassProfile/SearchActionBar';
import ProfileHeader from '@/components/classes/ClassProfile/ProfileHeader';
import ProfileTabs from '@/components/classes/ClassProfile/ProfileTabs';
import ClassOverview from '@/components/classes/ClassProfile/ClassInfo';
import EnrolledStudentsTable from '@/components/classes/ClassProfile/EnrolledStudentTable';
import AttendanceTab from "@/components/classes/ClassProfile/Attendance";
import SubscriptionTab from "@/components/classes/ClassProfile/Subscription";
import ActivitiesTable from "@/components/classes/ClassProfile/Activities";
import ClassScheduleCalendar from "@/components/classes/ClassProfile/Calendar";
import { boClassesService } from '@/services/bo-classes.service'

export default function ClassDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Tab data
  const [classStudents, setClassStudents] = useState<any[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<any>(null);
  const [attendanceRows, setAttendanceRows] = useState<any[]>([]);
  const [subscriptionSummary, setSubscriptionSummary] = useState<any>(null);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [classSchedule, setClassSchedule] = useState<any[]>([]);

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const tabs: string[] = [
    "Class Info",
    "Enrolled Student",
    "Class Schedule",
    "Attendance",
    "Subscription",
    "Activities"
  ];
  type Tab = (typeof tabs)[number];
  const [activeTab, setActiveTab] = useState<Tab>("Class Info");

  useEffect(() => {
    if (!id) return;

    async function fetchClassProfile() {
      setLoading(true);
      try {
        const details = await boClassesService.getClassDetails(id);
        setProfile(details || null);
        // prefill simple arrays if present on details
        setClassStudents([]);
        setAttendanceRows([]);
        setRecentActivities([]);
        setClassSchedule([]);
      } catch (err) {
        setProfile(null);
      }
      setLoading(false);
    }

    fetchClassProfile();
  }, [id]);

  // Lazy-load data for active tab
  useEffect(() => {
    if (!id) return;
    async function loadTabData() {
      try {
        if (activeTab === 'Enrolled Student') {
          const res = await boClassesService.getClassStudents(id, { page: 1, limit: 100 });
          setClassStudents((res.data || []).map((s: any) => ({
            ...s,
            name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.name || '',
            avatar: s.avatarUrl || s.avatar || null,
            lastActivityDate: s.lastActivityDate || null,
          })));
        }
        if (activeTab === 'Class Schedule') {
          const res = await boClassesService.getClassSchedule(id);
          setClassSchedule(res || []);
        }
        if (activeTab === 'Attendance') {
          const res = await boClassesService.getClassAttendanceSummary(id);
          setAttendanceSummary(res || null);
          const history = await boClassesService.getClassAttendanceHistory(id, { page: 1, limit: 100 });
          setAttendanceRows(history.data || []);
        }
        if (activeTab === 'Subscription') {
          const res = await boClassesService.getClassSubscriptionSummary(id);
          setSubscriptionSummary(res || null);
          const billing = await boClassesService.getClassPaymentHistory(id, { page: 1, limit: 100 });
          setBillingHistory(billing.data || []);
        }
        if (activeTab === 'Activities') {
          const res = await boClassesService.getClassActivities(id, { page: 1, limit: 100 });
          setRecentActivities(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load class tab data', err);
      }
    }
    loadTabData();
  }, [activeTab, id]);

  if (loading) {
    return <MainLayout><div>Loading...</div></MainLayout>;
  }

  if (!profile) {
    return <MainLayout><div>Class not found</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="p-3 sm:p-6">
        <ProfileHeader
          profile={{
            className: profile?.name || profile?.class_name,
            classLevel: profile?.level,
            instructor: {
              name: profile?.instructorName || profile?.instructor,
              avatar: profile?.instructorAvatar || profile?.instructor_img || null
            },
            classAge: `${profile?.minAge || ''}-${profile?.maxAge || ''}`,
            frequency: profile?.frequency,
            enrolledStudents: profile?.enrolledStudents || profile?.enrolled_students?.length || 0,
            location: profile?.streetAddress || profile?.location,
            status: profile?.status,
            dateCreated: profile?.createdAt || profile?.created_at,
            classImg: profile?.image_path
              ? (profile.image_path.startsWith("http")
                  ? profile.image_path
                  : `${process.env.NEXT_PUBLIC_BACK_OFFICE_API_URL}/${profile.image_path}`)
              : null,
            subscriptionType: profile?.subscriptionType || profile?.subscription,
            subscriptionFee: profile?.price,
            gradingDate: profile?.gradingDate || profile?.grading_date,
          }}
          onBack={() => router.push('/dashboard?tab=classes')}
        />

        <ProfileTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="mt-4 sm:mt-8 text-xs sm:text-sm">
          {activeTab === "Class Info" && <ClassOverview profile={profile} />}
          {activeTab === "Enrolled Student" && (
            <>
              <div className="overflow-x-auto">
                <EnrolledStudentsTable students={classStudents.length ? classStudents : (profile.enrolled_students || [])} classId={id} />
              </div>
              <Pagination
                totalRows={(classStudents.length ? classStudents.length : (profile.enrolled_students?.length || 0))}
                rowsPerPage={rowsPerPage}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}
          {activeTab === "Class Schedule" && (
            <div className="overflow-x-auto">
              <ClassScheduleCalendar rawSchedule={classSchedule.length ? classSchedule : (profile.class_schedule || [])} />
            </div>
          )}
          {activeTab === "Attendance" && (
            <>
              <div className="overflow-x-auto">
                <AttendanceTab attendance={attendanceSummary || profile.attendance_summary} rows={attendanceRows.length ? attendanceRows : (profile.attendance_rows || [])} />
              </div>
              <Pagination
                totalRows={(attendanceRows.length ? attendanceRows.length : (profile.attendance_rows?.length || 0))}
                rowsPerPage={rowsPerPage}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}
          {activeTab === "Subscription" && (
            <>
              {!subscriptionSummary ? (
                <div className="flex flex-col items-center justify-center py-10 sm:py-16 bg-white rounded-lg border">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="none" className="sm:w-[150px] sm:h-[150px]"><path fill="url(#a)" d="M75 150c41.421 0 75-33.579 75-75S116.421 0 75 0 0 33.579 0 75s33.579 75 75 75Z"/><path fill="#fff" d="M120 150H30V53a16.018 16.018 0 0 0 16-16h58a15.906 15.906 0 0 0 4.691 11.308A15.89 15.89 0 0 0 120 53v97Z"/><path fill="#E51B1B" d="M75 102c13.255 0 24-10.745 24-24S88.255 54 75 54 51 64.745 51 78s10.745 24 24 24Z"/><path fill="#fff" d="M83.485 89.314 75 80.829l-8.485 8.485-2.829-2.829L72.172 78l-8.486-8.485 2.829-2.829L75 75.172l8.485-8.486 2.829 2.829L77.828 78l8.486 8.485-2.829 2.829Z"/><path fill="#FCDEDE" d="M88 108H62a3 3 0 1 0 0 6h26a3 3 0 1 0 0-6ZM97 120H53a3 3 0 1 0 0 6h44a3 3 0 1 0 0-6Z"/><defs><linearGradient id="a" x1="75" x2="75" y1="0" y2="150" gradientUnits="userSpaceOnUse"><stop stopColor="#FCEDED"/><stop offset="1" stopColor="#FCDEDE"/></linearGradient></defs></svg>
                  <div className="mt-4 sm:mt-6 text-black font-semibold text-base sm:text-lg">No Subscription History</div>
                  <div className="mt-2 text-gray-500 text-xs sm:text-sm text-center">No subscription or billing records found for this user.</div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                    <SubscriptionTab subscription={subscriptionSummary || profile.subscription_status} billing={(billingHistory.length ? billingHistory : (profile.subscription_history || []))} />
                  </div>
                  <div className="mt-6 sm:mt-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 py-2 sm:py-3 mb-2 gap-2">
                      <span className="font-semibold text-gray-800 text-base">Billing history</span>
                      <button className="flex items-center bg-white border border-red-600 text-red-600 px-3 sm:px-4 py-2 rounded-md cursor-pointer hover:bg-red-50 text-xs sm:text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4m-8 8h12"/>
                        </svg>
                        Export
                      </button>
                    </div>
                    <div className="mt-4 overflow-x-auto">
                      <SubscriptionTab
                        subscription={profile.subscription_status}
                        billing={profile.subscription_history || []}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {activeTab === "Activities" && (
            <>
              <div className="overflow-x-auto">
                <ActivitiesTable activities={recentActivities.length ? recentActivities : (profile.recent_activities || [])} />
              </div>
              <Pagination
                totalRows={profile.recent_activities?.length || 0}
                rowsPerPage={rowsPerPage}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}