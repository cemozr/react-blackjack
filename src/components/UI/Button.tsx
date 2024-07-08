import { MouseEventHandler, type ComponentPropsWithoutRef } from "react";
import "../../styles.scss";
import { Link } from "react-router-dom";

type ButtonProps = {
  name: string;
  el: "button";
  click?: MouseEventHandler;
} & ComponentPropsWithoutRef<"button">;

type LinkProps = {
  name: string;
  el: "a";
  to: string;
  click?: MouseEventHandler;
} & ComponentPropsWithoutRef<"a">;

export const Button = ({ click, ...props }: ButtonProps | LinkProps) => {
  if (props.el === "button")
    return (
      <button {...props} className="btn">
        <p className="btn__text">{props.name}</p>
      </button>
    );
  return (
    <Link to={props.to} className="link">
      <button className="btn" onClick={click}>
        <p className="btn__text">{props.name}</p>
      </button>
    </Link>
  );
};
