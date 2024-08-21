"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import Loader from "../common/Loader";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "bar",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  xaxis: {
    type: "category",
    title: {
      text: "Entreprise",
    },
    labels: {
      rotate: -45,
    },
  },
  yaxis: {
    title: {
      text: "Nombre d'utilisateurs",
    },
    min: 0,
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
  categories: string[];
}

const ChartOne: React.FC = () => {
  const [series, setSeries] = useState<ChartOneState["series"]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          
          window.location.href = '/auth/signin';
        
          setLoading(false);
          return;
        }

        const decodedToken: any = jwtDecode(token);

        const response = await axios.get("http://148.113.194.169:5000/api/users/chart-data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Transform the data to fit the chart
        const chartData = response.data;
        const categories = chartData.map((item: any) => item.name);
        
        const series = [
          {
            name: 'Users',
            data: chartData.map((item: any) => item.data[0]),
          },
        ];

        setSeries(series);
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) {
    return <div><Loader /></div>;
  }

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={{
              ...options,
              xaxis: {
                ...options.xaxis,
                categories,
              },
            }}
            series={series}
            type="bar"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
