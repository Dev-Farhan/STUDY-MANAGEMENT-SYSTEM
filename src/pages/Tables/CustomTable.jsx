import React from "react";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import Pagination from "@/components/tables/BasicTables/Pagination.tsx";
import Button from "../../components/ui/button/Button";

const CustomTable = ({
  columns,
  data,
  loading = false,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onToggle,
  // New props for dynamic header
  showSearch = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  showAddButton = false,
  addButtonText = "Add",
  onAddClick,
  // Optional image display props
  showImage = false,
  imageKey = "img_url",
  nameKey = "name",
}) => {
  return (
    <Table>
      {/* Header */}
      <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
        {/* Search and Add Button Row - Only show if either search or add button is enabled */}
        {(showSearch || showAddButton) && (
          <TableRow>
            <TableCell
              colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
              className="px-5 py-3"
            >
              <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-200 dark:border-white/[0.05]">
                {showSearch ? (
                  <input
                    type="text"
                    value={searchValue}
                    onChange={onSearchChange}
                    placeholder={searchPlaceholder}
                    className="border border-gray-400 px-3 py-2 rounded-md text-sm w-full max-w-xs dark:bg-[#1e2636] dark:text-white"
                  />
                ) : (
                  <div></div>
                )}

                {showAddButton && (
                  <Button size="sm" variant="primary" onClick={onAddClick}>
                    {addButtonText}
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        )}
        <TableRow>
          {columns.map((col, index) => (
            <TableCell
              key={index}
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              {col.label}
            </TableCell>
          ))}
          {(onEdit || onDelete) && (
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Actions
            </TableCell>
          )}
        </TableRow>
      </TableHeader>

      {/* Body */}
      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {columns.map((_, i) => (
                  <TableCell key={i} className="px-4 py-4">
                    <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse w-full"></div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          : data.map((row, rowIndex) => (
              <TableRow key={row.id || rowIndex}>
                {columns.map((col, colIndex) => {
                  // If showImage is enabled and this column is the name column, render avatar + name
                  // Support common student keys: `student_name` and `student_image_url` if imageKey/nameKey not provided
                  const detectedImage =
                    row[imageKey] || row["student_image_url"] || null;
                  const detectedNameKey =
                    col.key === nameKey ||
                    (col.key === "student_name" && row["student_name"]);
                  const isNameColumn = showImage && detectedNameKey;
                  const avatarAlt =
                    row[nameKey] || row["student_name"] || "avatar";

                  return (
                    <TableCell
                      key={colIndex}
                      className={`px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 ${
                        col.key === imageKey ? "w-20" : ""
                      }`}
                    >
                      {isNameColumn ? (
                        <div className="flex items-center gap-3">
                          {detectedImage ? (
                            <img
                              src={detectedImage}
                              alt={avatarAlt}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                          )}
                          <span>
                            {col.render
                              ? col.render(row[col.key], row)
                              : row[col.key]}
                          </span>
                        </div>
                      ) : col.render ? (
                        col.render(row[col.key], row)
                      ) : (
                        row[col.key]
                      )}
                    </TableCell>
                  );
                })}

                {(onEdit || onDelete) && (
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <span className="flex items-center gap-2">
                      {onEdit && (
                        <MdOutlineEdit
                          size={18}
                          className="hover:text-gray-600 cursor-pointer"
                          onClick={() => onEdit(row)}
                        />
                      )}
                      {onDelete && (
                        <MdOutlineDelete
                          size={18}
                          className="hover:text-red-600 cursor-pointer"
                          onClick={() => onDelete(row)}
                        />
                      )}
                    </span>
                  </TableCell>
                )}
              </TableRow>
            ))}
      </TableBody>

      {/* Footer with Pagination */}
      {totalPages > 1 && (
        <TableFooter className="border-t border-gray-100 dark:border-white/[0.05]">
          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              className="p-4 dark:text-white/90"
            >
              <div className="w-full flex justify-center items-center text-gray-500 dark:text-white/70">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
};

export default CustomTable;
