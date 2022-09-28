import { useEffect, useState } from "react";
import style from "./dashboard.module.css";
import axios from "axios";
import { Base_URI, PhoneApi } from "../../core";
import { useNavigate } from "react-router";
import Toast from "../../components/Toast";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Autocomplete from "react-autocomplete";
import rolling from "../../images/Rolling.gif";

const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const adminn = localStorage.getItem("admin");
    if (adminn !== "Ali Asghar") {
      navigate("/", { replace: true });
    }
  }, []);
  const [loader, setLoader] = useState(false);
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
  const [dependents, setDependents] = useState({
    total: "",
    above: "",
    below: "",
  });
  const [status, setStatus] = useState({
    rented: false,
    ownwed: false,
    trust: false,
  });
  const [trust, setTrust] = useState("");
  const [rental, setRental] = useState("");
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
    university: "",
    GeneralStore: "",
    Grocery: "",
    Repairing: "",
    Purchasing: "",
    Other: "",
  });
  const [description, setDescription] = useState("");
  const [cast, setCast] = useState({
    imam: false,
    sadaat: false,
    Imam: false,
  });
  const [file, setFile] = useState([]);
  const [suggestions, setSuggestions] = useState({});

  useEffect(async () => {
    try {
      const res = await axios.get(`${Base_URI}getPurpose`);
      setSuggestions(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const dashboardForm = async (e) => {
    e.preventDefault();
    setLoader(true);
    let final_purpose = [];
    for (const key in purpose) {
      if (purpose[key] && key !== "purName") {
        final_purpose.push(key);
      }
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

              let final_cast = "";
              for (const key in cast) {
                if (cast[key]) {
                  final_cast = key;
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
                trust_name: trust,
                total_dependents: dependents.total,
                above_dependents: dependents.above,
                below_dependents: dependents.below,
                purpose: final_purpose,
                purpose_name: final_purposeName,
                description: description,
                cast: final_cast,
              };
              const formData = new FormData();
              file.map((ele) => {
                formData.append("image", ele);
              });
              try {
                const res = await axios.post(
                  `${Base_URI}imageUpload`,
                  formData
                );
                let obj = {
                  image: res.data,
                };
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
                  setLoader(false);
                  const response = await axios.post(
                    `${Base_URI}dashboardForm`,
                    obj
                  );
                  toast.success("Form Submitted Successfully");
                  setTimeout(() => {
                    navigate("/AdminPanel", { replace: true });
                  }, 3000);
                } catch (error) {
                  console.log(error);
                }
              } catch (error) {
                console.log(error);
              }
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
              setFile([]);
              setCast({
                Imam: false,
                imam: false,
                sadaat: false,
              });
            } else {
              setLoader(false);
              setFile([]);
              toast.warning("JCIC Number is required for khoja");
            }
          } else {
            setLoader(false);
            setFile([]);
            toast.warning("Invalid JCIC Number");
          }
        } else {
          setLoader(false);
          setFile([]);
          toast.warning("Invalid Cell Number");
        }
      } else {
        setLoader(false);
        setFile([]);
        toast.warning("Invalid CNIC Number");
      }
    } else {
      setLoader(false);
      setFile([]);
      toast.warning("Purpose is Required");
    }
  };
  return (
    <div className={style.mainDiv}>
      {loader === true ? (
        <img src={rolling} alt="rolling" width="60px" height="60px" />
      ) : (
        <>
          <Navbar />
          <Toast />
          <div className={style.container}>
            <form
              onSubmit={(e) => dashboardForm(e)}
              encType="multipart/form-data"
            >
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
                      onChange={(e) => {
                        setInput({
                          ...input,
                          jcic_number: e.target.value,
                        });
                      }}
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
                          imam: false,
                          sadaat: false,
                          Imam: true,
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
                    required
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
                          school: purpose.school === true ? false : true,
                        });
                        purpose.school !== true
                          ? setPurName([...purName, "Name of School"])
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
                          hospital: purpose.hospital === true ? false : true,
                        });
                        purpose.hospital !== true
                          ? setPurName([...purName, "Name of Hospital"])
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
                          academy: purpose.academy === true ? false : true,
                        });
                        purpose.academy !== true
                          ? setPurName([...purName, "Name of Academy"])
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
                            purpose.university === true ? false : true,
                        });
                        purpose.university !== true
                          ? setPurName([...purName, "Name of University"])
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
                          store: purpose.store === true ? false : true,
                        });
                        purpose.store !== true
                          ? setPurName([...purName, "Name of General Store"])
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
                      onChange={() =>
                        setPurpose({
                          ...purpose,
                          rent: purpose.rent === true ? false : true,
                        })
                      }
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
                          grocery: purpose.grocery === true ? false : true,
                        });
                        purpose.grocery !== true
                          ? setPurName([...purName, "Name of Grocery"])
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
                          repairing: purpose.repairing === true ? false : true,
                        });
                        purpose.repairing !== true
                          ? setPurName([...purName, "Name of Repairing"])
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
                            purpose.purchasing === true ? false : true,
                        });
                        purpose.purchasing !== true
                          ? setPurName([...purName, "Name of Purchasing"])
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
                          other: purpose.other === true ? false : true,
                        });
                        purpose.other !== true
                          ? setPurName([...purName, "Name of Other"])
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
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <input
                type="file"
                name="Attachments"
                className={style.attach}
                required
                multiple
                onChange={(e) => {
                  for (const key in e.target.files) {
                    if (Object.hasOwnProperty.call(e.target.files, key)) {
                      file.push(e.target.files[key]);
                    }
                  }
                  setFile(file);
                }}
              />
              <div className={style.btn}>
                <input type="submit" value="Submit" />
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;