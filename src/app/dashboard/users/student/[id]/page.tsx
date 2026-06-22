"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/Dashboard/MainLayout'
import ProfileHeader from "@/components/users/StudentProfile/ProfileHeader"
import ProfileTabs from "@/components/users/StudentProfile/ProfileTabs"
import ProfileOverview from "@/components/users/StudentProfile/ProfileOverview"
import ClassesTab from "@/components/users/StudentProfile/ClassesTab"
import AttendanceSummary from "@/components/users/StudentProfile/AttendanceSummary"
import SubscriptionSummary from "@/components/users/StudentProfile/SubscriptionSummary"
import PaymentMethod from "@/components/users/StudentProfile/PaymentMethod"
import SubscriptionTable from "@/components/users/StudentProfile/SubscriptionTable"
import ActivitiesTab from "@/components/users/StudentProfile/ActivitiesTab"
import { boStudentService } from '@/services/bo-student.service'
import { boUsersService } from '@/services/bo-users.service'

const tabs = [
  "Overview",
  "Classes",
  "Attendance Summary",
  "Subscription",
  "Activities"
] as const;
type Tab = typeof tabs[number];

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string | string[] | undefined;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [classesData, setClassesData] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [activitiesData, setActivitiesData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      if (!id) {
  setProfile(null);
  setLoading(false);
  return;
}
      try {
        const resp = await boStudentService.getStudentProfile(id as string);
        if (resp && resp.data) {
          const p = resp.data as any;
          const normalizedProfile = {
            ...p,
            name: `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.name,
            parent: p.parent ? {
              ...p.parent,
              name: p.parent.fullName || p.parent.name,
            } : null,
            physicalDisabilities: p.disabilities ?? p.physicalDisabilities,
            specialAssistance: p.requiresSpecialAssistance ?? p.specialAssistance,
            linkedDojo: typeof p.linkedDojo === 'object' ? (p.linkedDojo?.dojoName || p.linkedDojo?.name || p.linkedDojo) : p.linkedDojo,
            joinedDate: p.enrolledAt || p.joinedDate || p.createdAt,
            accountStatus: p.status || p.accountStatus,
          };
          setProfile(normalizedProfile);
          const initialClasses = p.classes || p.enrolled_classes || p.assigned_classes || p.student_classes || [];
          setClassesData(Array.isArray(initialClasses) ? initialClasses.map((cls: any) => ({
            ...cls,
            className: cls.className || cls.class_name || cls.name || cls.dojoName || '',
            classLevel: cls.classLevel || cls.level || '',
            instructorName: cls.instructorName || cls.instructor_name || '',
            enrollmentDate: cls.enrollmentDate || cls.enrolledAt || cls.enrolled_at || '',
            status: cls.enrollmentActive === true ? 'active' : cls.enrollmentActive === false ? 'inactive' : (cls.status || ''),
          })) : []);
          const initialAttendance = p.attendance_summary || p.attendanceSummary || null;
          setAttendanceData(initialAttendance || null);
          const initialSubscription = p.subscription || p.subscription_status || null;
          setSubscriptionData(initialSubscription || null);
          const initialActivities = p.activity_log || p.activities || p.recent_activities || [];
          setActivitiesData(Array.isArray(initialActivities) ? initialActivities.map((a: any) => ({
            ...a,
            description: a.title || a.message || a.description || a.details || '',
            date: a.createdAt || a.created_at || a.updatedAt || a.updated_at || a.date || null,
            type: a.activityType || a.type || a.name || a.notificationType || '',
          })) : []);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('Error fetching student profile', err);
        setProfile(null);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [id]);

  // Lazy load tab data
  useEffect(() => {
    if (!id) return;
    async function loadTabData() {
      try {
        if (activeTab === 'Classes') {
          const res = await boStudentService.getStudentClasses(id as string);
          setClassesData((res.data || []).map((cls: any) => ({
            ...cls,
            className: cls.className || cls.class_name || cls.name || cls.dojoName || '',
            classLevel: cls.classLevel || cls.level || '',
            instructorName: cls.instructorName || cls.instructor_name || '',
            enrollmentDate: cls.enrollmentDate || cls.enrolledAt || cls.enrolled_at || '',
            status: cls.enrollmentActive === true ? 'active' : cls.enrollmentActive === false ? 'inactive' : (cls.status || ''),
          })));
        }
        if (activeTab === 'Attendance Summary') {
          const res = await boStudentService.getStudentAttendance(id as string);
          setAttendanceData(res.data || null);
        }
        if (activeTab === 'Subscription') {
          const res = await boStudentService.getStudentSubscription(id as string);
          setSubscriptionData(res.data || null);
        }
        if (activeTab === 'Activities' || activeTab === 'Overview') {
          const res = await boStudentService.getStudentActivities(id as string);
          setActivitiesData((res.data || []).map((a: any) => ({
            ...a,
            description: a.title || a.message || a.description || '',
            date: a.createdAt || a.created_at || null,
            type: a.activityType || a.type || '',
          })));
        }
        if (activeTab === 'Overview') {
          const res = await boStudentService.getStudentClasses(id as string);
          setClassesData((res.data || []).map((cls: any) => ({
            ...cls,
            className: cls.className || cls.class_name || cls.name || cls.dojoName || '',
            classLevel: cls.classLevel || cls.level || '',
            instructorName: cls.instructorName || cls.instructor_name || '',
            enrollmentDate: cls.enrollmentDate || cls.enrolledAt || cls.enrolled_at || '',
            status: cls.enrollmentActive === true ? 'active' : cls.enrollmentActive === false ? 'inactive' : (cls.status || ''),
          })));
        }
      } catch (err) {
        console.error('Failed to load tab data', err);
      }
    }
    loadTabData();
  }, [activeTab, id]);

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;
if (!profile) return <MainLayout><div>User not found</div></MainLayout>;
if (!["student", "child"].includes((profile.role || "").toLowerCase())) {
  return <MainLayout><div>Not a Student profile</div></MainLayout>;
}
  return (
    <MainLayout>
      <div className="p-6">
        <ProfileHeader profile={profile} onBack={() => router.push('/dashboard?tab=users')} />
        <ProfileTabs tabs={[...tabs]} activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "Overview" && <ProfileOverview profile={profile} classes={classesData} activities={activitiesData} setActiveTab={setActiveTab as (tab: string) => void} />}
        {activeTab === "Classes" && <ClassesTab classes={classesData || []} />}
        {activeTab === "Attendance Summary" && <AttendanceSummary summary={attendanceData || {}} />}
{activeTab === "Subscription" && (() => {
  const sub = subscriptionData?.subscription ?? subscriptionData;
  const card = subscriptionData?.card ?? null;
  const hasSub = !!sub;
  const billingHistory = subscriptionData?.billingHistory || subscriptionData?.payments || subscriptionData?.history || [];
  return !hasSub ? (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border min-h-[320px]">
      <div className="mt-6 text-black font-semibold text-lg">No Subscription Information</div>
      <div className="mt-2 text-gray-500 text-sm">No subscription data available for this user.</div>
    </div>
  ) : (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <SubscriptionSummary summary={sub} />
        <PaymentMethod method={card} />
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between px-4 py-3 mb-2">
          <span className="font-semibold text-gray-800 text-base">Billing History</span>
          <button className="flex items-center bg-white border border-red-600 text-red-600 px-4 py-2 rounded-md text-sm hover:bg-red-50">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4m-8 8h12"/>
            </svg>
            Export
          </button>
        </div>
        <SubscriptionTable data={billingHistory} />
      </div>
    </>
  );
})()}
        {activeTab === "Activities" && <ActivitiesTab activities={activitiesData || []} />}
      </div>
    </MainLayout>
  );
}

// Helper to get email by id using service
async function getEmailById(id: string | string[]) {
  try {
    const res = await boUsersService.listUsers({ page: 1, limit: 1000 });
    const users = (res as any).data?.data || (res as any).data || res || [];
    const user = users.find((u: any) => String(u.id) === String(id));
    return user?.email || null;
  } catch (err) {
    console.error('getEmailById failed', err);
    return null;
  }
}