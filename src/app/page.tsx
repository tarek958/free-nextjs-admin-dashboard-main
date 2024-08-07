// pages/index.tsx
import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interim siteweb",
  description: "Interim Siteweb",
};

export default function Home() {
  return (
    <div>
      <DefaultLayout>
      <ECommerce />
      </DefaultLayout>
    </div>
  );
}
