"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/Dashboard/MainLayout';
import ProfileHeader from '@/components/users/ParentProfile/ProfileHeader';
import ProfileTabs from '@/components/users/ParentProfile/ProfileTabs';
import ProfileOverview from '@/components/users/ParentProfile/ProfileOverview';
import EnrolledChildren from '@/components/users/ParentProfile/EnrolledChildren';
import EnrolledClasses from '@/components/users/ParentProfile/EnrolledClasses';
import ChildrenTable from '@/components/users/ParentProfile/ChildrenTable';
import ClassesTable from '@/components/users/ParentProfile/ClassTable'; // <-- FIXED
import ActivitiesTable from '@/components/users/ParentProfile/ActivitiesTable';
import SubscriptionTable from "@/components/users/ParentProfile/SubscriptionTable";
import SubscriptionSummary from '@/components/users/ParentProfile/SubscriptionSummary';
import PaymentMethod from '@/components/users/ParentProfile/PaymentMethod';
import SearchActionBar from '@/components/users/ParentProfile/SearchActionBar';
import SearchActionBarCreateNew from '@/components/users/ParentProfile/SearchActionBarCreateNew';
import Pagination from '@/components/users/Pagination';
import { boParentService } from '@/services/bo-parent.service';

const tabs = [
  "Overview",
  "Children",
  "Classes",
  "Subscription",
  "Activities"
] as const;
type Tab = typeof tabs[number];

