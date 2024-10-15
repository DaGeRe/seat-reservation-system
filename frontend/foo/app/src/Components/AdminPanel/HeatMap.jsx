import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  [
    "Location",
    "Parent",
    "Market trade volume (size)",
    "Market increase/decrease (color)",
  ],
  ["Global", null, 0, 0],
  ["Room1", "Global", 0, 0], // Original "Europe" entry
  ["Room2", "Global", 0, 0], // "Asia" replaced with "First"
  ["Room3", "Room1", 11, 10], // "Brazil" replaced with "Room1"
  ["Room4", "Room1", 52, 31], // "USA" replaced with "Room1"
  ["Room5", "Room1", 24, 12], // "Mexico" replaced with "Room1"
  ["Room6", "Room1", 16, -23], // "Canada" replaced with "Room1"
  ["Room7", "Room1", 42, -11], // "France" replaced with "Room1"
  ["Room8", "Room1", 31, -2], // "Germany" replaced with "Room1"
  ["Room9", "Room1", 22, -13], // "Sweden" replaced with "Room1"
  ["Room10", "Room1", 17, 4], // "Italy" replaced with "Room1"
  ["Room11", "Room1", 21, -5], // "UK" replaced with "Room1"
  ["Room12", "Room2", 36, 4], // "China" replaced with "Room2"
  ["Room13", "Room2", 20, -12], // "Japan" replaced with "Room2"
  ["Room14", "Room2", 40, 63], // "India" replaced with "Room2"
  ["Room15", "Room2", 4, 34], // "Laos" replaced with "Room2"
  ["Room16", "Room2", 1, -5], // "Mongolia" replaced with "Room2"
  ["Room17", "Room2", 18, 13], // "Iran" replaced with "Room2"
  ["Room18", "Room2", 11, -52], // "Pakistan" replaced with "Room2"
];

export const options = {
  minColor: "#f00",
  midColor: "#ddd",
  maxColor: "#0d0",
  headerHeight: 15,
  fontColor: "black",
  showScale: true,
  generateTooltip: (_row, _size, value) => {
    return (
      '<div style="background:#fd9; padding:10px; border-style:solid"> ' +
      value +
      "</div>"
    );
  },
};

export function HeatMap() {
  return (
    <Chart
      className="heat"
      chartType="TreeMap"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}
