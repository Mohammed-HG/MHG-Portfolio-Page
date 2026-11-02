import { useEffect, useRef, useState } from "react";
import "./BurgerMenu.css";
export default function BurgerMenu() {
  const [open, setOpen] = useState(false);
  const root = useRef(null),
    trigger = useRef(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <div className="navigation-menu" ref={root}>
      <button
        type="button"
        ref={trigger}
        className="menu-trigger"
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span>Menu</span>
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d={open ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      <div id="site-navigation" className="menu-panel" hidden={!open}>
        <a href="#About" onClick={() => setOpen(false)}>
          About me <span aria-hidden="true">01</span>
        </a>
        <a href="#Work" onClick={() => setOpen(false)}>
          My work <span aria-hidden="true">02</span>
        </a>
        <a href="#Contact" onClick={() => setOpen(false)}>
          Contact <span aria-hidden="true">03</span>
        </a>
      </div>
    </div>
  );
}
