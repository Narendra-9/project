import React from "react";
import "./ExepectedDeliveryDate.css"

function ExepectedDeliveyDate(props) {
  function addDays(days) {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  function getExpectedDeliveryDate() {
    let expectedDeliveyDate = addDays(props.expectedDelivey);
    let day = expectedDeliveyDate.getDate();
    let dayName = expectedDeliveyDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    let monthName = expectedDeliveyDate.toLocaleDateString("en-US", {
      month: "long",
    });
    let wantedFormat = `${dayName.slice(0, 3)}, ${day} ${monthName.slice(
      0,
      3
    )}`;
    return wantedFormat;
  }

  return (
    <div className="expected-delivery-content mt-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-box-seam-fill"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.01-.003.268-.108a.75.75 0 0 1 .558 0l.269.108.01.003zM10.404 2 4.25 4.461 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339L8 5.961 5.596 5l6.154-2.461z"
        />
      </svg>
      <span className="ms-2">Delivery by {getExpectedDeliveryDate()}</span>
    </div>
  );
}

export default ExepectedDeliveyDate;
