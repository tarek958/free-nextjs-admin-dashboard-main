"use client";
import dynamic from "next/dynamic";
import React from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/Projects";
import TableTwo from "../Tables/Posts";
import TableThree from "../Tables/Users";
import CardDataStats from "../CardDataStats";



const ECommerce: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        
      <TableThree />
          <TableOne />
          
          <TableTwo />
     
        
      </div>
    </>
  );
};

export default ECommerce;
