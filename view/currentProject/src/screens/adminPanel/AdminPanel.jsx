import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Base_URI, PhoneApi } from "../../core";
import style from "./adminPanel.module.css";
import { useNavigate } from "react-router";
import Toast from "../../components/Toast";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import rolling from "../../images/Rolling.gif";
import Autocomplete from "react-autocomplete";
import LongMenu from "../../components/Menu";
import { ImCross } from "react-icons/im";

const AdminPanel = () => {
  const [preview, setPreview] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [arrow, setArrow] = useState({});
  const [opt, setOpt] = useState({
    Preview: false,
    Delete: false,
  });
  const [approve, setApprove] = useState([]);
  const [unapprove, setUnapprove] = useState([]);
  const [input, setInput] = useState({
    name: "",
    fname: "",
    hname: "",
    jcic_number: "",
    cnic_number: "",
    cell_number: "",
    occupation: "",
    residential_address: "",
    office: "",
    office_address: "",
    salary: "",
  });
  const [edit, setEdit] = useState("");
  const [cast, setCast] = useState({
    imam: false,
    sadaat: false,
    Imam: false,
  });
  const [dependents, setDependents] = useState({
    total: "",
    above: "",
    below: "",
  });
  const [msg, setMsg] = useState({
    image: false,
    user: false,
  });
  const [status, setStatus] = useState({
    rented: false,
    ownwed: false,
    trust: false,
  });
  const [rental, setRental] = useState("");
  const [trust, setTrust] = useState("");
  const [type, setType] = useState({
    approve: true,
    unapprove: false,
    name: approve,
  });
  const [purpose, setPurpose] = useState({
    school: false,
    hospital: false,
    academy: false,
    university: false,
    store: false,
    rent: false,
    monthly: false,
    grocery: false,
    repairing: false,
    purchasing: false,
    other: false,
  });
  const [purName, setPurName] = useState([]);
  const [purposeName, setPurposeName] = useState({
    School: "",
    Hospital: "",
    Academy: "",
    University: "",
    GeneralStore: "",
    Grocery: "",
    Repairing: "",
    Purchasing: "",
    Other: "",
  });
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState({
    s: false,
    r: false,
    ab: false,
    ansar: false,
    rent: false,
  });
  const [description, setDescription] = useState("");
  const [specific, setSpecific] = useState({
    purpose: [],
  });
  const navigate = useNavigate();
  useEffect(() => {
    const adminn = localStorage.getItem("admin");
    if (adminn !== "Ali Asghar") {
      navigate("/", { replace: true });
    }
  }, []);
  useEffect(() => {
    if (msg.user !== false) {
      if (type.approve === true) {
        setSpecific(msg.user);
      } else {
        let arr = [];
        unapprove.map((ele) => {
          if (ele._id !== msg.user._id) {
            arr.push(ele);
          } else {
            arr.push(msg.user);
          }
        });
        setUnapprove(arr);
        setType({
          ...type,
          name: arr,
        });
      }
      setLoading(false);
    }
    if (msg.image !== false) {
      if (msg.image === "Image Deleted") {
        toast.success(msg.image);
      } else {
        toast.warning(msg.image);
      }
      setTimeout(() => {
        setMsg({
          image: false,
          user: false,
        });
      }, 3000);
    }
  }, [msg]);
  useEffect(async () => {
    try {
      const response = await axios.get(`${Base_URI}getAllForms`);
      setLoading(false);
      if (response.data[0] !== undefined) {
        response.data.map((ele) => {
          if (ele.status === "UnApprove") {
            unapprove.push(ele);
            setUnapprove([...unapprove]);
          } else {
            approve.push(ele);
            setApprove([...approve]);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  const reset = () => {
    setInput({
      name: "",
      fname: "",
      hname: "",
      jcic_number: "",
      cnic_number: "",
      cell_number: "",
      occupation: "",
      residential_address: "",
      office: "",
      office_address: "",
      salary: "",
    });
    setDependents({
      total: "",
      above: "",
      below: "",
    });
    setStatus({
      rented: false,
      ownwed: false,
      trust: false,
    });
    setTrust("");
    setRental("");
    setPurpose({
      school: false,
      hospital: false,
      academy: false,
      university: false,
      store: false,
      rent: false,
      monthly: false,
      grocery: false,
      repairing: false,
      purchasing: false,
      other: false,
    });
    setPurName([]);
    setPurposeName({
      School: "",
      Hospital: "",
      Academy: "",
      University: "",
      GeneralStore: "",
      Grocery: "",
      Repairing: "",
      Purchasing: "",
      Other: "",
    });
    setDescription("");
    setAccount({
      s: false,
      r: false,
      ab: false,
      ansar: false,
      rent: false,
    });
    setCast({
      Imam: false,
      imam: false,
      sadaat: false,
    });
    setAmount("");
  };

  const [suggestions, setSuggestions] = useState({});
  useEffect(async () => {
    try {
      const response = await axios.get(`${Base_URI}getPurpose`);
      setSuggestions(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const adminForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    let final_purpose = [];
    for (const key in purpose) {
      if (purpose[key] && key !== "purName") {
        final_purpose.push(key);
      }
    }
    let final_account = "";
    for (const key in account) {
      if (account[key]) {
        final_account = key;
      }
    }
    let receiptData = {};
    try {
      const response = await axios.get(`${Base_URI}getReceiving`);
      receiptData = response.data;
    } catch (error) {
      console.log(error);
    }
    let receipt = receiptData[final_account] - amount;
    let num = "+92" + input.cell_number.slice(1, input.cell_number.length);
    try {
      const response = await axios.get(`${PhoneApi}${num}`);
      num = response.data.valid;
    } catch (error) {
      console.log(error);
    }
    if (final_purpose[0] !== undefined) {
      if (input.cnic_number.length === 13) {
        if (num) {
          if (input.jcic_number === "" || input.jcic_number.length === 16) {
            if (
              (input.jcic_number !== "" && cast.Imam === true) ||
              cast.Imam === false
            ) {
              if (receipt >= 0) {
                try {
                  const response = await axios.put(
                    `${Base_URI}editReceiving/62c804970ce1bc6af4a59fbc`,
                    {
                      receiving: {
                        ...receiptData,
                        [final_account]: receipt,
                      },
                    }
                  );
                } catch (error) {
                  console.log(error);
                }
                const date = new Date();
                const months = [
                  "January",
                  "Feburary",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ];
                const final_date = `${date.getDate()} ${
                  months[date.getMonth()]
                } ${date.getFullYear()}`;

                let final_cast = "";
                for (const key in cast) {
                  if (cast[key]) {
                    final_cast = key;
                  }
                }
                let serial_no;
                try {
                  const response = await axios.get(
                    `${Base_URI}getApprovedForms`
                  );
                  serial_no = response.data.length + 1;
                } catch (error) {
                  console.log(error);
                }
                let final_status = "";
                for (const key in status) {
                  if (status[key]) {
                    final_status = key;
                  }
                }
                let final_purposeName = {};
                for (const key in purposeName) {
                  if (purposeName[key] !== "") {
                    final_purposeName = {
                      ...final_purposeName,
                      [key]: purposeName[key],
                    };
                    let lower = key.toLowerCase();
                    let data = [];
                    suggestions[lower].map(async (ele) => {
                      data = [...data, ele.label];
                    });
                    let include = data.includes(purposeName[key]);
                    if (!include) {
                      suggestions[lower].push({ label: purposeName[key] });
                      let obj = suggestions;
                      try {
                        const response = await axios.put(
                          `${Base_URI}editPurpose/${suggestions._id}`,
                          obj
                        );
                      } catch (error) {
                        console.log(error);
                      }
                    }
                  }
                }
                const userObj = {
                  name: input.name,
                  father_name: input.fname,
                  husband_name: input.hname,
                  jcic_number: input.jcic_number,
                  cnic_number: input.cnic_number,
                  cell_number: input.cell_number,
                  occupation: input.occupation,
                  residential_address: input.residential_address,
                  office: input.office,
                  office_address: input.office_address,
                  salary: input.salary,
                  residential_status: final_status,
                  rental_amount: rental,
                  total_dependents: dependents.total,
                  above_dependents: dependents.above,
                  below_dependents: dependents.below,
                  purpose: final_purpose,
                  purpose_name: final_purposeName,
                  description,
                  status: "Approved",
                  account: final_account,
                  date: final_date,
                  cast: final_cast,
                  serial_no,
                  amount,
                  trust_name: trust,
                  image: unapprove.image,
                };
                let id;
                unapprove.map((ele) => {
                  if (ele.cnic_number === input.cnic_number) {
                    id = ele._id;
                  }
                });
                let obj = {};
                for (const key in userObj) {
                  if (Object.hasOwnProperty.call(userObj, key)) {
                    if (userObj[key] !== "" && userObj[key] !== false) {
                      obj = {
                        ...obj,
                        [key]: userObj[key],
                      };
                    }
                  }
                }
                try {
                  setLoading(false);
                  const response = await axios.put(
                    `${Base_URI}editDashboardForm/${id}`,
                    obj
                  );
                  toast.success("Form Approved");
                  setTimeout(() => {
                    window.location.reload();
                  }, 3000);
                } catch (error) {
                  console.log(error);
                }
                reset();
              } else {
                setLoading(false);
                setTimeout(() => {
                  toast.warning("InSufficient Balance");
                }, 500);
              }
            } else {
              setLoading(false);
              setTimeout(() => {
                toast.warning("JCIC Number is required for khoja");
              }, 500);
            }
          } else {
            setLoading(false);
            setTimeout(() => {
              toast.warning("Invalid JCIC Number");
            }, 500);
          }
        } else {
          setLoading(false);
          setTimeout(() => {
            toast.warning("Invalid Cell Number");
          }, 500);
        }
      } else {
        setLoading(false);
        setTimeout(() => {
          toast.warning("Invalid CNIC Number");
        }, 500);
      }
    } else {
      setLoading(false);
      setTimeout(() => {
        toast.warning("Purpose is Required");
      }, 500);
    }
  };
  const findArrow = (index) => {
    if (arrow[index] === undefined) {
      setArrow({
        [index]: index,
      });
    } else {
      delete arrow[index];
      setArrow({ ...arrow });
    }
  };
  const deleteForm = async (id) => {
    try {
      const response = await axios.delete(`${Base_URI}deleteForms/${id}`);
      type.name.map(async (ele) => {
        if (ele._id === id) {
          try {
            const response = await axios.post(`${Base_URI}deleteAllImages`, {
              image: ele.image,
            });
            console.log(response);
          } catch (error) {
            console.log(error);
          }
        }
      });
      toast.success("Form Deleted Successfully");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };
  const editForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    let final_purpose = [];
    for (const key in purpose) {
      if (purpose[key] && key !== "purName") {
        final_purpose.push(key);
      }
    }
    let fin = amount - specific.amount;
    let receipt = 0;
    let receiptData = {};
    let final_account = "";
    for (const key in account) {
      if (account[key]) {
        final_account = key;
      }
    }
    if (fin > 0) {
      try {
        const response = await axios.get(`${Base_URI}getReceiving`);
        receiptData = response.data;
      } catch (error) {
        console.log(error);
      }
      receipt = receiptData[final_account] - fin;
    }
    let num = "+92" + input.cell_number.slice(1, input.cell_number.length);
    try {
      const response = await axios.get(`${PhoneApi}${num}`);
      num = response.data.valid;
    } catch (error) {
      console.log(error);
    }
    if (final_purpose[0] !== undefined) {
      if (input.cnic_number.length === 13) {
        if (num) {
          if (input.jcic_number === "" || input.jcic_number.length === 16) {
            if (
              (input.jcic_number !== "" && cast.Imam === true) ||
              cast.Imam === false
            ) {
              if (receipt >= 0) {
                if (fin > 0) {
                  try {
                    const response = await axios.put(
                      `${Base_URI}editReceiving/62c804970ce1bc6af4a59fbc`,
                      {
                        receiving: {
                          ...receiptData,
                          [final_account]: receipt,
                        },
                      }
                    );
                  } catch (error) {
                    console.log(error);
                  }
                }
                let final_cast = "";
                for (const key in cast) {
                  if (cast[key]) {
                    final_cast = key;
                  }
                }
                let final_status = "";
                for (const key in status) {
                  if (status[key]) {
                    final_status = key;
                  }
                }
                let final_purposeName = {};
                for (const key in purposeName) {
                  if (purposeName[key] !== "") {
                    final_purposeName = {
                      ...final_purposeName,
                      [key]: purposeName[key],
                    };
                    let lower = key.toLowerCase();
                    let data = [];
                    suggestions[lower].map(async (ele) => {
                      data = [...data, ele.label];
                    });
                    let include = data.includes(purposeName[key]);
                    if (!include) {
                      suggestions[lower].push({ label: purposeName[key] });
                      let obj = suggestions;
                      try {
                        const response = await axios.put(
                          `${Base_URI}editPurpose/${suggestions._id}`,
                          obj
                        );
                      } catch (error) {
                        console.log(error);
                      }
                    }
                  }
                }
                const userObj = {
                  name: input.name,
                  father_name: input.fname,
                  husband_name: input.hname,
                  jcic_number: input.jcic_number,
                  cnic_number: input.cnic_number,
                  cell_number: input.cell_number,
                  occupation: input.occupation,
                  residential_address: input.residential_address,
                  office: input.office,
                  office_address: input.office_address,
                  salary: input.salary,
                  residential_status: final_status,
                  rental_amount: rental,
                  total_dependents: dependents.total,
                  above_dependents: dependents.above,
                  below_dependents: dependents.below,
                  purpose: final_purpose,
                  purpose_name: final_purposeName,
                  description,
                  status: "Approved",
                  account: final_account,
                  cast: final_cast,
                  amount,
                  trust_name: trust,
                  image: specific.image,
                };
                let id = specific._id;
                let obj = {};
                for (const key in userObj) {
                  if (Object.hasOwnProperty.call(userObj, key)) {
                    if (userObj[key] !== "" && userObj[key] !== false) {
                      obj = {
                        ...obj,
                        [key]: userObj[key],
                      };
                    }
                  }
                }
                try {
                  const response = await axios.put(
                    `${Base_URI}editDashboardForm/${id}`,
                    obj
                  );
                  setLoading(false);
                  toast.success("Edit Successfull");
                  setTimeout(() => {
                    window.location.reload();
                  }, 3000);
                } catch (error) {
                  console.log(error);
                }
                reset();
              } else {
                setLoading(false);
                setTimeout(() => {
                  toast.warning("InSufficient Balance");
                }, 500);
              }
            } else {
              setLoading(false);
              setTimeout(() => {
                toast.warning("JCIC Number is required for khoja");
              }, 500);
            }
          } else {
            setLoading(false);
            setTimeout(() => {
              toast.warning("Invalid JCIC Number");
            }, 500);
          }
        } else {
          setLoading(false);
          setTimeout(() => {
            toast.warning("Invalid Cell Number");
          }, 500);
        }
      } else {
        setLoading(false);
        setTimeout(() => {
          toast.warning("Invalid CNIC Number");
        }, 500);
      }
    } else {
      setLoading(false);
      setTimeout(() => {
        toast.warning("Purpose is Required");
      }, 500);
    }
    setEdit("");
  };
  useEffect(() => {
    if (specific._id !== undefined) {
      setInput({
        ...input,
        name: specific.name,
        fname: specific.father_name,
        hname: specific.husband_name === undefined ? "" : specific.husband_name,
        jcic_number:
          specific.jcic_number === undefined ? "" : specific.jcic_number,
        cnic_number: specific.cnic_number,
        cell_number: specific.cell_number,
        occupation:
          specific.occupation === undefined ? "" : specific.occupation,
        residential_address:
          specific.residential_address === undefined
            ? ""
            : specific.residential_address,
        office: specific.office === undefined ? "" : specific.office,
        office_address:
          specific.office_address === undefined ? "" : specific.office_address,
        salary: specific.salary === undefined ? "" : specific.salary,
      });
      setDependents({
        total:
          specific.total_dependents === undefined
            ? false
            : specific.total_dependents,
        above:
          specific.above_dependents === undefined
            ? false
            : specific.above_dependents,
        below:
          specific.below_dependents === undefined
            ? false
            : specific.below_dependents,
      });
      if (specific.residential_status !== undefined) {
        setStatus({
          ...status,
          [specific.residential_status]: true,
        });
      }
      if (specific.trust_name !== undefined) {
        setTrust(specific.trust_name);
      }
      if (specific.rental_amount !== undefined) {
        setRental(specific.rental_amount);
      }
      let obj = {};
      let arr2 = [];
      specific.purpose.map((element) => {
        obj = {
          ...obj,
          [element]: true,
        };
        if (element !== "monthly" && element !== "rent") {
          let len = element.slice(1, element.length);
          let copy = element.charAt(0);
          copy = copy.toUpperCase() + len;
          arr2 = [...arr2, "Name of " + copy];
        }
      });
      setPurName(arr2);
      setPurpose({
        ...purpose,
        ...obj,
      });
      setPurposeName({
        ...purposeName,
        ...specific.purpose_name,
      });
      setDescription(specific.description);
      setCast({
        ...cast,
        [specific.cast]: true,
      });
      setAccount({
        s: false,
        r: false,
        ab: false,
        rent: false,
        ansar: false,
        [specific.account]: true,
      });
      setAmount(specific.amount);
    }
  }, [specific]);
  return (
    <div className={style.mainDiv}>
      {loading === true ? (
        <img src={rolling} alt="rolling" width="60px" height="60px" />
      ) : (
        <>
          {preview !== false ? (
            <div className={style.previewImage}>
              <img src={preview} />
              <ImCross
                className={style.crossIcon}
                onClick={() => {
                  setPreview(false);
                  setOpt({
                    Preview: false,
                    Delete: false,
                  });
                }}
              />
            </div>
          ) : (
            <>
              <Navbar />
              <Toast />
              <div className={style.container}>
                <div className={style.radio}>
                  <h4>Form Type *</h4>
                  <div className={style.subRadio}>
                    <div className={style.subRadio2}>
                      <input
                        type="radio"
                        name="type"
                        required
                        checked={type.approve}
                        onChange={() => {
                          setType({
                            approve: true,
                            unapprove: false,
                            name: approve,
                          });
                          setSearch("");
                          setArrow({});
                        }}
                      />
                      <label>Approve</label>
                    </div>
                    <div className={style.subRadio2}>
                      <input
                        type="radio"
                        name="type"
                        required
                        checked={type.unapprove}
                        onChange={() => {
                          setType({
                            approve: false,
                            unapprove: true,
                            name: unapprove,
                          });
                          setSearch("");
                          setArrow({});
                        }}
                      />
                      <label>UnApprove</label>
                    </div>
                  </div>
                </div>
                <Autocomplete
                  getItemValue={(item) => item.cnic_number}
                  items={type.name}
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
                  menuStyle={{
                    backgroundColor: "white",
                    border: "1px solid grey",
                    borderRadius: "0 0 5px 5px",
                  }}
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  renderItem={(item, isHighlighted) => (
                    <div
                      key={item._id}
                      style={{
                        borderRadius: "5px",
                        background: isHighlighted ? "lightgray" : "white",
                        padding: "5px",
                      }}
                    >
                      Name: {item.name}
                      <br />
                      CNIC#: {item.cnic_number}
                    </div>
                  )}
                  onSelect={async (val) => {
                    if (type.approve === true) {
                      setLoading(true);
                      setSearch(val);
                      try {
                        const response = await axios.post(
                          `${Base_URI}getSpecificForm`,
                          { cnic_number: val }
                        );
                        setLoading(false);
                        setSpecific(response.data);
                      } catch (error) {
                        console.log(error);
                      }
                    } else {
                      setSearch(val);
                      window.location.hash = "#" + val;
                      type.name.map((ele, ind) => {
                        if (ele.cnic_number === val) {
                          setArrow({
                            [ind]: ind,
                          });
                        }
                      });
                    }
                  }}
                />
                <div className={style.formType}>
                  {type.unapprove === true ? (
                    unapprove.map((ele, index) => {
                      if (arrow[index] === index) {
                        if (input.cnic_number !== ele.cnic_number) {
                          setInput({
                            ...input,
                            name: ele.name,
                            fname: ele.father_name,
                            hname:
                              ele.husband_name === undefined
                                ? ""
                                : ele.husband_name,
                            jcic_number:
                              ele.jcic_number === undefined
                                ? ""
                                : ele.jcic_number,
                            cnic_number: ele.cnic_number,
                            cell_number: ele.cell_number,
                            occupation:
                              ele.occupation === undefined
                                ? ""
                                : ele.occupation,
                            residential_address:
                              ele.residential_address === undefined
                                ? ""
                                : ele.residential_address,
                            office: ele.office === undefined ? "" : ele.office,
                            office_address:
                              ele.office_address === undefined
                                ? ""
                                : ele.office_address,
                            salary: ele.salary === undefined ? "" : ele.salary,
                          });
                          setDependents({
                            total:
                              ele.total_dependents === undefined
                                ? false
                                : ele.total_dependents,
                            above:
                              ele.above_dependents === undefined
                                ? false
                                : ele.above_dependents,
                            below:
                              ele.below_dependents === undefined
                                ? false
                                : ele.below_dependents,
                          });
                          if (ele.residential_status !== undefined) {
                            setStatus({
                              ...status,
                              [ele.residential_status]: true,
                            });
                          }
                          if (ele.trust_name !== undefined) {
                            setTrust(ele.trust_name);
                          }
                          if (ele.rental_amount !== undefined) {
                            setRental(ele.rental_amount);
                          }
                          let obj = {};
                          let arr2 = [];
                          ele.purpose.map((element) => {
                            obj = {
                              ...obj,
                              [element]: true,
                            };
                            if (element !== "monthly" && element !== "rent") {
                              let len = element.slice(1, element.length);
                              let copy = element.charAt(0);
                              copy = copy.toUpperCase() + len;
                              arr2 = [...arr2, "Name of " + copy];
                            }
                          });
                          setPurName(arr2);
                          setPurpose({
                            ...purpose,
                            ...obj,
                          });
                          setPurposeName({
                            ...purposeName,
                            ...ele.purpose_name,
                          });
                          setDescription(ele.description);
                          setCast({
                            ...cast,
                            [ele.cast]: true,
                          });
                        }
                      }
                      return (
                        <div key={index} id={ele.cnic_number}>
                          {type.unapprove === true ? (
                            <div className={style.subFormType}>
                              <h4>
                                {ele.serial_no !== undefined ? (
                                  ele.serial_no + "."
                                ) : (
                                  <></>
                                )}{" "}
                                {ele.name}
                              </h4>
                              <span onClick={() => findArrow(index)}>
                                {arrow[index] === undefined ? (
                                  <IoIosArrowDown className={style.arrow} />
                                ) : (
                                  <IoIosArrowUp className={style.arrow} />
                                )}
                              </span>
                            </div>
                          ) : (
                            <></>
                          )}
                          {type.unapprove === true ? (
                            arrow[index] === undefined ? (
                              <></>
                            ) : (
                              <div className={style.unapproveData}>
                                <form onSubmit={(e) => adminForm(e)}>
                                  <div className={style.section}>
                                    <div className={style.subSection1}>
                                      <div className={style.subSection2}>
                                        <input
                                          className={style.credentialField}
                                          type="text"
                                          name="name"
                                          placeholder="Name as per CNIC *"
                                          autoCapitalize="word"
                                          required
                                          value={input.name}
                                          onChange={(e) =>
                                            setInput({
                                              ...input,
                                              name: e.target.value,
                                            })
                                          }
                                        />
                                        <input
                                          className={style.credentialField}
                                          type="text"
                                          placeholder="Father Name as per CNIC *"
                                          autoCapitalize="word"
                                          required
                                          value={input.fname}
                                          onChange={(e) =>
                                            setInput({
                                              ...input,
                                              fname: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                      <div className={style.subSection2}>
                                        <input
                                          className={style.credentialField}
                                          type="text"
                                          placeholder="Husband Name"
                                          autoCapitalize="word"
                                          value={input.hname}
                                          onChange={(e) =>
                                            setInput({
                                              ...input,
                                              hname: e.target.value,
                                            })
                                          }
                                        />
                                        <input
                                          className={style.credentialField}
                                          type="number"
                                          placeholder="JCIC Number"
                                          value={input.jcic_number}
                                          onChange={(e) =>
                                            setInput({
                                              ...input,
                                              jcic_number: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                      <div className={style.subSection2}>
                                        <input
                                          className={style.credentialField}
                                          type="number"
                                          placeholder="CNIC Number *"
                                          required
                                          value={input.cnic_number}
                                          onChange={(e) =>
                                            setInput({
                                              ...input,
                                              cnic_number: e.target.value,
                                            })
                                          }
                                        />
                                        <input
                                          className={style.credentialField}
                                          type="tel"
                                          name="phone"
                                          placeholder="Cell Number *"
                                          required
                                          pattern="03[0-9]{2}(?!1234567)(?!1111111)(?!7654321)[0-9]{7}"
                                          title="03xxxxxxxxx"
                                          value={input.cell_number}
                                          onChange={(e) =>
                                            setInput({
                                              ...input,
                                              cell_number: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                      <div className={style.subSection2}>
                                        <input
                                          className={style.credentialField}
                                          type="text"
                                          placeholder="Occupation"
                                          autoCapitalize="word"
                                          value={input.occupation}
                                          onChange={(e) =>
                                            setInput({
                                              ...input,
                                              occupation: e.target.value,
                                            })
                                          }
                                        />
                                        <input
                                          className={style.credentialField}
                                          type="text"
                                          placeholder="Residential Address"
                                          autoCapitalize="word"
                                          value={input.residential_address}
                                          onChange={(e) =>
                                            setInput({
                                              ...input,
                                              residential_address:
                                                e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                      <div className={style.subSection2}>
                                        <input
                                          className={style.credentialField}
                                          type="text"
                                          placeholder="Office"
                                          autoCapitalize="word"
                                          value={input.office}
                                          onChange={(e) =>
                                            setInput({
                                              ...input,
                                              office: e.target.value,
                                            })
                                          }
                                        />
                                        <input
                                          className={style.credentialField}
                                          type="text"
                                          placeholder="Office Address"
                                          autoCapitalize="word"
                                          value={input.office_address}
                                          onChange={(e) =>
                                            setInput({
                                              ...input,
                                              office_address: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                      <input
                                        className={style.credentialField}
                                        type="number"
                                        placeholder="Salary"
                                        value={input.salary}
                                        onChange={(e) =>
                                          setInput({
                                            ...input,
                                            salary: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className={style.radio}>
                                    <h4>Cast *</h4>
                                    <div className={style.subRadio}>
                                      <div className={style.subRadio2}>
                                        <input
                                          type="radio"
                                          name="cast"
                                          required
                                          checked={cast.Imam}
                                          onChange={() =>
                                            setCast({
                                              Imam: true,
                                              sadaat: false,
                                              imam: false,
                                            })
                                          }
                                        />
                                        <label>Khoja</label>
                                      </div>
                                      <div className={style.subRadio2}>
                                        <input
                                          type="radio"
                                          name="cast"
                                          required
                                          checked={cast.sadaat}
                                          onChange={() =>
                                            setCast({
                                              imam: false,
                                              sadaat: true,
                                              Imam: false,
                                            })
                                          }
                                        />
                                        <label>Syed</label>
                                      </div>
                                      <div className={style.subRadio2}>
                                        <input
                                          type="radio"
                                          name="cast"
                                          required
                                          checked={cast.imam}
                                          onChange={() =>
                                            setCast({
                                              imam: true,
                                              sadaat: false,
                                              Imam: false,
                                            })
                                          }
                                        />
                                        <label>Non-Khoja Non-Syed</label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className={style.radio}>
                                    <h4>Residential Status</h4>
                                    <div className={style.subRadio}>
                                      <div className={style.subRadio2}>
                                        <input
                                          type="radio"
                                          name="Status"
                                          checked={status.rented}
                                          onChange={() =>
                                            setStatus({
                                              rented: true,
                                              ownwed: false,
                                              trust: false,
                                            })
                                          }
                                        />
                                        <label>Rented</label>
                                      </div>
                                      <div className={style.subRadio2}>
                                        <input
                                          type="radio"
                                          name="Status"
                                          checked={status.ownwed}
                                          onChange={() =>
                                            setStatus({
                                              rented: false,
                                              ownwed: true,
                                              trust: false,
                                            })
                                          }
                                        />
                                        <label>Owned</label>
                                      </div>
                                      <div className={style.subRadio2}>
                                        <input
                                          type="radio"
                                          name="Status"
                                          checked={status.trust}
                                          onChange={() =>
                                            setStatus({
                                              rented: false,
                                              ownwed: false,
                                              trust: true,
                                            })
                                          }
                                        />
                                        <label>Trust</label>
                                      </div>
                                    </div>
                                  </div>
                                  {status.rented === true ? (
                                    <div className={style.rental}>
                                      <input
                                        type="number"
                                        placeholder="Rent Amount"
                                        className={style.credentialField}
                                        value={rental}
                                        onChange={(e) =>
                                          setRental(e.target.value)
                                        }
                                      />
                                    </div>
                                  ) : status.trust === true ? (
                                    <div className={style.rental}>
                                      <input
                                        type="text"
                                        placeholder="Trust Name"
                                        className={style.credentialField}
                                        required
                                        style={{
                                          display: "block",
                                          marginBottom: "10px",
                                        }}
                                        value={trust}
                                        onChange={(e) =>
                                          setTrust(e.target.value)
                                        }
                                      />
                                      <input
                                        type="number"
                                        placeholder="Trust Amount"
                                        className={style.credentialField}
                                        value={rental}
                                        onChange={(e) =>
                                          setRental(e.target.value)
                                        }
                                      />
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                  <div className={style.dependents}>
                                    <h4>Number of Dependents</h4>
                                    <input
                                      type="number"
                                      placeholder="Total Dependents"
                                      readOnly
                                      style={{
                                        outline: "none",
                                      }}
                                      className={style.credentialField}
                                      value={dependents.total}
                                    />
                                    <div className={style.subDependents}>
                                      <input
                                        type="number"
                                        placeholder="Dependents Above 18"
                                        className={style.credentialField}
                                        value={dependents.above}
                                        onChange={(e) =>
                                          setDependents({
                                            ...dependents,
                                            above: e.target.value,
                                            total:
                                              +e.target.value +
                                              +dependents.below,
                                          })
                                        }
                                      />
                                      <input
                                        type="number"
                                        placeholder="Dependents Below 18"
                                        className={style.credentialField}
                                        value={dependents.below}
                                        onChange={(e) =>
                                          setDependents({
                                            ...dependents,
                                            below: e.target.value,
                                            total:
                                              +e.target.value +
                                              +dependents.above,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className={style.purpose}>
                                    <h4>Purpose *</h4>
                                    <div className={style.subPurpose}>
                                      <div className={style.subPurpose2}>
                                        <input
                                          type="checkbox"
                                          name="purpose"
                                          checked={purpose.school}
                                          onChange={() => {
                                            setPurpose({
                                              ...purpose,
                                              school:
                                                purpose.school === true
                                                  ? false
                                                  : true,
                                            });
                                            purpose.school !== true
                                              ? setPurName([
                                                  ...purName,
                                                  "Name of School",
                                                ])
                                              : purName.map((ele, ind) => {
                                                  if (
                                                    ele === "Name of School"
                                                  ) {
                                                    purName.splice(ind, 1);
                                                    setPurName([...purName]);
                                                  }
                                                });
                                          }}
                                          disabled={purpose.monthly === true}
                                        />
                                        <label>School</label>
                                      </div>
                                      <div className={style.subPurpose2}>
                                        <input
                                          type="checkbox"
                                          name="purpose"
                                          checked={purpose.hospital}
                                          onChange={() => {
                                            setPurpose({
                                              ...purpose,
                                              hospital:
                                                purpose.hospital === true
                                                  ? false
                                                  : true,
                                            });
                                            purpose.hospital !== true
                                              ? setPurName([
                                                  ...purName,
                                                  "Name of Hospital",
                                                ])
                                              : purName.map((ele, ind) => {
                                                  if (
                                                    ele === "Name of Hospital"
                                                  ) {
                                                    purName.splice(ind, 1);
                                                    setPurName([...purName]);
                                                  }
                                                });
                                          }}
                                          disabled={purpose.monthly === true}
                                        />
                                        <label>Hospital</label>
                                      </div>
                                      <div className={style.subPurpose2}>
                                        <input
                                          type="checkbox"
                                          name="purpose"
                                          checked={purpose.academy}
                                          onChange={() => {
                                            setPurpose({
                                              ...purpose,
                                              academy:
                                                purpose.academy === true
                                                  ? false
                                                  : true,
                                            });
                                            purpose.academy !== true
                                              ? setPurName([
                                                  ...purName,
                                                  "Name of Academy",
                                                ])
                                              : purName.map((ele, ind) => {
                                                  if (
                                                    ele === "Name of Academy"
                                                  ) {
                                                    purName.splice(ind, 1);
                                                    setPurName([...purName]);
                                                  }
                                                });
                                          }}
                                          disabled={purpose.monthly === true}
                                        />
                                        <label>Academy</label>
                                      </div>
                                      <div className={style.subPurpose2}>
                                        <input
                                          type="checkbox"
                                          name="purpose"
                                          checked={purpose.university}
                                          onChange={() => {
                                            setPurpose({
                                              ...purpose,
                                              university:
                                                purpose.university === true
                                                  ? false
                                                  : true,
                                            });
                                            purpose.university !== true
                                              ? setPurName([
                                                  ...purName,
                                                  "Name of University",
                                                ])
                                              : purName.map((ele, ind) => {
                                                  if (
                                                    ele === "Name of University"
                                                  ) {
                                                    purName.splice(ind, 1);
                                                    setPurName([...purName]);
                                                  }
                                                });
                                          }}
                                          disabled={purpose.monthly === true}
                                        />
                                        <label>University</label>
                                      </div>
                                      <div className={style.subPurpose2}>
                                        <input
                                          type="checkbox"
                                          name="purpose"
                                          checked={purpose.store}
                                          onChange={() => {
                                            setPurpose({
                                              ...purpose,
                                              store:
                                                purpose.store === true
                                                  ? false
                                                  : true,
                                            });
                                            purpose.store !== true
                                              ? setPurName([
                                                  ...purName,
                                                  "Name of General Store",
                                                ])
                                              : purName.map((ele, ind) => {
                                                  if (
                                                    ele ===
                                                    "Name of General Store"
                                                  ) {
                                                    purName.splice(ind, 1);
                                                    setPurName([...purName]);
                                                  }
                                                });
                                          }}
                                          disabled={purpose.monthly === true}
                                        />
                                        <label>General Store</label>
                                      </div>
                                      <div className={style.subPurpose2}>
                                        <input
                                          type="checkbox"
                                          name="purpose"
                                          checked={purpose.rent}
                                          onChange={() => {
                                            setPurpose({
                                              ...purpose,
                                              rent:
                                                purpose.rent === true
                                                  ? false
                                                  : true,
                                            });
                                          }}
                                          disabled={purpose.monthly === true}
                                        />
                                        <label>Rent</label>
                                      </div>
                                      <div className={style.subPurpose2}>
                                        <input
                                          type="checkbox"
                                          name="purpose"
                                          checked={purpose.monthly}
                                          onChange={() => {
                                            if (purpose.monthly === false) {
                                              setPurpose({
                                                school: false,
                                                hospital: false,
                                                academy: false,
                                                university: false,
                                                store: false,
                                                rent: false,
                                                monthly: true,
                                                grocery: false,
                                                repairing: false,
                                                purchasing: false,
                                                other: false,
                                              });
                                              setPurName([]);
                                              setPurposeName({
                                                School: "",
                                                Hospital: "",
                                                Academy: "",
                                                university: "",
                                                GeneralStore: "",
                                                Grocery: "",
                                                Repairing: "",
                                                Purchasing: "",
                                                Other: "",
                                              });
                                            } else {
                                              setPurpose({
                                                ...purpose,
                                                monthly: false,
                                              });
                                            }
                                          }}
                                        />
                                        <label>Monthly Support</label>
                                      </div>
                                      <div className={style.subPurpose2}>
                                        <input
                                          type="checkbox"
                                          name="purpose"
                                          checked={purpose.grocery}
                                          onChange={() => {
                                            setPurpose({
                                              ...purpose,
                                              grocery:
                                                purpose.grocery === true
                                                  ? false
                                                  : true,
                                            });
                                            purpose.grocery !== true
                                              ? setPurName([
                                                  ...purName,
                                                  "Name of Grocery",
                                                ])
                                              : purName.map((ele, ind) => {
                                                  if (
                                                    ele === "Name of Grocery"
                                                  ) {
                                                    purName.splice(ind, 1);
                                                    setPurName([...purName]);
                                                  }
                                                });
                                          }}
                                          disabled={purpose.monthly === true}
                                        />
                                        <label>Grocery</label>
                                      </div>
                                      <div className={style.subPurpose2}>
                                        <input
                                          type="checkbox"
                                          name="purpose"
                                          checked={purpose.repairing}
                                          onChange={() => {
                                            setPurpose({
                                              ...purpose,
                                              repairing:
                                                purpose.repairing === true
                                                  ? false
                                                  : true,
                                            });
                                            purpose.repairing !== true
                                              ? setPurName([
                                                  ...purName,
                                                  "Name of Repairing",
                                                ])
                                              : purName.map((ele, ind) => {
                                                  if (
                                                    ele === "Name of Repairing"
                                                  ) {
                                                    purName.splice(ind, 1);
                                                    setPurName([...purName]);
                                                  }
                                                });
                                          }}
                                          disabled={purpose.monthly === true}
                                        />
                                        <label>Repairing</label>
                                      </div>
                                      <div className={style.subPurpose2}>
                                        <input
                                          type="checkbox"
                                          name="purpose"
                                          checked={purpose.purchasing}
                                          onChange={() => {
                                            setPurpose({
                                              ...purpose,
                                              purchasing:
                                                purpose.purchasing === true
                                                  ? false
                                                  : true,
                                            });
                                            purpose.purchasing !== true
                                              ? setPurName([
                                                  ...purName,
                                                  "Name of Purchasing",
                                                ])
                                              : purName.map((ele, ind) => {
                                                  if (
                                                    ele === "Name of Purchasing"
                                                  ) {
                                                    purName.splice(ind, 1);
                                                    setPurName([...purName]);
                                                  }
                                                });
                                          }}
                                          disabled={purpose.monthly === true}
                                        />
                                        <label>Purchasing</label>
                                      </div>
                                      <div className={style.subPurpose2}>
                                        <input
                                          type="checkbox"
                                          name="purpose"
                                          checked={purpose.other}
                                          onChange={() => {
                                            setPurpose({
                                              ...purpose,
                                              other:
                                                purpose.other === true
                                                  ? false
                                                  : true,
                                            });
                                            purpose.other !== true
                                              ? setPurName([
                                                  ...purName,
                                                  "Name of Other",
                                                ])
                                              : purName.map((ele, ind) => {
                                                  if (ele === "Name of Other") {
                                                    purName.splice(ind, 1);
                                                    setPurName([...purName]);
                                                  }
                                                });
                                          }}
                                          disabled={purpose.monthly === true}
                                        />
                                        <label>Other</label>
                                      </div>
                                    </div>
                                  </div>
                                  {purName[0] !== undefined ? (
                                    <div className={style.purposeName}>
                                      {purName.map((ele, ind) => {
                                        if (ele !== undefined) {
                                          let copy = ele.slice(8, ele.length);
                                          let final = copy.replace(" ", "");
                                          if (final === "Store") {
                                            final = "General" + final;
                                          }
                                          let suggest = final.toLowerCase();
                                          return (
                                            <Autocomplete
                                              key={ind}
                                              getItemValue={(item) =>
                                                item.label
                                              }
                                              items={suggestions[suggest]}
                                              shouldItemRender={(item, value) =>
                                                item.label
                                                  .toLowerCase()
                                                  .indexOf(
                                                    value.toLowerCase()
                                                  ) > -1
                                              }
                                              renderInput={(params) => {
                                                return (
                                                  <input
                                                    type="text"
                                                    {...params}
                                                    className={
                                                      style.purposeInput
                                                    }
                                                    placeholder={ele}
                                                    required
                                                  />
                                                );
                                              }}
                                              value={purposeName[final]}
                                              onChange={(e) =>
                                                setPurposeName({
                                                  ...purposeName,
                                                  [final]: e.target.value,
                                                })
                                              }
                                              renderItem={(
                                                item,
                                                isHighlighted
                                              ) => (
                                                <div
                                                  className={style.size}
                                                  key={item.label}
                                                  style={{
                                                    background: isHighlighted
                                                      ? "lightgray"
                                                      : "white",
                                                    padding: "5px",
                                                  }}
                                                >
                                                  {item.label}
                                                </div>
                                              )}
                                              onSelect={(val) =>
                                                setPurposeName({
                                                  ...purposeName,
                                                  [final]: val,
                                                })
                                              }
                                            />
                                          );
                                        }
                                      })}
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                  <textarea
                                    placeholder="Enter Your Description Here... *"
                                    cols="40"
                                    rows="8"
                                    value={description}
                                    required
                                    onChange={(e) =>
                                      setDescription(e.target.value)
                                    }
                                  ></textarea>
                                  <div className={style.uploads}>
                                    {ele.image.map((elem, indx) => {
                                      return (
                                        <div key={indx}>
                                          <img
                                            src={elem.url}
                                            width="120px"
                                            height="120px"
                                            className={style.small}
                                          />
                                          <LongMenu
                                            state={{ opt, setOpt }}
                                            pre={{ preview, setPreview }}
                                            message={{ msg, setMsg }}
                                            public_id={elem.public_id}
                                            url={elem.url}
                                            elementt={ele}
                                            load={setLoading}
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>
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
                                            })
                                          }
                                        />
                                        <label>AB</label>
                                      </div>
                                      {purpose.rent === true ? (
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
                                              })
                                            }
                                          />
                                          <label>Rent Assistance</label>
                                        </div>
                                      ) : (
                                        <></>
                                      )}
                                      {purpose.monthly === true ? (
                                        <>
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
                                                })
                                              }
                                            />
                                            <label>Rent Assistance</label>
                                          </div>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </div>
                                  <input
                                    type="number"
                                    placeholder="Amount *"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                  />
                                  <div className={style.btn}>
                                    <button onClick={() => deleteForm(ele._id)}>
                                      Delete
                                    </button>
                                    <input type="submit" value="Approve" />
                                  </div>
                                </form>
                              </div>
                            )
                          ) : (
                            <></>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <></>
                  )}
                  {type.approve === true ? (
                    edit === "" ? (
                      <>
                        {specific._id === undefined ? (
                          <></>
                        ) : (
                          <div className={style.approveData}>
                            <div>
                              <h4>Serial Number:</h4> {specific.serial_no}
                            </div>
                            <div className={style.date}>
                              <h4>Date:</h4> {specific.date}
                            </div>
                            <div>
                              <h4>Name:</h4> {specific.name}
                            </div>
                            <div>
                              <h4>Father Name:</h4> {specific.father_name}
                            </div>
                            {specific.husband_name !== undefined ? (
                              <div>
                                <h4>Husband Name:</h4> {specific.husband_name}
                              </div>
                            ) : (
                              <></>
                            )}
                            {specific.jcic_number !== undefined ? (
                              <div>
                                <h4>JCIC Number:</h4> {specific.jcic_number}
                              </div>
                            ) : (
                              <></>
                            )}
                            <div>
                              <h4>CNIC Number:</h4> {specific.cnic_number}
                            </div>
                            <div>
                              <h4>Cell Number:</h4> {specific.cell_number}
                            </div>
                            {specific.occupation !== undefined ? (
                              <div>
                                <h4>Occupation:</h4> {specific.occupation}
                              </div>
                            ) : (
                              <></>
                            )}
                            <div>
                              <h4>Cast:</h4> Shem-e-{specific.cast}
                            </div>
                            {specific.residential_address !== undefined ? (
                              <div>
                                <h4>Residential Address:</h4>{" "}
                                {specific.residential_address}
                              </div>
                            ) : (
                              <></>
                            )}
                            {specific.office !== undefined ? (
                              <div>
                                <h4>Office:</h4> {specific.office}
                              </div>
                            ) : (
                              <></>
                            )}
                            {specific.office_address !== undefined ? (
                              <div>
                                <h4>Office Address:</h4>{" "}
                                {specific.office_address}
                              </div>
                            ) : (
                              <></>
                            )}
                            {specific.salary !== undefined ? (
                              <div>
                                <h4>Salary:</h4> {specific.salary}
                              </div>
                            ) : (
                              <></>
                            )}
                            {specific.residential_status !== undefined ? (
                              <div>
                                <h4>Residential Status:</h4>{" "}
                                {specific.residential_status}
                              </div>
                            ) : (
                              <></>
                            )}
                            {specific.trust_name !== undefined ? (
                              <div>
                                <h4>Trust Name:</h4> {specific.trust_name}
                              </div>
                            ) : (
                              <></>
                            )}
                            {specific.rental_amount !== undefined ? (
                              <div>
                                <h4>
                                  {specific.residential_status === "trust"
                                    ? "Trust"
                                    : "Rented"}{" "}
                                  Amount:
                                </h4>{" "}
                                {specific.rental_amount}
                              </div>
                            ) : (
                              <></>
                            )}
                            {specific.total_dependents !== undefined ? (
                              <div>
                                <h4>Total Dependents:</h4>{" "}
                                {specific.total_dependents}
                              </div>
                            ) : (
                              <></>
                            )}
                            {specific.above_dependents !== undefined ? (
                              <div>
                                <h4>Dependents Above 18:</h4>{" "}
                                {specific.above_dependents}
                              </div>
                            ) : (
                              <></>
                            )}
                            {specific.below_dependents !== undefined ? (
                              <div>
                                <h4>Dependents Below 18:</h4>{" "}
                                {specific.below_dependents}
                              </div>
                            ) : (
                              <></>
                            )}
                            <div>
                              <h4>Purpose:</h4>{" "}
                              {specific.purpose.map((ele, ind) => {
                                let ko;
                                if (ele === "monthly") {
                                  ko = ele + " Support";
                                } else if (ele === "store") {
                                  ko = "General " + ele;
                                } else {
                                  ko = ele;
                                }
                                return (
                                  <div key={ind}>{ind + 1 + ". " + ko}</div>
                                );
                              })}
                            </div>
                            {specific.purpose.includes("monthly") ||
                            specific.purpose.includes("rent") ? (
                              <></>
                            ) : (
                              <div className={style.pur}>
                                <h4>Purpose Name:</h4>
                                {specific.purpose.map((element, inde) => {
                                  let num = inde + 1;
                                  let len = element.slice(1, element.length);
                                  let copy = element.charAt(0);
                                  copy = copy.toUpperCase() + len;
                                  if (copy === "Store") {
                                    copy = "General" + copy;
                                  }
                                  return (
                                    <div key={inde}>
                                      {num +
                                        ". " +
                                        element +
                                        ": " +
                                        specific.purpose_name[copy]}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            <div>
                              <h4>Description:</h4> {specific.description}
                            </div>
                            <div
                              className={style.uploads}
                              style={{ margin: 0, marginTop: "15px" }}
                            >
                              {specific.image.map((ele, ind) => {
                                return (
                                  <div key={ind}>
                                    <img
                                      src={ele.url}
                                      width="120px"
                                      height="120px"
                                      className={style.small}
                                      onClick={() => {
                                        setPreview(ele.url);
                                      }}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                            <div style={{ textTransform: "uppercase" }}>
                              <h4 style={{ textTransform: "capitalize" }}>
                                Account:
                              </h4>{" "}
                              {specific.account}{" "}
                              {specific.account === "ansar" ? (
                                "Project"
                              ) : (
                                <>
                                  {specific.account === "rent" ? (
                                    "Assistance"
                                  ) : (
                                    <></>
                                  )}
                                </>
                              )}
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                              <h4>Amount:</h4> {specific.amount}
                            </div>
                            <br />
                            <br />
                            <div className={style.btnDiv}>
                              <button
                                onClick={() => {
                                  setEdit("Hello");
                                }}
                                className={style.edit}
                              >
                                Edit
                              </button>
                              <button onClick={() => deleteForm(specific._id)}>
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className={style.unapproveData}>
                        <form onSubmit={(e) => editForm(e)}>
                          <div className={style.section}>
                            <div className={style.subSection1}>
                              <div className={style.subSection2}>
                                <input
                                  className={style.credentialField}
                                  type="text"
                                  name="name"
                                  placeholder="Name as per CNIC *"
                                  autoCapitalize="word"
                                  required
                                  value={input.name}
                                  onChange={(e) =>
                                    setInput({
                                      ...input,
                                      name: e.target.value,
                                    })
                                  }
                                />
                                <input
                                  className={style.credentialField}
                                  type="text"
                                  placeholder="Father Name as per CNIC *"
                                  autoCapitalize="word"
                                  required
                                  value={input.fname}
                                  onChange={(e) =>
                                    setInput({
                                      ...input,
                                      fname: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className={style.subSection2}>
                                <input
                                  className={style.credentialField}
                                  type="text"
                                  placeholder="Husband Name"
                                  autoCapitalize="word"
                                  value={input.hname}
                                  onChange={(e) =>
                                    setInput({
                                      ...input,
                                      hname: e.target.value,
                                    })
                                  }
                                />
                                <input
                                  className={style.credentialField}
                                  type="number"
                                  placeholder="JCIC Number"
                                  value={input.jcic_number}
                                  onChange={(e) =>
                                    setInput({
                                      ...input,
                                      jcic_number: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className={style.subSection2}>
                                <input
                                  className={style.credentialField}
                                  type="number"
                                  placeholder="CNIC Number *"
                                  required
                                  value={input.cnic_number}
                                  onChange={(e) =>
                                    setInput({
                                      ...input,
                                      cnic_number: e.target.value,
                                    })
                                  }
                                />
                                <input
                                  className={style.credentialField}
                                  type="tel"
                                  name="phone"
                                  placeholder="Cell Number *"
                                  required
                                  pattern="03[0-9]{2}(?!1234567)(?!1111111)(?!7654321)[0-9]{7}"
                                  title="03xxxxxxxxx"
                                  value={input.cell_number}
                                  onChange={(e) =>
                                    setInput({
                                      ...input,
                                      cell_number: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className={style.subSection2}>
                                <input
                                  className={style.credentialField}
                                  type="text"
                                  placeholder="Occupation"
                                  autoCapitalize="word"
                                  value={input.occupation}
                                  onChange={(e) =>
                                    setInput({
                                      ...input,
                                      occupation: e.target.value,
                                    })
                                  }
                                />
                                <input
                                  className={style.credentialField}
                                  type="text"
                                  placeholder="Residential Address"
                                  autoCapitalize="word"
                                  value={input.residential_address}
                                  onChange={(e) =>
                                    setInput({
                                      ...input,
                                      residential_address: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className={style.subSection2}>
                                <input
                                  className={style.credentialField}
                                  type="text"
                                  placeholder="Office"
                                  autoCapitalize="word"
                                  value={input.office}
                                  onChange={(e) =>
                                    setInput({
                                      ...input,
                                      office: e.target.value,
                                    })
                                  }
                                />
                                <input
                                  className={style.credentialField}
                                  type="text"
                                  placeholder="Office Address"
                                  autoCapitalize="word"
                                  value={input.office_address}
                                  onChange={(e) =>
                                    setInput({
                                      ...input,
                                      office_address: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <input
                                className={style.credentialField}
                                type="number"
                                placeholder="Salary"
                                value={input.salary}
                                onChange={(e) =>
                                  setInput({
                                    ...input,
                                    salary: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className={style.radio}>
                            <h4>Cast *</h4>
                            <div className={style.subRadio}>
                              <div className={style.subRadio2}>
                                <input
                                  type="radio"
                                  name="cast"
                                  required
                                  checked={cast.Imam}
                                  onChange={() =>
                                    setCast({
                                      Imam: true,
                                      sadaat: false,
                                      imam: false,
                                    })
                                  }
                                />
                                <label>Khoja</label>
                              </div>
                              <div className={style.subRadio2}>
                                <input
                                  type="radio"
                                  name="cast"
                                  required
                                  checked={cast.sadaat}
                                  onChange={() =>
                                    setCast({
                                      imam: false,
                                      sadaat: true,
                                      Imam: false,
                                    })
                                  }
                                />
                                <label>Syed</label>
                              </div>
                              <div className={style.subRadio2}>
                                <input
                                  type="radio"
                                  name="cast"
                                  required
                                  checked={cast.imam}
                                  onChange={() =>
                                    setCast({
                                      imam: true,
                                      sadaat: false,
                                      Imam: false,
                                    })
                                  }
                                />
                                <label>Non-Khoja Non-Syed</label>
                              </div>
                            </div>
                          </div>
                          <div className={style.radio}>
                            <h4>Residential Status</h4>
                            <div className={style.subRadio}>
                              <div className={style.subRadio2}>
                                <input
                                  type="radio"
                                  name="Status"
                                  checked={status.rented}
                                  onChange={() =>
                                    setStatus({
                                      rented: true,
                                      ownwed: false,
                                      trust: false,
                                    })
                                  }
                                />
                                <label>Rented</label>
                              </div>
                              <div className={style.subRadio2}>
                                <input
                                  type="radio"
                                  name="Status"
                                  checked={status.ownwed}
                                  onChange={() =>
                                    setStatus({
                                      rented: false,
                                      ownwed: true,
                                      trust: false,
                                    })
                                  }
                                />
                                <label>Owned</label>
                              </div>
                              <div className={style.subRadio2}>
                                <input
                                  type="radio"
                                  name="Status"
                                  checked={status.trust}
                                  onChange={() =>
                                    setStatus({
                                      rented: false,
                                      ownwed: false,
                                      trust: true,
                                    })
                                  }
                                />
                                <label>Trust</label>
                              </div>
                            </div>
                          </div>
                          {status.rented === true ? (
                            <div className={style.rental}>
                              <input
                                type="number"
                                placeholder="Rent Amount"
                                className={style.credentialField}
                                value={rental}
                                onChange={(e) => setRental(e.target.value)}
                              />
                            </div>
                          ) : status.trust === true ? (
                            <div className={style.rental}>
                              <input
                                type="text"
                                placeholder="Trust Name"
                                className={style.credentialField}
                                required
                                style={{
                                  display: "block",
                                  marginBottom: "10px",
                                }}
                                value={trust}
                                onChange={(e) => setTrust(e.target.value)}
                              />
                              <input
                                type="number"
                                placeholder="Trust Amount"
                                className={style.credentialField}
                                value={rental}
                                onChange={(e) => setRental(e.target.value)}
                              />
                            </div>
                          ) : (
                            <></>
                          )}
                          <div className={style.dependents}>
                            <h4>Number of Dependents</h4>
                            <input
                              type="number"
                              placeholder="Total Dependents"
                              readOnly
                              style={{
                                outline: "none",
                              }}
                              className={style.credentialField}
                              value={dependents.total}
                            />
                            <div className={style.subDependents}>
                              <input
                                type="number"
                                placeholder="Dependents Above 18"
                                className={style.credentialField}
                                value={dependents.above}
                                onChange={(e) =>
                                  setDependents({
                                    ...dependents,
                                    above: e.target.value,
                                    total: +e.target.value + +dependents.below,
                                  })
                                }
                              />
                              <input
                                type="number"
                                placeholder="Dependents Below 18"
                                className={style.credentialField}
                                value={dependents.below}
                                onChange={(e) =>
                                  setDependents({
                                    ...dependents,
                                    below: e.target.value,
                                    total: +e.target.value + +dependents.above,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className={style.purpose}>
                            <h4>Purpose *</h4>
                            <div className={style.subPurpose}>
                              <div className={style.subPurpose2}>
                                <input
                                  type="checkbox"
                                  name="purpose"
                                  checked={purpose.school}
                                  onChange={() => {
                                    setPurpose({
                                      ...purpose,
                                      school:
                                        purpose.school === true ? false : true,
                                    });
                                    purpose.school !== true
                                      ? setPurName([
                                          ...purName,
                                          "Name of School",
                                        ])
                                      : purName.map((ele, ind) => {
                                          if (ele === "Name of School") {
                                            purName.splice(ind, 1);
                                            setPurName([...purName]);
                                          }
                                        });
                                  }}
                                  disabled={purpose.monthly === true}
                                />
                                <label>School</label>
                              </div>
                              <div className={style.subPurpose2}>
                                <input
                                  type="checkbox"
                                  name="purpose"
                                  checked={purpose.hospital}
                                  onChange={() => {
                                    setPurpose({
                                      ...purpose,
                                      hospital:
                                        purpose.hospital === true
                                          ? false
                                          : true,
                                    });
                                    purpose.hospital !== true
                                      ? setPurName([
                                          ...purName,
                                          "Name of Hospital",
                                        ])
                                      : purName.map((ele, ind) => {
                                          if (ele === "Name of Hospital") {
                                            purName.splice(ind, 1);
                                            setPurName([...purName]);
                                          }
                                        });
                                  }}
                                  disabled={purpose.monthly === true}
                                />
                                <label>Hospital</label>
                              </div>
                              <div className={style.subPurpose2}>
                                <input
                                  type="checkbox"
                                  name="purpose"
                                  checked={purpose.academy}
                                  onChange={() => {
                                    setPurpose({
                                      ...purpose,
                                      academy:
                                        purpose.academy === true ? false : true,
                                    });
                                    purpose.academy !== true
                                      ? setPurName([
                                          ...purName,
                                          "Name of Academy",
                                        ])
                                      : purName.map((ele, ind) => {
                                          if (ele === "Name of Academy") {
                                            purName.splice(ind, 1);
                                            setPurName([...purName]);
                                          }
                                        });
                                  }}
                                  disabled={purpose.monthly === true}
                                />
                                <label>Academy</label>
                              </div>
                              <div className={style.subPurpose2}>
                                <input
                                  type="checkbox"
                                  name="purpose"
                                  checked={purpose.university}
                                  onChange={() => {
                                    setPurpose({
                                      ...purpose,
                                      university:
                                        purpose.university === true
                                          ? false
                                          : true,
                                    });
                                    purpose.university !== true
                                      ? setPurName([
                                          ...purName,
                                          "Name of University",
                                        ])
                                      : purName.map((ele, ind) => {
                                          if (ele === "Name of University") {
                                            purName.splice(ind, 1);
                                            setPurName([...purName]);
                                          }
                                        });
                                  }}
                                  disabled={purpose.monthly === true}
                                />
                                <label>University</label>
                              </div>
                              <div className={style.subPurpose2}>
                                <input
                                  type="checkbox"
                                  name="purpose"
                                  checked={purpose.store}
                                  onChange={() => {
                                    setPurpose({
                                      ...purpose,
                                      store:
                                        purpose.store === true ? false : true,
                                    });
                                    purpose.store !== true
                                      ? setPurName([
                                          ...purName,
                                          "Name of General Store",
                                        ])
                                      : purName.map((ele, ind) => {
                                          if (ele === "Name of General Store") {
                                            purName.splice(ind, 1);
                                            setPurName([...purName]);
                                          }
                                        });
                                  }}
                                  disabled={purpose.monthly === true}
                                />
                                <label>General Store</label>
                              </div>
                              <div className={style.subPurpose2}>
                                <input
                                  type="checkbox"
                                  name="purpose"
                                  checked={purpose.rent}
                                  onChange={() => {
                                    setPurpose({
                                      ...purpose,
                                      rent:
                                        purpose.rent === true ? false : true,
                                    });
                                  }}
                                  disabled={purpose.monthly === true}
                                />
                                <label>Rent</label>
                              </div>
                              <div className={style.subPurpose2}>
                                <input
                                  type="checkbox"
                                  name="purpose"
                                  checked={purpose.monthly}
                                  onChange={() => {
                                    if (purpose.monthly === false) {
                                      setPurpose({
                                        school: false,
                                        hospital: false,
                                        academy: false,
                                        university: false,
                                        store: false,
                                        rent: false,
                                        monthly: true,
                                        grocery: false,
                                        repairing: false,
                                        purchasing: false,
                                        other: false,
                                      });
                                      setPurName([]);
                                      setPurposeName({
                                        School: "",
                                        Hospital: "",
                                        Academy: "",
                                        university: "",
                                        GeneralStore: "",
                                        Grocery: "",
                                        Repairing: "",
                                        Purchasing: "",
                                        Other: "",
                                      });
                                    } else {
                                      setPurpose({
                                        ...purpose,
                                        monthly: false,
                                      });
                                    }
                                  }}
                                />
                                <label>Monthly Support</label>
                              </div>
                              <div className={style.subPurpose2}>
                                <input
                                  type="checkbox"
                                  name="purpose"
                                  checked={purpose.grocery}
                                  onChange={() => {
                                    setPurpose({
                                      ...purpose,
                                      grocery:
                                        purpose.grocery === true ? false : true,
                                    });
                                    purpose.grocery !== true
                                      ? setPurName([
                                          ...purName,
                                          "Name of Grocery",
                                        ])
                                      : purName.map((ele, ind) => {
                                          if (ele === "Name of Grocery") {
                                            purName.splice(ind, 1);
                                            setPurName([...purName]);
                                          }
                                        });
                                  }}
                                  disabled={purpose.monthly === true}
                                />
                                <label>Grocery</label>
                              </div>
                              <div className={style.subPurpose2}>
                                <input
                                  type="checkbox"
                                  name="purpose"
                                  checked={purpose.repairing}
                                  onChange={() => {
                                    setPurpose({
                                      ...purpose,
                                      repairing:
                                        purpose.repairing === true
                                          ? false
                                          : true,
                                    });
                                    purpose.repairing !== true
                                      ? setPurName([
                                          ...purName,
                                          "Name of Repairing",
                                        ])
                                      : purName.map((ele, ind) => {
                                          if (ele === "Name of Repairing") {
                                            purName.splice(ind, 1);
                                            setPurName([...purName]);
                                          }
                                        });
                                  }}
                                  disabled={purpose.monthly === true}
                                />
                                <label>Repairing</label>
                              </div>
                              <div className={style.subPurpose2}>
                                <input
                                  type="checkbox"
                                  name="purpose"
                                  checked={purpose.purchasing}
                                  onChange={() => {
                                    setPurpose({
                                      ...purpose,
                                      purchasing:
                                        purpose.purchasing === true
                                          ? false
                                          : true,
                                    });
                                    purpose.purchasing !== true
                                      ? setPurName([
                                          ...purName,
                                          "Name of Purchasing",
                                        ])
                                      : purName.map((ele, ind) => {
                                          if (ele === "Name of Purchasing") {
                                            purName.splice(ind, 1);
                                            setPurName([...purName]);
                                          }
                                        });
                                  }}
                                  disabled={purpose.monthly === true}
                                />
                                <label>Purchasing</label>
                              </div>
                              <div className={style.subPurpose2}>
                                <input
                                  type="checkbox"
                                  name="purpose"
                                  checked={purpose.other}
                                  onChange={() => {
                                    setPurpose({
                                      ...purpose,
                                      other:
                                        purpose.other === true ? false : true,
                                    });
                                    purpose.other !== true
                                      ? setPurName([
                                          ...purName,
                                          "Name of Other",
                                        ])
                                      : purName.map((ele, ind) => {
                                          if (ele === "Name of Other") {
                                            purName.splice(ind, 1);
                                            setPurName([...purName]);
                                          }
                                        });
                                  }}
                                  disabled={purpose.monthly === true}
                                />
                                <label>Other</label>
                              </div>
                            </div>
                          </div>
                          {purName[0] !== undefined ? (
                            <div className={style.purposeName}>
                              {purName.map((ele, ind) => {
                                if (ele !== undefined) {
                                  let copy = ele.slice(8, ele.length);
                                  let final = copy.replace(" ", "");
                                  if (final === "Store") {
                                    final = "General" + final;
                                  }
                                  let suggest = final.toLowerCase();
                                  return (
                                    <Autocomplete
                                      key={ind}
                                      getItemValue={(item) => item.label}
                                      items={suggestions[suggest]}
                                      shouldItemRender={(item, value) =>
                                        item.label
                                          .toLowerCase()
                                          .indexOf(value.toLowerCase()) > -1
                                      }
                                      renderInput={(params) => {
                                        return (
                                          <input
                                            type="text"
                                            {...params}
                                            className={style.purposeInput}
                                            placeholder={ele}
                                            required
                                          />
                                        );
                                      }}
                                      value={purposeName[final]}
                                      onChange={(e) =>
                                        setPurposeName({
                                          ...purposeName,
                                          [final]: e.target.value,
                                        })
                                      }
                                      renderItem={(item, isHighlighted) => (
                                        <div
                                          key={item.label}
                                          style={{
                                            background: isHighlighted
                                              ? "lightgray"
                                              : "white",
                                            padding: "5px",
                                          }}
                                        >
                                          {item.label}
                                        </div>
                                      )}
                                      onSelect={(val) =>
                                        setPurposeName({
                                          ...purposeName,
                                          [final]: val,
                                        })
                                      }
                                    />
                                  );
                                }
                              })}
                            </div>
                          ) : (
                            <></>
                          )}
                          <textarea
                            placeholder="Enter Your Description Here... *"
                            cols="40"
                            rows="8"
                            value={description}
                            required
                            onChange={(e) => setDescription(e.target.value)}
                          ></textarea>
                          <div className={style.uploads}>
                            {specific.image.map((elem, indx) => {
                              return (
                                <div key={indx}>
                                  <img
                                    src={elem.url}
                                    width="120px"
                                    height="120px"
                                    className={style.small}
                                  />
                                  <LongMenu
                                    state={{ opt, setOpt }}
                                    pre={{ preview, setPreview }}
                                    message={{ msg, setMsg }}
                                    public_id={elem.public_id}
                                    url={elem.url}
                                    elementt={specific}
                                    load={setLoading}
                                  />
                                </div>
                              );
                            })}
                          </div>
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
                                    })
                                  }
                                />
                                <label>AB</label>
                              </div>
                              {purpose.rent === true ? (
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
                                      })
                                    }
                                  />
                                  <label>Rent Assistance</label>
                                </div>
                              ) : (
                                <></>
                              )}
                              {purpose.monthly === true ? (
                                <>
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
                                        })
                                      }
                                    />
                                    <label>Rent Assistance</label>
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                          <input
                            type="number"
                            placeholder="Amount *"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                          <div className={style.btn}>
                            <button onClick={() => deleteForm(specific._id)}>
                              Delete
                            </button>
                            <input type="submit" value="Edit" />
                          </div>
                        </form>
                      </div>
                    )
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPanel;