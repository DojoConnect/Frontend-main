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
import { transformScheduleToCalendar } from "@/components/classes/ClassProfile/transformScheduleToCalendar";

export default function ClassDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        const res = await fetch(`https://apis.dojoconnect.app/class_profile/${id}`);
        const data = await res.json();
        if (data && data.success && data.data && data.data.class_info) {
          setProfile({
            ...data.data.class_info,
            enrolled_students: data.data.enrolled_students || [],
            attendance_summary: data.data.attendance_summary || {},
            attendance_rows: data.data.attendance_rows || [],
            subscription_info: data.data.subscription_info || {},
            billing_history: data.data.billing_history || [],
            recent_activities: data.data.recent_activities || [],
            class_schedule: data.data.class_schedule || [],
          });
        } else {
          setProfile(null);
        }
      } catch (err) {
        setProfile(null);
      }
      setLoading(false);
    }

    fetchClassProfile();
  }, [id]);

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
            className: profile.class_name,
            classLevel: profile.level,
            instructor: { name: profile.instructor, avatar: "/instructorImage.png" },
            classAge: profile.age_group,
            frequency: profile.frequency,
            enrolledStudents: profile.enrolled_students?.length || 0,
            location: profile.location,
            status: profile.status,
            dateCreated: profile.created_at,
            classImg: profile.image_path
              ? (profile.image_path.startsWith("http")
                  ? profile.image_path
                  : `https://backoffice-api.dojoconnect.app/${profile.image_path}`)
              : "/classImg.jpg",
            subscriptionType: profile.subscription,
            subscriptionFee: profile.price,
            gradingDate: profile.grading_date,
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
                <EnrolledStudentsTable students={profile.enrolled_students} classId={id} />
              </div>
              <Pagination
                totalRows={profile.enrolled_students?.length || 0}
                rowsPerPage={rowsPerPage}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}
          {activeTab === "Class Schedule" && (
            <div className="overflow-x-auto">
              <ClassScheduleCalendar schedule={transformScheduleToCalendar(profile.class_schedule)} />
            </div>
          )}
          {activeTab === "Attendance" && (
            <>
              <div className="overflow-x-auto">
                <AttendanceTab attendance={profile.attendance_summary} rows={profile.attendance_rows} />
              </div>
              <Pagination
                totalRows={profile.attendance_rows?.length || 0}
                rowsPerPage={rowsPerPage}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}
          {activeTab === "Subscription" && (
            <>
              {(!profile.subscription_history || profile.subscription_history.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-10 sm:py-16 bg-white rounded-lg border">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="none" className="sm:w-[150px] sm:h-[150px]"><path fill="url(#a)" d="M75 150c41.421 0 75-33.579 75-75S116.421 0 75 0 0 33.579 0 75s33.579 75 75 75Z"/><path fill="#fff" d="M120 150H30V53a16.018 16.018 0 0 0 16-16h58a15.906 15.906 0 0 0 4.691 11.308A15.89 15.89 0 0 0 120 53v97Z"/><path fill="#E51B1B" d="M75 102c13.255 0 24-10.745 24-24S88.255 54 75 54 51 64.745 51 78s10.745 24 24 24Z"/><path fill="#fff" d="M83.485 89.314 75 80.829l-8.485 8.485-2.829-2.829L72.172 78l-8.486-8.485 2.829-2.829L75 75.172l8.485-8.486 2.829 2.829L77.828 78l8.486 8.485-2.829 2.829Z"/><path fill="#FCDEDE" d="M88 108H62a3 3 0 1 0 0 6h26a3 3 0 1 0 0-6ZM97 120H53a3 3 0 1 0 0 6h44a3 3 0 1 0 0-6Z"/><defs><linearGradient id="a" x1="75" x2="75" y1="0" y2="150" gradientUnits="userSpaceOnUse"><stop stopColor="#FCEDED"/><stop offset="1" stopColor="#FCDEDE"/></linearGradient></defs></svg>
                  <div className="mt-4 sm:mt-6 text-black font-semibold text-base sm:text-lg">No Subscription History</div>
                  <div className="mt-2 text-gray-500 text-xs sm:text-sm text-center">No subscription or billing records found for this user.</div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                    <SubscriptionTab subscription={profile.subscription_status} billing={profile.subscription_history || []} />
                  </div>
                  <div className="mt-6 sm:mt-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-100 px-3 sm:px-4 py-2 sm:py-3 rounded-md mb-2 gap-2">
                      <span className="font-semibold text-gray-700 text-base sm:text-lg">Billing history</span>
                      <button className="flex items-center bg-red-500 text-white px-3 sm:px-4 py-2 rounded-md cursor-pointer hover:bg-red-600 text-xs sm:text-base">
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
                <ActivitiesTable activities={profile.recent_activities} />
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