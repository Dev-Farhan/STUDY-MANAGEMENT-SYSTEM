// Reusable toggle utility functions for all tables
import { toast } from "react-toastify";
import Supabase from "../config/supabaseClient.ts";

/**
 * Generic toggle function that can be used across all tables
 * @param {string} tableName - Name of the table (e.g., 'department', 'courses', 'employees')
 * @param {number} itemId - ID of the item to toggle
 * @param {boolean} currentStatus - Current status of the item
 * @param {function} setDataFunction - State setter function to update local data
 * @param {function} navigate - Navigation function for redirects
 * @param {string} itemName - Name of the item type for user messages (e.g., 'Department', 'Course')
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
 */
export const toggleItemStatus = async (
  tableName,
  itemId,
  currentStatus,
  setDataFunction,
  navigate,
  itemName = "Item"
) => {
  try {
    // Check if user is authenticated
    const {
      data: { session },
    } = await Supabase.auth.getSession();

    if (!session) {
      toast.error(
        `You must be logged in to update ${itemName.toLowerCase()} status`
      );
      navigate("/sign-in");
      return false;
    }

    const newStatus = !currentStatus;

    const { error } = await Supabase.from(tableName)
      .update({ isActive: newStatus })
      .eq("id", itemId);

    if (error) {
      toast.error(error?.message);
      console.error(`${itemName} Status Update Error:`, error.message);
      return false;
    }

    // Update local state to reflect the change immediately
    setDataFunction((prevData) =>
      prevData.map((item) =>
        item.id === itemId ? { ...item, isActive: newStatus } : item
      )
    );

    toast.success(
      `${itemName} ${newStatus ? "activated" : "deactivated"} successfully!`
    );
    return true;
  } catch (err) {
    toast.error(err?.message || "Something went wrong");
    console.error(`Unexpected ${itemName} Toggle Error:`, err);
    return false;
  }
};

/**
 * Specific toggle functions for different tables
 */

export const toggleDepartmentStatus = (
  departmentId,
  currentStatus,
  setDepartmentsData,
  navigate
) => {
  return toggleItemStatus(
    "department",
    departmentId,
    currentStatus,
    setDepartmentsData,
    navigate,
    "Department"
  );
};

export const toggleCourseStatus = (
  courseId,
  currentStatus,
  setCoursesData,
  navigate
) => {
  return toggleItemStatus(
    "courses",
    courseId,
    currentStatus,
    setCoursesData,
    navigate,
    "Course"
  );
};
export const toggleSubjectStatus = (
  subjectId,
  currentStatus,
  setSubjectsData,
  navigate
) => {
  return toggleItemStatus(
    "subject",
    subjectId,
    currentStatus,
    setSubjectsData,
    navigate,
    "Subject"
  );
};
export const toggleSyllabusStatus = (
  syllabusId,
  currentStatus,
  setSyllabusData,
  navigate
) => {
  return toggleItemStatus(
    "syllabus",
    syllabusId,
    currentStatus,
    setSyllabusData,
    navigate,
    "Syllabus"
  );
};

export const toggleProgramStatus = (
  programId,
  currentStatus,
  setProgramsData,
  navigate
) => {
  return toggleItemStatus(
    "programs",
    programId,
    currentStatus,
    setProgramsData,
    navigate,
    "Program"
  );
};

export const toggleEmployeeStatus = (
  employeeId,
  currentStatus,
  setEmployeesData,
  navigate
) => {
  return toggleItemStatus(
    "employees",
    employeeId,
    currentStatus,
    setEmployeesData,
    navigate,
    "Employee"
  );
};

export const toggleBranchStatus = (
  branchId,
  currentStatus,
  setBranchesData,
  navigate
) => {
  return toggleItemStatus(
    "branch",
    branchId,
    currentStatus,
    setBranchesData,
    navigate,
    "Branch"
  );
};
