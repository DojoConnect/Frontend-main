'use client'
import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/Dashboard/MainLayout'
import ProfileHeader from "@/components/users/AdminProfile/ProfileHeader"
import ProfileTabs from "@/components/users/AdminProfile/ProfileTabs"
import ProfileOverview from "@/components/users/AdminProfile/Overview"
import InstructorsTab from "@/components/users/AdminProfile/InstructorsTab"
import ClassesTab from "@/components/users/AdminProfile/ClassesTab"
import ParentsTab from "@/components/users/AdminProfile/ParentsTab"
import StudentsTab from "@/components/users/AdminProfile/StudentsTab"
import SubscriptionTab from "@/components/users/AdminProfile/SubscriptionTab"
import SubscriptionSummary from "@/components/users/AdminProfile/SubscriptionSummary"
import PaymentMethod from "@/components/users/AdminProfile/PaymentMethod"
import ActivitiesTab from "@/components/users/AdminProfile/ActivitiesTab" 
import { boDojoService } from '@/services/bo-dojo.service'
import { boUsersService } from '@/services/bo-users.service'
import Calendar from "@/components/users/AdminProfile/Calendar"


const tabs = [
  "Overview",
  "Instructors",
  "Classes",
  "Parents",
  "Students",
  "Calendar",
  "Subscription",
  "Activities"
] as const;
type Tab = typeof tabs[number];

