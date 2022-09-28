import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { Base_URI } from "../core";

const options = ["Preview", "Delete"];

const ITEM_HEIGHT = 48;

export default function LongMenu({ state, public_id, pre, url, message, elementt, load}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const { opt, setOpt } = state;
  const { preview, setPreview } = pre;
  const { msg, setMsg } = message;
  const { image, _id } = elementt;
  const handleClose = () => {
    setAnchorEl(null);
  };
  React.useEffect(async () => {
    if (opt.Delete !== false) {
      load(true);
      let arr = [];
      image.map((ele) => {
        if (ele.public_id !== opt.Delete) {
          arr.push(ele);
        }
      })
      let userObj = {
        ...elementt,
        image: arr,
      }
      try {
        const response = await axios.put(`${Base_URI}imageDelete/${_id}`, {
          public_id: opt.Delete,
          userObj,
        });
        if (response.data.image === "ok") {
          setMsg({
            image: "Image Deleted",
            user: response.data.user,
          });
        } else {
          setMsg({
            image: "Image not found",
            user: false,
          });
        }
        setOpt({
          Preview: false,
          Delete: false,
        })
      } catch (error) {
        console.log(error);
      }
    }
    if (opt.Preview !== false) {
      preview === false ? setPreview(opt.Preview) : setPreview(false);
    }
  }, [opt]);
  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        style={{
          height: "20px",
          padding: 0,
          position: "absolute",
          zIndex: 1,
          right: "3%",
          top: "4.5%",
          color: "grey",
        }}
      >
        <MoreVertIcon
          style={{
            backgroundColor: "white",
            width: "20px",
            borderRadius: "10px",
          }}
        />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "85px",
            padding: 0,
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={() => {
              handleClose();
              setOpt({
                Preview: false,
                Delete: false,
                [option]: option === "Delete" ? public_id : url,
              });
            }}
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "13px",
              margin: 0,
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
