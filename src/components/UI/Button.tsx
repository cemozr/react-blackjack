import { type ComponentPropsWithoutRef } from "react";
import "../../styles.scss";
import { Link } from "react-router-dom";

type ButtonProps = {
  name: string;
  el: "button";
} & ComponentPropsWithoutRef<"button">;

type LinkProps = {
  name: string;
  el: "a";
  to: string;
} & ComponentPropsWithoutRef<"a">;

export const Button = ({ ...props }: ButtonProps | LinkProps) => {
  if (props.el === "button")
    return (
      <button {...props} className="btn">
        <p className="btn__text">{props.name}</p>
      </button>
    );
  return (
    <Link to={props.to} className="link">
      <button className="btn">
        <p className="btn__text">{props.name}</p>
      </button>
    </Link>
  );
};
