import { PropsWithChildren } from "react";
import "./Section.css";

type Props = {
  title: string,
}

export function Section(props: Props & PropsWithChildren) {
  return (
    <div className="section">
      <span className="section-title">{props.title}</span>
      {props.children}
    </div>
  );
}
