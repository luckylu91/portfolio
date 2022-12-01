import { PropsWithChildren } from "react";

export type Props = {
  name: string,
  img: string,
}

export function Project(props: PropsWithChildren<Props>) {

  return <div className="project">
    <span className="name">{props.name}</span>
    <div className="image">
      <img src="" alt="" />
    </div>
    <div className="description">
      {props.children}
    </div>
  </div>;
}
