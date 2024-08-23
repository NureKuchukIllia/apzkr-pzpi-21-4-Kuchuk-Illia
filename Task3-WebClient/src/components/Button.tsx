import { Component } from "solid-js";

export interface ButtonProps {
  text: string;
  onClick: () => void;
}

const Button: Component<ButtonProps> = (props) => {
  return (
    <button
      onClick={props.onClick}
      class="bg-primary text-white p-2 rounded-lg w-max self-center"
    >
      {props.text}
    </button>
  );
};

export default Button;
