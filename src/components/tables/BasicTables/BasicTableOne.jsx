import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableFooter,
} from "../../ui/table";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import Switch from "../../form/switch/Switch";
import Button from "../../ui/button/Button";
import Pagination from "./Pagination";
import { useState } from "react";
import { useNavigate } from "react-router";
// interface Order {
//   department: string;
//   id: number;
//   user: {
//     image: string;
//     name: string;
//     role: string;
//   };
//   projectName: string;
//   team: {
//     images: string[];
//   };
//   status: string;
//   budget: string;
// }

export default function BasicTableOne({
  tableData,
  tableHeaders,
  path,
  editPath,
  isLoading
}) {
  let navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  let paginatedData = tableData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    paginatedData = tableData.filter((order) =>
      order.user.name.toLowerCase().includes(value.toLowerCase())
    );
    setCurrentPage(1);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell colSpan={7} className="px-5 py-3">
                <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-200 dark:border-white/[0.05]">
                  <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    className="border border-gray-400 px-3 py-2 rounded-md text-sm w-full max-w-xs dark:bg-[#1e2636] dark:text-white"
                  />

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => navigate(`${path}`)}
                  >
                    Add
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              {/* <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Contact No
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Salary
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Department
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Students
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell> */}
              {tableHeaders.map((header, index) => (
                <TableCell
                  key={index}
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          {/* <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {paginatedData.map((order) => (
              <TableRow key={order.id}>
                {order?.user?.name && (
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      {order?.user?.image && (
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <img
                            width={40}
                            height={40}
                            src={order.user.image}
                            alt={order.user.name}
                          />
                        </div>
                      )}
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order?.user?.name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {order?.user?.role}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                )}
                {order?.projectName && (
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order?.projectName}
                  </TableCell>
                )}
                {order?.budget && (
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order?.budget}
                  </TableCell>
                )}
                {order?.department && (
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order?.department}
                  </TableCell>
                )}
                {order?.team?.images && order?.team?.images.length > 0 && (
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex -space-x-2">
                      {order.team.images.map((teamImage, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                        >
                          <img
                            width={24}
                            height={24}
                            src={teamImage}
                            alt={`Team member ${index + 1}`}
                            className="w-full size-6"
                          />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                )}
                {/* {order.status} */}
                {/* {order?.status && (
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Switch
                      label=""
                      defaultChecked={order.status === "Active" ? true : false}
                    />
                  </TableCell>
                )}
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <span className="flex items-center gap-2">
                    <MdOutlineEdit
                      size={18}
                      className="hover:text-gray-600"
                      onClick={() => {
                        navigate(`${editPath}/${order.id}`);
                      }}
                    />
                    <MdOutlineDelete size={18} className="hover:text-red-600" />
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody> */} 
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
  {isLoading ? (
    // Render 5 skeleton rows
    Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        {[...Array(6)].map((_, cellIndex) => (
          <TableCell key={cellIndex} className="px-4 py-4">
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse w-full"></div>
          </TableCell>
        ))}
      </TableRow>
    ))
  ) : (
    paginatedData.map((order) => (
      <TableRow key={order.id}>
        {paginatedData.map((order) => (
              <TableRow key={order.id}>
                {order?.user?.name && (
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      {order?.user?.image && (
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <img
                            width={40}
                            height={40}
                            src={order.user.image}
                            alt={order.user.name}
                          />
                        </div>
                      )}
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order?.user?.name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {order?.user?.role}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                )}
                {order?.projectName && (
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order?.projectName}
                  </TableCell>
                )}
                {order?.budget && (
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order?.budget}
                  </TableCell>
                )}
                {order?.department && (
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order?.department}
                  </TableCell>
                )}
                {order?.team?.images && order?.team?.images.length > 0 && (
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex -space-x-2">
                      {order.team.images.map((teamImage, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                        >
                          <img
                            width={24}
                            height={24}
                            src={teamImage}
                            alt={`Team member ${index + 1}`}
                            className="w-full size-6"
                          />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                )}
                {/* {order.status} */}
               {order?.status && (
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Switch
                      label=""
                      defaultChecked={order.status === "Active" ? true : false}
                    />
                  </TableCell>
                )}
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <span className="flex items-center gap-2">
                    <MdOutlineEdit
                      size={18}
                      className="hover:text-gray-600"
                      onClick={() => {
                        navigate(`${editPath}/${order.id}`);
                      }}
                    />
                    <MdOutlineDelete size={18} className="hover:text-red-600" />
                  </span>
                </TableCell>
              </TableRow>
            ))}
      </TableRow>
    ))
  )}
</TableBody>

          <TableFooter className="border-t border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                colSpan={tableData.length + 1}
                className="p-4 dark:text-white/90"
              >
                <div className="w-full flex justify-center items-center text-gray-500 dark:text-white/70">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
