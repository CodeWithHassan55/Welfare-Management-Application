import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../components/Navbar";
import { Base_URI } from "../../core";
import style from "./voucher.module.css";

const Voucher = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const adminn = localStorage.getItem("admin");
    if (adminn !== "Ali Asghar") {
      navigate("/", { replace: true });
    }
  }, []);
  useEffect(async () => {
    const convert = localStorage.getItem("data");
    if (convert) {
      let final = JSON.parse(convert);
      let purpose = final.purpose.toString();
      purpose = purpose.replaceAll(",", " ");
      final.purpose = purpose;
      setData(final);
    }
  }, []);
  return (
    <div className={style.mainDiv}>
      <Navbar />
      <div className={style.container}>
        <h3 style={{
          textAlign: "center",
          marginBottom: "25px",
        }}>Debit Voucher</h3>
        <div className={style.data}>
          <div>
            <h4>Pay From:</h4> Shem-e-{data.cast}
          </div>
          <div>
            <h4>Name:</h4> {data.name}
          </div>
          <div>
            <h4>Father Name:</h4> {data.father_name}
          </div>
          {data.jcic_number !== undefined ? (
            <div>
              <h4>JCIC Number:</h4> {data.jcic_number}
            </div>
          ) : (
            <></>
          )}
          <div>
            <h4>CNIC Number:</h4> {data.cnic_number}
          </div>
          <div>
            <h4>Cell Number:</h4> {data.cell_number}
          </div>
          <div>
            <h4>Purpose:</h4> {data.purpose}
          </div>
          <div>
            <h4>Description:</h4> {data.description}
          </div>
          <div>
            <h4>Amount:</h4> {data.amount}
          </div>
          <div>
            <h4>Receivers Signature: _______________</h4>
          </div>
          <div className={style.btn}>
            <button onClick={() => window.print()}>Print</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voucher;