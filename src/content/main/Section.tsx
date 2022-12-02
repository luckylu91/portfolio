import { PropsWithChildren } from "react";
import "./Section.css";
import Card from "@mui/material/Card";

type Props = {
  title: string,
}

export function Section(props: PropsWithChildren<Props>) {
  return (
    <div className="section">
      <span className="section-title">{props.title}</span>
      <div className="section-content">
        {props.children}
      </div>
    </div>
  );
}
