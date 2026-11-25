import React from "react";
import ArrowForwardRoundedIcon from "@material-ui/icons/ArrowForwardRounded";

function DashboardHome({ username, role, description, actions }) {
  return (
    <div className="dashboard-home">
      <section className="dashboard-hero">
        <span className="dashboard-eyebrow">{role} workspace</span>
        <h1>
          {username
            ? `Welcome back, ${username}`
            : `Welcome to your ${role.toLowerCase()} workspace`}
        </h1>
        <p>{description}</p>
      </section>

      <div className="dashboard-shortcut-grid">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              type="button"
              className="dashboard-shortcut"
              key={action.title}
              onClick={action.onClick}
            >
              <span className="dashboard-shortcut-icon">
                <Icon />
              </span>
              <span className="dashboard-shortcut-copy">
                <strong>{action.title}</strong>
                <span>{action.description}</span>
              </span>
              <ArrowForwardRoundedIcon className="dashboard-shortcut-arrow" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardHome;
