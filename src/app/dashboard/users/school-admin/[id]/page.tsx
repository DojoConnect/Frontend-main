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
        // Get email by id
        const resUsers = await fetch("https://www.backoffice-api.dojoconnect.app/get_users");
        if (!resUsers.ok) throw new Error("Failed to fetch users");
        const usersData = await resUsers.json();
        const user = usersData.data.find((u: any) => String(u.id) === String(id));
        if (!user?.email) {
          setProfile(null);
          setEmail(null);
          setLoading(false);
          setError("User not found.");
          return;
        }
        setEmail(user.email);

        // Get detailed profile (role-specific)
        const resProfile = await fetch(`https://apis.dojoconnect.app/user_profile_detailed/${user.email}`);
        if (!resProfile.ok) throw new Error("Profile not found for this email.");
        const profileData = await resProfile.json();
        setProfile(profileData.data);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
        setProfile(null);
        setEmail(null);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [id]);

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (!profile) return <MainLayout><div>{error}</div></MainLayout>;
  if ((profile.role || profile.userType) !== "admin") {
    return <MainLayout><div>Not an Admin profile</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="p-6">
        <ProfileHeader profile={profile} onBack={() => router.push('/dashboard?tab=users')} />
        <ProfileTabs tabs={[...tabs]} activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "Overview" && <ProfileOverview profile={profile} />}
        {activeTab === "Instructors" && (
          <InstructorsTab instructors={profile.overview_metrics?.total_instructors || 0} />
        )}
        {activeTab === "Classes" && (
          <ClassesTab classes={profile.owned_classes || []} />
        )}
      {activeTab === "Parents" && (
  <ParentsTab parents={profile.parents || []} />
)}
        {activeTab === "Students" && (
  <StudentsTab students={profile.students || []} />
)}
        {activeTab === "Calendar" && (
          <Calendar events={profile.calendars || []} />
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
                  <SubscriptionSummary summary={profile.subscription_status} />
                  <PaymentMethod method={profile.payment_method} />
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
                    <SubscriptionTab data={profile.subscription_history} />
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