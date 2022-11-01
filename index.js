const express = require("express");
const app = express();
var path = require("path");
var cors = require("cors");

var bodyParser = require("body-parser");

app.use(cors());

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.raw());

// create application/json parser
var jsonParser = bodyParser.json();

const port = process.env.PORT || 8080;

// let data = `import Home from "./Home";
// `;

// let split = data.split(";");

// let newImport = [];

// split.forEach((data) => {
//   let newSplit = data.split(" ");

//   if (newSplit[1]) {
//     newImport.push(
//       `const ${newSplit[1]} = lazy(() => import(${newSplit[3]}));`
//     );
//   }
// });

// console.log("newImport", newImport.join(""));

app.get("/*", (req, res) => {
  res.send("Hello World");
});

let dataSelectCashClaim = {
  storeInformation: [],
  DepartementInformation: [],
};

app.post("/select-option", jsonParser, (req, res) => {
  let dataSelect = [];
  let { data, ip, name, arr } = req.body;
  if (ip) {
    if (ip === "prefecture") {
      data.forEach((data, index) => {
        dataSelect = [
          ...dataSelect,
          {
            value: data.id_prefecture,
            label: `${data.prefecture_name} ${data.prefecture_name_kana}`,
            name: "id_prefecture",
            detail: data,
          },
        ];
      });
    } else if (ip === "storeinformation") {
      data.forEach((data, index) => {
        if (arr) {
          dataSelectCashClaim = {
            ...dataSelectCashClaim,
            [name]: [
              ...dataSelectCashClaim.storeInformation,
              {
                value: data.id_code_store,
                label: data.code_store + " " + "(" + data.store_name + ")",
                name: arr ? "id_code_store" : "id_store_code",
                detail: data,
              },
            ],
          };
        } else {
          dataSelect = [
            ...dataSelect,
            {
              value: data.id_code_store,
              label: data.code_store + " " + "(" + data.store_name + ")",
              name: arr ? "id_store_code" : "id_store_code",
              detail: data,
            },
          ];
        }
      });
    } else if (ip === "departement-information") {
      data.forEach((data, index) => {
        if (arr) {
          dataSelectCashClaim = {
            ...dataSelectCashClaim,
            [name]: [
              ...dataSelectCashClaim.DepartementInformation,
              {
                value: data.id_department,
                label:
                  data.department_code + " " + "(" + data.department_name + ")",
                name: "id_department",
                id_store_code: data.id_code_store,
                detail: data,
              },
            ],
          };
        }
        dataSelect = [
          ...dataSelect,
          {
            value: data.id_department,
            label:
              data.department_code + " " + "(" + data.department_name + ")",
            name: "id_department",
            id_store_code: data.id_code_store,
            detail: data,
          },
        ];
      });
    } else if (ip === "store-section-information") {
      data.forEach((data, index) => {
        dataSelect = [
          ...dataSelect,
          {
            value: data.id_store_section,
            label:
              data.store_section_code +
              " " +
              "(" +
              data.store_section_name +
              ")",
            name: "id_store_section",
            detail: data,
          },
        ];
      });
    } else if (ip.includes("unit-information")) {
      data.forEach((data, index) => {
        dataSelect = [
          ...dataSelect,
          {
            value: data.id_unit,
            label: data.unit_code + " " + "(" + data.unit_name + ")",
            name: "id_unit",
            detail: data,
          },
        ];
      });
    } else if (ip === "bank" || ip === "general-recruitment/get/bank") {
      dataSelect = data;
    } else if (ip === "exp-category") {
      data.forEach((data, index) => {
        if (arr) {
          if (dataSelectCashClaim[name]) {
            dataSelectCashClaim = {
              ...dataSelectCashClaim,
              [name]: [
                ...dataSelectCashClaim[name],
                {
                  value: data.code_category,
                  label: data.exp_category,
                  name: "expense_category",
                  id: data.id_exp,
                  detail: data,
                },
              ],
            };
          } else {
            dataSelectCashClaim = {
              ...dataSelectCashClaim,
              expense_category: [
                {
                  value: data.code_category,
                  label: data.exp_category,
                  name: "expense_category",
                  id: data.id_exp,
                  detail: data,
                },
              ],
            };
          }
        }
      });
    }
  }

  res.json({ dataSelect, dataSelectCashClaim });
});

// app.get("/*", (req, res) => {
//   console.log("req.params", req.params[0]);
//   var options = {
//     root: path.join(__dirname),
//   };

//   console.log("options", options);
//   var fileName = req.params[0];
//   console.log("fileName", fileName);

//   res.sendFile(fileName, options, function (err) {
//     if (err) {
//       res.send(err);
//     } else {
//       console.log("Sent:", fileName);
//     }
//   });
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
