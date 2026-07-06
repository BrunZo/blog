import { Link as ReactLink } from "react-router-dom";

export function Link({ to, text }: { to: string; text: string }) {
  return (
    <ReactLink to={to} className="text-md text-gray-500 hover:text-gray-800">
      {text}
    </ReactLink>
  );
}
