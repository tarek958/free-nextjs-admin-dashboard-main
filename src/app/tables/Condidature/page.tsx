import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Condidat from "@/components/Tables/Condidature";
import TableThree from "@/components/Tables/Users";
import TableTwo from "@/components/Tables/Posts";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";



const TablesPage = () => {
  return (
    <div className="h-screen">
    <DefaultLayout>
      <Breadcrumb pageName="les tables" />

      <div className="flex flex-col gap-10">
      <ToastContainer />
        <Condidat />
        
      </div>
    </DefaultLayout>
    </div>
  );
};

export default TablesPage;
