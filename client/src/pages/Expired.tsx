import { Link } from "react-router";

export default function Expired()
{
  return (
    <div className="h-screen w-full bg-primary flex flex-col gap-36 justify-center items-center px-10">
      <div className="w-fit flex flex-col justify-center items-center">
        <h1 className="text-[8rem] font-sans font-bold text-accent text-center">
          Oh Snap!
        </h1>
        <h2 className="text-5xl lg:text-7xl font-mono text-secondary/60 text-center">
          URL has already expired.
        </h2>
      </div>
      <Link
        to={"/"}
        className={`w-fit py-2 px-4 rounded-lg hover:text-secondary text-secondary/30 cursor-pointer underline`}
      >
        Generate URL here
      </Link>
    </div>
  );
}