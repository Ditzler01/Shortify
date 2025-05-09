import { FaLink } from "react-icons/fa";
import { Link } from "react-router";

export default function Navbar()
{
  return (
    <nav className="h-20 flex items-center justify-center md:justify-start px-20 absolute top-0 left-0 w-full gap-3">
      <FaLink
        size={30}
        className="text-accent h-fit"
      />
      <Link
        to={"/"}
        className="font-sans text-accent text-2xl font-bold"
      >
        Shooooooortify
      </Link>
    </nav>
  );
}