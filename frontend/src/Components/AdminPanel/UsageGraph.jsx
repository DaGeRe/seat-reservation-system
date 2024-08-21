import React from "react";
import { useEffect } from "react";
import { Chart } from "react-google-charts";
import { useTranslation } from "react-i18next";

export function UsageGraph() {
  const { t } = useTranslation();
  const data = [
    [t("timePeriods"), t("numberOfBookings"), t("relativeChange")],
    [
      "08:00-10:00",
      { v: getRandomInt(5, 20), f: getRandomInt(1, 50).toString() },
      { v: getRandomInt(-10, 10), f: getRandomPercentage() },
    ],
    [
      "10:00-12:00",
      { v: getRandomInt(5, 20), f: getRandomInt(1, 50).toString() },
      { v: getRandomFloat(-10, 10), f: getRandomPercentage() },
    ],
    [
      "12:00-16:00",
      { v: getRandomInt(5, 20), f: getRandomInt(1, 50).toString() },
      { v: getRandomInt(-10, 10), f: getRandomPercentage() },
    ],
    [
      "16:00-18:00",
      { v: getRandomInt(5, 20), f: getRandomInt(1, 50).toString() },
      { v: getRandomFloat(-10, 10), f: getRandomPercentage() },
    ],
    [
      "18:00-20:00",
      { v: getRandomInt(5, 20), f: getRandomInt(1, 50).toString() },
      { v: getRandomInt(-10, 10), f: getRandomPercentage() },
    ],
  ];

  // Function to generate random integer between min and max (inclusive)
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Function to generate random float between min and max (inclusive)
  function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Function to generate random percentage string
  function getRandomPercentage() {
    return Math.random() > 0.5
      ? `${getRandomFloat(1, 50).toFixed(1)}%`
      : `-${getRandomFloat(1, 50).toFixed(1)}%`;
  }

  const options = {
    allowHtml: true,
    showRowNumber: true,
  };

  const formatters = [
    {
      type: "ArrowFormat",
      column: 2,
    },
  ];

  useEffect(() => {
    // console.log(data);
  }, [data]);
  return (
    <Chart
      style={{ width: "90vw", height: "90vh" }}
      chartType="Table"
      //   width="100%"
      //   height="100%"
      data={data}
      options={options}
      formatters={formatters}
    />
  );
}
