import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import supabase from "../../config/supabaseClient";

export default function Profile() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchProfileData();
  }, []);
  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from("branch")
        .select("*")
        .eq("is_primary", true)
        .single();
      setData(data);
      if (error) {
        console.error("Error fetching profile data:", error);
        return;
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  return (
    <div>
      <PageMeta
        title="Centre Profile | Dashboard"
        description="Centre and personal information profile page"
      />
      <PageBreadcrumb pageTitle="Profile" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-6 py-8 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {/* Section Title */}
        <h3 className="mb-6 font-semibold text-gray-500 text-2xl dark:text-white/90">
          Centre & Personal Information
        </h3>

        {/* Info Card */}
        <div className="border border-gray-200 rounded-xl bg-gray-50 p-6 shadow-sm dark:bg-white/[0.05]">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 mb-4">
            <div>
              <p className="text-md text-gray-700 dark:text-white/90">
                Centre Code
              </p>
              <p className="text-sm font-semibold text-gray-500 dark:text-warning-25">
                {data?.center_code || "-"}
              </p>
            </div>
            <div>
              <p className="text-md text-gray-700 dark:text-white/90">
                Centre Name
              </p>
              <p className="text-sm  font-semibold text-gray-500 dark:text-warning-25">
                {data?.center_name || "-"}
              </p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 mb-4">
            <div>
              <p className="text-md text-gray-700 dark:text-white/90">
                Centre Address
              </p>
              <p className="text-sm font-semibold text-gray-500 dark:text-warning-25 leading-snug">
                {data?.center_address || "-"}
              </p>
            </div>

            <div>
              <p className="text-md text-gray-700 dark:text-white/90 ">
                Director's Name
              </p>
              <p className="text-sm font-semibold text-gray-500 dark:text-warning-25">
                {data?.name || "-"}
              </p>
            </div>
            <div>
              <p className="text-md text-gray-700 dark:text-white/90">
                Mobile No.
              </p>
              <p className="text-sm font-semibold text-gray-500 dark:text-warning-25">
                {data?.mobile_number || "-"}
              </p>
            </div>
            {/* Email */}
            <div className="mb-6">
              <p className="text-md text-gray-700 dark:text-white/90">Email</p>
              <p className="text-sm font-semibold text-gray-500 dark:text-warning-25">
                {data?.email || "-"}
              </p>
            </div>
          </div>

          {/* Download Button */}
          <button className="mt-4 inline-block bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md">
            Authorisation Certificate Download
          </button>
        </div>
      </div>
    </div>
  );
}
