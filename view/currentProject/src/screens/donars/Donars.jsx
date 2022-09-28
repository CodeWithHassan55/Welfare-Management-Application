import React from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../components/Navbar";
import { Base_URI } from "../../core";
import style from "./donars.module.css";
import { toast } from "react-toastify";

const Donars = () => {
  const [receiving, setReceiving] = useState({
    date: "",
    amount: "",
  });
  const [receive, setReceive] = useState("");
  const [refresh, setRefresh] = useState(true);
  const [type, setType] = useState({
    s: true,
    r: false,
    ab: false,
    ansar: false,
    rent: false,
  });
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
  }, [refresh]);
  const addAmount = async (e) => {
    e.preventDefault();
    let final;
    for (const key in type) {
      if (Object.hasOwnProperty.call(type, key)) {
        if (type[key]) {
          final = key;
        }
      }
    }
    
    let amount = +receiving.amount + +receive[final];
    try {
      const response = await axios.put(
        `${Base_URI}editReceiving/62c804970ce1bc6af4a59fbc`,
        {
          receiving: {
            ...receive,
            [final]: amount,
            [final + "d"]: receiving.date,
          },
        }
      );
      if (response.data.message) {
        toast.success("Amount Added Successfully");
        setRefresh(!refresh);
      } else {
        toast.warning("Amount Addition UnSuccessfull");
      }
      setReceiving({
        date: "",
        amount: "",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={style.mainDiv}>
      <Navbar />
      <div className={style.container}>
        <div className={style.radio}>
          <h4>Account *</h4>
          <div className={style.subRadio}>
            <div className={style.subRadio2}>
              <input
                type="radio"
                name="type"
                required
                checked={type.s}
                onChange={() =>
                  setType({
                    s: true,
                    r: false,
                    ab: false,
                    ansar: false,
                    rent: false,
                  })
                }
              />
              <label>S</label>
            </div>
            <div className={style.subRadio2}>
              <input
                type="radio"
                name="type"
                required
                checked={type.r}
                onChange={() =>
                  setType({
                    s: false,
                    r: true,
                    ab: false,
                    ansar: false,
                    rent: false,
                  })
                }
              />
              <label>R</label>
            </div>
            <div className={style.subRadio2}>
              <input
                type="radio"
                name="type"
                required
                checked={type.ab}
                onChange={() =>
                  setType({
                    s: false,
                    r: false,
                    ab: true,
                    ansar: false,
                    rent: false,
                  })
                }
              />
              <label>AB</label>
            </div>
            <div className={style.subRadio2}>
              <input
                type="radio"
                name="type"
                required
                checked={type.ansar}
                onChange={() =>
                  setType({
                    s: false,
                    r: false,
                    ab: false,
                    ansar: true,
                    rent: false,
                  })
                }
              />
              <label>Ansar Project</label>
            </div>
            <div className={style.subRadio2}>
              <input
                type="radio"
                name="type"
                required
                checked={type.rent}
                onChange={() =>
                  setType({
                    s: false,
                    r: false,
                    ab: false,
                    ansar: false,
                    rent: true,
                  })
                }
              />
              <label>Rent Assistance</label>
            </div>
          </div>
        </div>
        <div>
          <h4
            style={{
              display: "inline-block",
            }}
          >
            Receiving:
          </h4>{" "}
          {type.s === true ? (
            receive.s
          ) : type.r === true ? (
            receive.r
          ) : type.ab === true ? (
            receive.ab
          ) : type.ansar === true ? (
            receive.ansar
          ) : type.rent === true ? (
            receive.rent
          ) : (
            <></>
          )}
          <br />
          <h4
            style={{
              display: "inline-block",
            }}
          >
            Date:
          </h4>{" "}
          {type.s === true ? (
            receive.sd
          ) : type.r === true ? (
            receive.rd
          ) : type.ab === true ? (
            receive.abd
          ) : type.ansar === true ? (
            receive.ansard
          ) : type.rent === true ? (
            receive.rentd
          ) : (
            <></>
          )}
        </div>
        <form className={style.form} onSubmit={(e) => addAmount(e)}>
          <h4>Add Receiving</h4>
          <input
            type="number"
            placeholder="Enter your Amount"
            value={receiving.amount}
            required
            className={style.credentialField}
            onChange={(e) => {
              setReceiving({
                ...receiving,
                amount: e.target.value,
              });
            }}
          />
          <input
            type="date"
            value={receiving.date}
            required
            className={style.credentialField}
            onChange={(e) => {
              setReceiving({
                ...receiving,
                date: e.target.value,
              });
            }}
          />
          <div className={style.btn}>
            <input type="submit" value="Add" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Donars;
