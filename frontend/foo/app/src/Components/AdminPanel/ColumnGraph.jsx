import React from "react";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useTranslation } from "react-i18next";

export function ColumnGraph(props) {
  const { t } = useTranslation();
  const [receivedValue, setReceivedValue] = useState("");
  useEffect(() => {
    setReceivedValue(props.value);
  }, [receivedValue]);

  const data = [
    [t("dayOfTheWeek"), t("hours"), { role: "style" }],
    [t("monday"), getRandomInt(7, 20), "gold"], // RGB value
    [t("tuesday"), getRandomInt(7, 20), "gold"], // English color name
    [t("wednesday"), getRandomInt(7, 20), "gold"],
    [t("thursday"), getRandomInt(7, 20), "gold"], // CSS-style declaration
    [t("friday"), getRandomInt(7, 20), "gold"],
  ];

  // Function to generate random integer between min and max (inclusive)
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  useEffect(() => {
    // console.log(data);
  }, [data]);
  return (
    <Chart
      chartType="ColumnChart"
      width="100%"
      height="400px"
      data={data}
      //   className="column"
    />
  );
}
