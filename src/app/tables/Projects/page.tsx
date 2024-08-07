import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/Projects";
import TableThree from "@/components/Tables/Users";
import TableTwo from "@/components/Tables/Posts";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";


const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="les tables" />

      <div className="flex flex-col gap-10">
      <ToastContainer />
        <TableOne />
        
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
