import React, { useEffect, useState } from "react";
import {
  Layers,
  Book,
  FileText,
  Video,
  Building2,
  ClipboardList,
  Archive,
} from "lucide-react";
// import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../api/dashboardStats";
import StatCard from "../../components/ecommerce/StatCard"; // adjust path if needed
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    branch: 0,
    programs: 0,
    courses: 0,
    subjects: 0,
    syllabuses: 0,
    studyMaterials: 0,
    videoClasses: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  // ✅ Add navigation paths for each card
  const items = [
    {
      title: "Branches",
      count: stats.branch,
      icon: Building2,
      path: "/branch",
    },
    {
      title: "Programs",
      count: stats.programs,
      icon: Layers,
      path: "/programs",
    },
    { title: "Courses", count: stats.courses, icon: Book, path: "/courses" },
    {
      title: "Subject",
      count: stats.subjects,
      icon: ClipboardList,
      path: "/subject",
    },
    {
      title: "Syllabus",
      count: stats.syllabuses,
      icon: FileText,
      path: "/syllabus",
    },
    {
      title: "Study Materials",
      count: stats.studyMaterials,
      icon: Archive,
      path: "/study-materials",
    },
    {
      title: "Video Classes",
      count: stats.videoClasses,
      icon: Video,
      path: "/video-classes",
    },
  ];

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading
        ? // 🦴 Skeleton loading cards
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex items-center justify-between"
            >
              <div className="flex flex-col space-y-3">
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
          ))
        : // ✅ Actual stat cards
          items.map((item, index) => (
            <div
              key={index}
              className="cursor-pointer transition-transform duration-200 hover:scale-105"
              onClick={() => navigate(item.path)}
            >
              <StatCard
                title={item.title}
                count={item.count}
                icon={item.icon}
              />
            </div>
          ))}
    </div>
  );
}
