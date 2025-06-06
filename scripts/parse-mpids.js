const axios = require("axios");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const url =
  "https://www.dtcc.com/-/media/Files/Downloads/client-center/NSCC/NSCC-MPID-Directory.xls";
const outputFilePath = path.join(__dirname, "..", "lib", "mpid-data.js");

const MPID_TYPES = ["OTC", "CORP", "MUNI", "UIT"];

async function downloadSheet() {
  const response = await axios({
    url,
    method: "GET",
    responseType: "arraybuffer",
  });
  return response.data;
}

function parseSheet(buffer) {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  let allMpins = [];

  MPID_TYPES.forEach((type) => {
    const sheetName = workbook.SheetNames.find((name) =>
      name.toUpperCase().includes(type)
    );
    if (sheetName) {
      const worksheet = workbook.Sheets[sheetName];
      const json = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
      // find the header row
      let headerRowIndex = -1;
      for (let i = 0; i < json.length; i++) {
        const row = json[i];
        if (
          row.includes("EXECUTING BROKER MPID") &&
          row.includes("CLEARING BROKER") &&
          row.includes("EXECUTING BROKER NAME")
        ) {
          headerRowIndex = i;
          break;
        }
      }

      if (headerRowIndex !== -1) {
        const data = json.slice(headerRowIndex + 1);
        const mpidIndex = json[headerRowIndex].indexOf("EXECUTING BROKER MPID");
        const clearingBrokerIndex =
          json[headerRowIndex].indexOf("CLEARING BROKER");
        const brokerNameIndex = json[headerRowIndex].indexOf(
          "EXECUTING BROKER NAME"
        );

        data.forEach((row) => {
          if (
            row[mpidIndex] &&
            row[clearingBrokerIndex] &&
            row[brokerNameIndex]
          ) {
            allMpins.push({
              type,
              mpid: row[mpidIndex],
              clearingBroker: row[clearingBrokerIndex],
              brokerName: row[brokerNameIndex],
            });
          }
        });
      }
    }
  });

  return allMpins;
}

function writeDataToFile(data) {
  const fileContent = `export const mpidData = ${JSON.stringify(data, null, 2)};\n\nexport const lastRefreshed = "${new Date().toISOString()}";`;
  fs.writeFileSync(outputFilePath, fileContent);
}

async function main() {
  try {
    console.log("Downloading spreadsheet...");
    const buffer = await downloadSheet();
    console.log("Parsing spreadsheet...");
    const data = parseSheet(buffer);
    console.log(`Found ${data.length} MPIDs.`);
    console.log("Writing data to file...");
    writeDataToFile(data);
    console.log(`Data written to ${outputFilePath}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
