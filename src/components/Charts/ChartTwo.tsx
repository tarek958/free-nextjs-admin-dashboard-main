"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from 'axios';

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "25%",
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: "25%",
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [], // We'll populate this with the dates from the API
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
    fontSize: "14px",
    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
  yaxis: {
    labels: {
      formatter: (value: number) => Math.round(value).toString(),
    },
  },
};

interface ChartData {
  _id: string;
  total: number;
}

const ChartTwo: React.FC = () => {
  const [series, setSeries] = useState([
    {
      name: "CV",
      data: [],
    },
    {
      name: "jour",
      data: [],
    },
  ]);

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Fetch data from the API
    axios.get('http://148.113.194.169:5000/api/filess/totaljour')
      .then(response => {
        const data: ChartData[] = response.data;

        // Prepare the data for the chart
        const dates = data.map(item => item._id);
        const totals = data.map(item => item.total);

        // Assuming you want to split the totals between "Ventes" and "Revenu"
        // This is a simple example. Adjust according to your actual data and requirements.
        const cvData = totals.map(total => Math.round(total * 0.6)); // Example transformation
        const jourData = totals.map(total => Math.round(total * 0.4)); // Example transformation


        setCategories(dates);
        setSeries([
          {
            name: "CV",
            data: cvData,
          },
          {
            name: "jour",
            data: jourData,
          },
        ]);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Profit cette semaine
          </h4>
        </div>
        <div>
         
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-mb-9 -ml-5">
          <ReactApexChart
            options={options}
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

export default ChartTwo;
