import supabase from "../config/supabaseClient";
export const getDashboardStats = async () => {
  try {
    const [
      { count: branchCount, error: branchError },
      { count: employeeCount, error: employeeError },
      { count: studentCount, error: studentError },
      { count: programCount, error: programError },
      { count: courseCount, error: courseError },
      { count: subjectCount, error: subjectError },
      { count: syllabusCount, error: syllabusError },
      { count: studymaterialCount, error: studymaterialError },
      { count: videoCount, error: videoError },
    ] = await Promise.all([
      supabase
        .from("branch")
        .select("*", { count: "exact", head: true })
        .eq("isActive", true),
      supabase
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("isActive", true),
      supabase
        .from("students")
        .select("*", { count: "exact", head: true })
        .eq("isActive", true),
      supabase
        .from("programs")
        .select("*", { count: "exact", head: true })
        .eq("isActive", true),
      supabase
        .from("courses")
        .select("*", { count: "exact", head: true })
        .eq("isActive", true),
      supabase
        .from("subject")
        .select("*", { count: "exact", head: true })
        .eq("isActive", true),
      supabase
        .from("syllabus")
        .select("*", { count: "exact", head: true })
        .eq("isActive", true),
      supabase
        .from("studymaterial")
        .select("*", { count: "exact", head: true })
        .eq("isActive", true),
      supabase.from("videoclasses").select("*", { count: "exact", head: true }),
    ]);

    if (
      programError ||
      employeeError ||
      studentError ||
      courseError ||
      subjectError ||
      videoError ||
      branchError ||
      studymaterialError ||
      syllabusError
    ) {
      console.error("Error fetching counts:", {
        programError,
        employeeError,
        studentError,
        courseError,
        subjectError,
        videoError,
        branchError,
        syllabusError,
        studymaterialError,
      });
      throw new Error("Failed to fetch dashboard stats");
    }

    return {
      branch: branchCount || 0,
      employees: employeeCount || 0,
      students: studentCount || 0,
      programs: programCount || 0,
      courses: courseCount || 0,
      subjects: subjectCount || 0,
      syllabuses: syllabusCount || 0,
      studyMaterials: studymaterialCount || 0,
      videoClasses: videoCount || 0,
    };
  } catch (err) {
    console.error("Dashboard stats error:", err.message);
    return {
      branch: 0,
      employees: 0,
      students: 0,
      programs: 0,
      courses: 0,
      subjects: 0,
      syllabuses: 0,
      studyMaterials: 0,
      videoClasses: 0,
    };
  }
};