export default function ParentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string | string[] | undefined;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Paginated resources state
  const [childrenData, setChildrenData] = useState<any[]>([]);
  const [childrenMeta, setChildrenMeta] = useState({ page: 1, limit: 20, totalCount: 0, totalPages: 1 });
  const [childrenLoading, setChildrenLoading] = useState(false);

  const [classesData, setClassesData] = useState<any[]>([]);
  const [classesMeta, setClassesMeta] = useState({ page: 1, limit: 20, totalCount: 0, totalPages: 1 });
  const [classesLoading, setClassesLoading] = useState(false);

  const [billingData, setBillingData] = useState<any[]>([]);
  const [billingMeta, setBillingMeta] = useState({ page: 1, limit: 20, totalCount: 0, totalPages: 1 });
  const [billingLoading, setBillingLoading] = useState(false);

  const [activitiesData, setActivitiesData] = useState<any[]>([]);
  const [activitiesMeta, setActivitiesMeta] = useState({ page: 1, limit: 20, totalCount: 0, totalPages: 1 });
  const [activitiesLoading, setActivitiesLoading] = useState(false);

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
        // Fetch parent profile and related resources via service
        const parentResp = await boParentService.getParentProfile(String(id));
        const parent = parentResp.data;

        // Fetch paginated resources (initial page)
        await Promise.all([
          fetchChildrenPage(1),
          fetchClassesPage(1),
          fetchBillingPage(1),
          fetchActivitiesPage(1),
        ]);

        const mappedProfile: any = {
          id: parent.id,
          name: `${parent.firstName} ${parent.lastName}`,
          email: parent.email,
          role: parent.role,
          status: parent.status,
          city: parent.city,
          street: parent.street,
          created_at: parent.createdAt,
          lastActivityAt: parent.lastActivityAt,
          parentId: parent.parentId,
          classImg: (parent as any).avatarUrl || null,
          className: `${parent.firstName} ${parent.lastName}`,
          // summary lists will render current page items; full counts are in meta
          enrolled_children: [],
          enrolled_classes: [],
          subscription_history: [],
          subscription_status: null,
          payment_method: null,
          activities: [],
        };

        // fetch subscription (non-paginated)
        try {
          const subscriptionResp = await boParentService.getParentSubscription(String(id));
            // subscriptionResp.data may contain different shapes depending on backend
            // prefer a `subscription` object if present, otherwise try to map card info
            const subData = subscriptionResp?.data as any;
            mappedProfile.subscription_status = subData?.subscription ?? null;
            mappedProfile.payment_method = subData?.card ?? subData ?? null;
        } catch (e) {
          // ignore
        }

        setProfile(mappedProfile);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
        setProfile(null);
        setEmail(null);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [id]);

  // Paginated fetch helpers
  const fetchChildrenPage = async (page: number) => {
    if (!id) return;
    setChildrenLoading(true);
    try {
      const res = await boParentService.getParentChildren(String(id), { page, limit: childrenMeta.limit });
      setChildrenData((res.data || []).map((c: any) => ({
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        email: c.email,
        enrolledDate: c.enrolledAt,
        lastActivity: c.updatedAt || c.lastActivity || null,
        status: c.status,
        avatar: c.avatarUrl || null,
        studentId: c.studentId,
        experienceLevel: c.experienceLevel,
      })));
      if (res.meta) setChildrenMeta(res.meta as any);
    } catch (e) {
      console.error('Failed to fetch children page', e);
    }
    setChildrenLoading(false);
  };

  const fetchClassesPage = async (page: number) => {
    if (!id) return;
    setClassesLoading(true);
    try {
      const res = await boParentService.getParentClasses(String(id), { page, limit: classesMeta.limit });
      setClassesData((res.data || []).map((cl: any) => ({
        id: cl.enrollmentId || cl.classId,
        className: cl.className,
        classImg: cl.classImg || null,
        classLevel: cl.classLevel,
        instructor: cl.instructor || { name: cl.instructorName || '', avatar: cl.instructorAvatar || null },
        enrollmentDate: cl.enrolledAt,
        status: cl.classStatus || (cl.enrollmentActive ? 'active' : 'inactive'),
        classId: cl.classId,
      })));
      if (res.meta) setClassesMeta(res.meta as any);
    } catch (e) {
      console.error('Failed to fetch classes page', e);
    }
    setClassesLoading(false);
  };

  const fetchBillingPage = async (page: number) => {
    if (!id) return;
    setBillingLoading(true);
    try {
      const res = await boParentService.getParentBillingHistory(String(id), { page, limit: billingMeta.limit });
      setBillingData(res.data || []);
      if (res.meta) setBillingMeta(res.meta as any);
    } catch (e) {
      console.error('Failed to fetch billing page', e);
    }
    setBillingLoading(false);
  };

  const fetchActivitiesPage = async (page: number) => {
    if (!id) return;
    setActivitiesLoading(true);
    try {
      const res = await boParentService.getParentActivities(String(id), { page, limit: activitiesMeta.limit });
      setActivitiesData((res.data || []).map((a: any) => ({
        id: a.id,
        type: a.type,
        title: a.title,
        message: a.message,
        metaData: a.metaData,
        createdAt: a.createdAt,
      })));
      if (res.meta) setActivitiesMeta(res.meta as any);
    } catch (e) {
      console.error('Failed to fetch activities page', e);
    }
    setActivitiesLoading(false);
  };

  // Helper to download blob with filename
  const downloadBlob = async (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  // Export handlers
  const handleExportChildren = async () => {
    if (!id) return;
    try {
      const blob = await boParentService.exportParentChildren(String(id));
      await downloadBlob(blob, `parent-${id}-children.csv`);
    } catch (err) {
      console.error('Failed to export children', err);
    }
  };

  const handleExportClasses = async () => {
    if (!id) return;
    try {
      const blob = await boParentService.exportParentClasses(String(id));
      await downloadBlob(blob, `parent-${id}-classes.csv`);
    } catch (err) {
      console.error('Failed to export classes', err);
    }
  };

  const handleExportBilling = async () => {
    if (!id) return;
    try {
      const blob = await boParentService.exportParentBillingHistory(String(id));
      await downloadBlob(blob, `parent-${id}-billing-history.csv`);
    } catch (err) {
      console.error('Failed to export billing history', err);
    }
  };

  const handleExportActivities = async () => {
    if (!id) return;
    try {
      const blob = await boParentService.exportParentActivities(String(id));
      await downloadBlob(blob, `parent-${id}-activities.csv`);
    } catch (err) {
      console.error('Failed to export activities', err);
    }
  };

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (!profile) return <MainLayout><div>{error}</div></MainLayout>;
  if (!["parent"].includes(String(profile.role || profile.userType).toLowerCase())) {
    return <MainLayout><div>Not a Parent profile</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="p-6">
        <ProfileHeader profile={profile} onBack={() => router.push('/dashboard?tab=users')} />
        <ProfileTabs tabs={[...tabs]} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-8">
          {activeTab === "Overview" && (
            <>
              <ProfileOverview
                profile={profile}
                childrenCount={childrenMeta.totalCount || childrenData.length}
                classGroupCount={classesMeta.totalCount || classesData.length}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <EnrolledChildren childrenData={childrenData.slice(0,5)} />
                <EnrolledClasses classesData={classesData.slice(0,5)} />
              </div>
            </>
          )}
          {/* Pass parentId and refresh handler to CreateNew component */}
          {activeTab === "Children" && (
            <div>
              <ChildrenTable
                childrenData={childrenData}
                onExport={handleExportChildren}
                currentPage={childrenMeta.page}
                rowsPerPage={childrenMeta.limit}
                totalRows={childrenMeta.totalCount}
                onPageChange={fetchChildrenPage}
                loading={childrenLoading}
                parentId={String(id)}
                onChildCreated={() => fetchChildrenPage(1)}
              />
            </div>
          )}
          {activeTab === "Classes" && (
            <div>
              <ClassesTable
                classesData={classesData}
                onExport={handleExportClasses}
                currentPage={classesMeta.page}
                rowsPerPage={classesMeta.limit}
                totalRows={classesMeta.totalCount}
                onPageChange={fetchClassesPage}
                loading={classesLoading}
              />
            </div>
          )}
          {activeTab === "Subscription" && (
  <>
    {(!profile.subscription_status) ? (
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
            <div className="flex items-center justify-between px-4 py-3 mb-2">
            <span className="font-semibold text-gray-800 text-base">Billing history</span>
            <button onClick={handleExportBilling} className="flex items-center bg-white border border-red-600 text-red-600 px-4 py-2 rounded-md cursor-pointer hover:bg-red-50">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4m-8 8h12"/>
              </svg>
              Download
            </button>
          </div>
            <div className="mt-4">
            <SubscriptionTable
              data={billingData}
              currentPage={billingMeta.page}
              rowsPerPage={billingMeta.limit}
              totalRows={billingMeta.totalCount}
              onPageChange={fetchBillingPage}
              loading={billingLoading}
            />
          </div>
        </div>
      </>
    )}
  </>
)}
          {activeTab === "Activities" && (
            <div>
              <ActivitiesTable
                activitiesData={activitiesData}
                onExport={handleExportActivities}
                currentPage={activitiesMeta.page}
                rowsPerPage={activitiesMeta.limit}
                totalRows={activitiesMeta.totalCount}
                onPageChange={fetchActivitiesPage}
                loading={activitiesLoading}
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}