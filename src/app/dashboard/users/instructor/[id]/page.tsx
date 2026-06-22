
"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/Dashboard/MainLayout';
import Overview from '@/components/users/InstructorProfile/Overview';
import ProfileHeader from "@/components/users/InstructorProfile/ProfileHeader";
import ProfileTabs from "@/components/users/InstructorProfile/ProfileTabs";
import AssignedClassesTable from "@/components/users/InstructorProfile/AssignedClassesTable";
import ActivitiesTable from "@/components/users/InstructorProfile/ActivitiesTable";
import { boInstructorService } from '@/services/bo-instructor.service'

const tabs = [
  "Overview",
  "Assigned Classes",
  "Activites",
] as const;
type Tab = typeof tabs[number];

export default function InstructorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [assignedClasses, setAssignedClasses] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
     async function fetchProfile() {
      setLoading(true);
      setError(null);
      if (typeof id === "undefined") {
        setProfile(null);
        setEmail(null);
        setLoading(false);
        setError("No user ID provided.");
        return;
      }
      try {
        // Fetch profile via back-office service
        const resp = await boInstructorService.getInstructorProfile(String(id));
        setProfile(resp || null);
        // populate email and assigned classes from normalized profile if available
        if (resp) {
          setEmail(resp.email || (resp as any).user_email || (resp as any).userEmail || null);
          const r = resp as any;
          const initialAssigned = r.assigned_classes || r.assignedClasses || r.classes || r.assignedDojos || [];
          setAssignedClasses(Array.isArray(initialAssigned) ? initialAssigned : []);
        }
      } catch (err: any) {
        setError(err?.message || 'An error occurred.');
        setProfile(null);
        setEmail(null);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [id]);
  // Load tab data when activeTab or id changes
  useEffect(() => {
      async function load() {
        if (!id) return;
        try {
          if (activeTab === 'Assigned Classes') {
            const res = await boInstructorService.getInstructorClasses(String(id));
            setAssignedClasses((res && res.data) || []);
          }
          if (activeTab === 'Activites' || activeTab === 'Overview') {
            const res = await boInstructorService.getInstructorActivities(String(id));
            setActivities((res && res.data) || []);
          }
        } catch (err) {
          console.error('Failed to load instructor tab data', err);
        }
      }
      load();
    }, [activeTab, id]);

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (!profile) return <MainLayout><div>{error}</div></MainLayout>;
  if (!["instructor"].includes(String(profile.role || profile.userType).toLowerCase())) {
    return <MainLayout><div>Not an Instructor profile</div></MainLayout>;
  }
  return (
   <MainLayout>
      <div className="p-6">
        <ProfileHeader profile={profile} onBack={() => router.push('/dashboard?tab=users')} />
        <ProfileTabs tabs={[...tabs]} activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "Overview" && <Overview profile={profile} email={email || ''} activities={activities} setActiveTab={setActiveTab as (tab: string) => void} />}
        {activeTab === "Assigned Classes" && (
          <div className="mt-6">
            <AssignedClassesTable assignedClasses={assignedClasses.length ? assignedClasses : profile.assigned_classes || []} />
          </div>
        )}
       {activeTab === "Activites" && (
  <div className="mt-6">
    <ActivitiesTable
      activities={
        (activities.length ? activities : (profile.activity_log || [])).map((a: any) => ({
          ...a,
          description: a.description || a.message || a.title || a.details || "",
          date: a.createdAt || a.created_at || a.updatedAt || a.updated_at || a.date,
          type: a.activityType || a.type || a.title || a.notificationType || a.name,
        }))
      }
    />
  </div>
)}
      </div>
    </MainLayout>
  );
}
