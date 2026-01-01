import { useState, useImperativeHandle } from "react";

const Togglable = (props) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(props.ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div className="mb-4">
      <div style={hideWhenVisible}>
        <button className="button is-primary" onClick={toggleVisibility}>
          {props.buttonLabel}
        </button>
      </div>

      <div style={showWhenVisible} className="box">
        {props.children}

        <button className="button is-light mt-3" onClick={toggleVisibility}>
          cancel
        </button>
      </div>
    </div>
  );
};

export default Togglable;
