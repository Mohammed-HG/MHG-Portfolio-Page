  import { useState } from "react";
  import "./BurgerMenu.css";

  export default function BurgerMenu() {
    const [open, setOpen] = useState(false);

    function handleClick() {
      setOpen(!open);
    }

    function handleLinkClick(e) {
      e.stopPropagetion();
      setOpen(false);
    }

    return(
      <div className={`card ${open ? "show" : ""}`} onClick={handleClick}>
        <div className="row">
          <div className="title">Menu</div>
            <svg
              width="32"
              height="32"
              viewBox="0 0 100 100"
              className={open ? "icon open" : "icon"}
            >
              <path
                className="path1"
                d="M 20 30 L 80 30"
              />
              <path
                className="path2"
                d="M 20 50 L 80 50"
              />
              <path
                className="path3"
                d="M 20 70 L 80 70"
              /> 
            </svg> 
          </div>

          <hr className="hr-line"/>

          <div className="menu-content">
            <br />
            <a href="#About" onClick={handleLinkClick}>About us</a>
            <a href="#Certificates" onClick={handleLinkClick}>Certificates</a>
            <a href="#Projects" onClick={handleLinkClick}>Projects</a>
          </div>
      </div>
    )
  }