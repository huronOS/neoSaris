import React, { Component } from "react";
import "./Form.css";

const Form = ({ setConfigData }) => {
  return (
    <form className="configForm">
      <p>Form</p>
      <label>Contest ID:</label>
      <input id="contest_id" name="contest_id" type="text" />
      <button
        className="loadScoreboardButton"
        onClick={event => {
          console.log(event);
          /*setConfigData({
            contest_id: event.target.form.contest_id.value,
          });*/
          //setStep("loading");
        }}
      >
        Load Scoreboard
      </button>
    </form>
  );
};

export default Form;
