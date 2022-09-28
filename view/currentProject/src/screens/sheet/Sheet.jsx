import React from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Base_URI } from "../../core";
import style from "./sheet.module.css";
import { useNavigate } from "react-router";
import Navbar from "../../components/Navbar";
import rolling from "../../images/Rolling.gif";
import Autocomplete from "react-autocomplete";

const Sheet = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [receive, setReceive] = useState("");
  const [account, setAccount] = useState({
    s: true,
    r: false,
    ab: false,
    ansar: false,
    rent: false,
    heading: "s",
  });
  let amount = 0;
  const navigate = useNavigate();
  useEffect(() => {
    const adminn = localStorage.getItem("admin");
    if (adminn !== "Ali Asghar") {
      navigate("/", { replace: true });
    }
  }, []);
  useEffect(async () => {
    try {
      const response = await axios.get(`${Base_URI}getReceiving`);
      setReceive(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(async () => {
    try {
      const response = await axios.get(`${Base_URI}getApprovedForms`);
      setLoading(false);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);
  const voucher = (ele) => {
    localStorage.setItem("data", JSON.stringify(ele));
    navigate("/Voucher", { replace: true });
  };
  let count = 0;
  return (
    <div className={style.mainDiv}>
      {loading === true ? (
        <img src={rolling} alt="rolling" width="60px" height="60px" />
      ) : (
        <>
          <Navbar />
          <div className={style.container}>
            <div className={style.radio}>
              <h4>Account *</h4>
              <div className={style.subRadio}>
                <div className={style.subRadio2}>
                  <input
                    type="radio"
                    name="Account"
                    checked={account.s}
                    required
                    onChange={() =>
                      setAccount({
                        s: true,
                        r: false,
                        ab: false,
                        ansar: false,
                        rent: false,
                        heading: "s",
                      })
                    }
                  />
                  <label>S</label>
                </div>
                <div className={style.subRadio2}>
                  <input
                    type="radio"
                    name="Account"
                    checked={account.r}
                    required
                    onChange={() =>
                      setAccount({
                        s: false,
                        r: true,
                        ab: false,
                        ansar: false,
                        rent: false,
                        heading: "r",
                      })
                    }
                  />
                  <label>R</label>
                </div>
                <div className={style.subRadio2}>
                  <input
                    type="radio"
                    name="Account"
                    checked={account.ab}
                    required
                    onChange={() =>
                      setAccount({
                        s: false,
                        r: false,
                        ab: true,
                        ansar: false,
                        rent: false,
                        heading: "ab",
                      })
                    }
                  />
                  <label>AB</label>
                </div>
                <div className={style.subRadio2}>
                  <input
                    type="radio"
                    name="Account"
                    checked={account.ansar}
                    required
                    onChange={() =>
                      setAccount({
                        s: false,
                        r: false,
                        ab: false,
                        ansar: true,
                        rent: false,
                        heading: "ansar",
                      })
                    }
                  />
                  <label>Ansar Project</label>
                </div>
                <div className={style.subRadio2}>
                  <input
                    type="radio"
                    name="Account"
                    checked={account.rent}
                    required
                    onChange={() =>
                      setAccount({
                        s: false,
                        r: false,
                        ab: false,
                        ansar: false,
                        rent: true,
                        heading: "rent",
                      })
                    }
                  />
                  <label>Rent Assistance</label>
                </div>
              </div>
            </div>
            <div className={style.auto}>
              {data.map((ele, ind) => {
                if (ele.account === account.heading && count === 0) {
                  count++;
                  return (
                    <Autocomplete
                      key={ind}
                      getItemValue={(item) => item.cnic_number}
                      items={[ele]}
                      shouldItemRender={(item, value) =>
                        item.cnic_number
                          .toLowerCase()
                          .indexOf(value.toLowerCase()) > -1
                      }
                      renderInput={(params) => {
                        return (
                          <input
                            type="text"
                            {...params}
                            placeholder="Search Here ..."
                            className={style.purposeInput}
                          />
                        );
                      }}
                      onChange={(e) => setSearch(e.target.value)}
                      value={search}
                      renderItem={(item, isHighlighted) => (
                        <div
                          key={item._id}
                          style={{
                            background: isHighlighted ? "lightgray" : "white",
                            padding: "5px",
                          }}
                        >
                          Name: {item.name}
                          <br />
                          CNIC#: {item.cnic_number}
                        </div>
                      )}
                      onSelect={(val) => {
                        setSearch(val);
                        window.location.hash = "#" + val;
                      }}
                    />
                  );
                }
              })}
            </div>
            <h3
              style={{
                textAlign: "center",
                textTransform:
                  account.heading[1] === "b" ? "uppercase" : "capitalize",
              }}
            >
              {account.heading === "s" ||
              account.heading === "r" ||
              account.heading === "ab"
                ? account.heading + " Account"
                : account.heading === "rent"
                ? account.heading + " Assistance"
                : account.heading + " Project"}
            </h3>
            <div className={style.wrap}>
              <table border="1px solid black" cellSpacing="0px">
                <caption>
                  <h4 style={{ display: "inline-block" }}>Receiving:</h4>{" "}
                  {receive[account.heading]}
                  <h4 style={{ display: "inline-block", marginLeft: "20px" }}>
                    Date:
                  </h4>{" "}
                  {receive[account.heading + "d"]}
                </caption>
                <thead>
                  <tr>
                    <th>S.NO</th>
                    <th>Name</th>
                    <th>Father Name</th>
                    <th>JCIC Number</th>
                    <th>CNIC Number</th>
                    <th>Cell Number</th>
                    <th>Purpose</th>
                    <th className={style.noprint}>Voucher</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((ele, ind) => {
                    if (ele.account === account.heading) {
                      let convert = parseInt(ele.amount);
                      amount = amount + convert;
                      let purpose = ele.purpose.toString();
                      purpose = purpose.replaceAll(",", " ");
                      return (
                        <tr key={ind} id={ele.cnic_number}>
                          <td>{ele.serial_no}</td>
                          <td>{ele.name}</td>
                          <td>{ele.father_name}</td>
                          <td>
                            {ele.jcic_number === undefined
                              ? "-"
                              : ele.jcic_number}
                          </td>
                          <td>{ele.cnic_number}</td>
                          <td>{ele.cell_number}</td>
                          <td>
                            {purpose === "monthly"
                              ? purpose + " Support"
                              : purpose === "store"
                              ? "General " + purpose
                              : purpose}
                          </td>
                          <td className={style.noprint}>
                            <button
                              className={style.voucherBtn}
                              onClick={() => voucher(ele)}
                            >
                              Voucher
                            </button>
                          </td>
                          <td>{ele.amount}</td>
                        </tr>
                      );
                    }
                  })}
                  {amount === 0 ? (
                    <tr>
                      <td colSpan="9">
                        <h3
                          style={{
                            fontSize: "17px",
                            fontWeight: "bold",
                          }}
                        >
                          No Forms Available
                        </h3>
                      </td>
                    </tr>
                  ) : (
                    <></>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="7" className={style.amount1}>
                      Total Amount
                    </th>
                    <th colSpan="8" className={style.noprint}>
                      Total Amount
                    </th>
                    <th>{amount !== 0 ? amount : "Amount"}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className={style.btn}>
              <button onClick={() => window.print()}>Print</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sheet;