export default function AdminProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isDojoProfile, setIsDojoProfile] = useState(false);
  const [dojoStats, setDojoStats] = useState<any>(null);
  const [dojoInstructors, setDojoInstructors] = useState<any[]>([]);
  const [dojoClasses, setDojoClasses] = useState<any[]>([]);
  const [dojoParents, setDojoParents] = useState<any[]>([]);
  const [dojoStudents, setDojoStudents] = useState<any[]>([]);
  const [dojoSchedule, setDojoSchedule] = useState<any[]>([]);
  const [dojoSubscription, setDojoSubscription] = useState<any>(null);
  const [dojoBilling, setDojoBilling] = useState<any[]>([]);
  const [dojoActivities, setDojoActivities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      if (!id) {
        setProfile(null);
        setLoading(false);
        setError("No user ID provided.");
        return;
      }
      try {
        // First try treating the id as a dojoId and fetch dojo profile
        try {
          const dojoResp = await boDojoService.getDojoProfile(String(id));
          if (dojoResp) {
            setProfile(dojoResp);
            setIsDojoProfile(true);
            setLoading(false);
            return;
          }
        } catch (e) {
          // not a dojoId or dojo not found - fallthrough to user-based lookup
        }

        // Fallback: get user from list and build profile from available data
        try {
          let user = await boUsersService.getUserById(String(id));
          if (!user) {
            try {
              const resUsers = await boUsersService.listUsers({ role: 'all', page: 1, limit: 1000 });
              const usersArr = Array.isArray(resUsers.data) ? resUsers.data : [];
              user = usersArr.find((u: any) => String(u.id) === String(id)) || null;
            } catch (listErr) {
              // ignore
            }
          }

          if (!user) {
            setProfile(null);
            setLoading(false);
            setError("User not found.");
            return;
          }

          setEmail(user.email);
          // Build profile directly from user list data — no separate detailed endpoint needed
          setProfile({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email,
            role: user.role,
            status: user.status,
            avatarUrl: user.avatarUrl,
            joinedDate: user.joinedDate,
            lastActivity: user.lastActivity,
          });
          setIsDojoProfile(false);
          setLoading(false);
          return;
        } catch (e) {
          throw e;
        }
      } catch (err: any) {
        setError(err.message || "An error occurred.");
        setProfile(null);
        setEmail(null);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [id]);

  // Lazy load dojo-specific tab data when we have a dojo profile or when profile contains dojoId
  useEffect(() => {
    async function loadDojoTabData() {
      if (!id) return;
      // determine dojoId
      const dojoId = isDojoProfile ? String(id) : (profile?.dojoId || profile?.linkedDojo?.dojoId || profile?.ownerId);
      if (!dojoId) return;
      try {
        if (activeTab === 'Overview') {
          const stats = await boDojoService.getDojoStats(dojoId);
          setDojoStats(stats || null);
        }
        if (activeTab === 'Instructors') {
          const res = await boDojoService.getDojoInstructors(dojoId);
          setDojoInstructors(res.data || []);
        }
        if (activeTab === 'Classes') {
          const res = await boDojoService.getDojoClasses(dojoId);
          setDojoClasses(res.data || []);
        }
        if (activeTab === 'Parents') {
          const res = await boDojoService.getDojoParents(dojoId);
          setDojoParents(res.data || []);
        }
        if (activeTab === 'Students') {
          const res = await boDojoService.getDojoStudents(dojoId);
          setDojoStudents(res.data || []);
        }
        if (activeTab === 'Calendar') {
          const res = await boDojoService.getDojoSchedule(dojoId);
          setDojoSchedule(res || []);
        }
        if (activeTab === 'Subscription') {
          const res = await boDojoService.getDojoSubscription(dojoId);
          setDojoSubscription(res || null);
          const billing = await boDojoService.getDojoBillingHistory(dojoId);
          setDojoBilling(billing.data || []);
        }
        if (activeTab === 'Activities') {
          const res = await boDojoService.getDojoActivities(dojoId);
          setDojoActivities(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load dojo tab data', err);
      }
    }
    loadDojoTabData();
  }, [activeTab, id, isDojoProfile, profile]);

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (!profile) return <MainLayout><div>{error}</div></MainLayout>;
  const profileRole = (profile.role || profile.userType || '').toLowerCase();
  if (!isDojoProfile && !['admin', 'dojo_owner'].includes(profileRole)) {
    return <MainLayout><div>Not an Admin profile</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="p-6">
        <ProfileHeader profile={profile} onBack={() => router.push('/dashboard?tab=users')} />
        <ProfileTabs tabs={[...tabs]} activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "Overview" && <ProfileOverview profile={profile} dojoStats={dojoStats} />}
        {activeTab === "Instructors" && (
          <InstructorsTab instructors={dojoInstructors.length ? dojoInstructors : (profile.overview_metrics?.total_instructors || 0)} />
        )}
        {activeTab === "Classes" && (
          <ClassesTab classes={dojoClasses.length ? dojoClasses : (profile.owned_classes || [])} />
        )}
      {activeTab === "Parents" && (
  <ParentsTab parents={dojoParents.length ? dojoParents : (profile.parents || [])} />
)}
        {activeTab === "Students" && (
  <StudentsTab students={dojoStudents.length ? dojoStudents : (profile.students || [])} />
)}
        {activeTab === "Calendar" && (
          <Calendar events={dojoSchedule.length ? dojoSchedule : (profile.calendars || [])} />
        )}
          {activeTab === "Subscription" && (
          <>
            {(!profile.subscription_history || profile.subscription_history.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border">
                <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="none"><path fill="url(#a)" d="M75 150c41.421 0 75-33.579 75-75S116.421 0 75 0 0 33.579 0 75s33.579 75 75 75Z"/><path fill="#fff" d="M120 150H30V53a16.018 16.018 0 0 0 16-16h58a15.906 15.906 0 0 0 4.691 11.308A15.89 15.89 0 0 0 120 53v97Z"/><path fill="#E51B1B" d="M75 102c13.255 0 24-10.745 24-24S88.255 54 75 54 51 64.745 51 78s10.745 24 24 24Z"/><path fill="#fff" d="M83.485 89.314 75 80.829l-8.485 8.485-2.829-2.829L72.172 78l-8.486-8.485 2.829-2.829L75 75.172l8.485-8.486 2.829 2.829L77.828 78l8.486 8.485-2.829 2.829Z"/><path fill="#FCDEDE" d="M88 108H62a3 3 0 1 0 0 6h26a3 3 0 1 0 0-6ZM97 120H53a3 3 0 1 0 0 6h44a3 3 0 1 0 0-6Z"/><defs><linearGradient id="a" x1="75" x2="75" y1="0" y2="150" gradientUnits="userSpaceOnUse"><stop stopColor="#FCEDED"/><stop offset="1" stopColor="#FCDEDE"/></linearGradient></defs></svg>
                <div className="mt-6 text-black font-semibold text-lg">No Subscription History</div>
                <div className="mt-2 text-gray-500 text-sm">No subscription or billing records found for this user.</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SubscriptionSummary summary={dojoSubscription || profile.subscription_status} />
                    <PaymentMethod method={profile.payment_method || (dojoSubscription?.card || {})} />
                </div>
                <div className="mt-8">
                  <div className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-md mb-2">
                    <span className="font-semibold text-gray-700 text-lg">Billing history</span>
                    <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4m-8 8h12"/>
                      </svg>
                      Download
                    </button>
                  </div>
                  <div className="mt-4">
                    <SubscriptionTab data={dojoBilling.length ? dojoBilling : (profile.subscription_history || [])} />
                  </div>
                </div>
              </>
            )}
          </>
        )}
              
        {activeTab === "Activities" && (
          <ActivitiesTab activities={profile.activities || []} />
        )}
      </div>
    </MainLayout>
  );
}