import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from "react-icons/fa";

function HomePage()
{
  const [isAdvancedOpened, setIsAdvancedOpened] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-primary font-mono pt-20">
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 justify-center items-center gap-10 laptop-l:gap-20 max-w-7xl p-10">

        {/* Form */}
        <div className="flex flex-col items-center w-full h-fit gap-20">
          <h1 className="text-4xl font-bold font-sans text-center text-secondary">
            Shorten your <span className="text-accent">loooooooooong URLs</span> with one click away!
          </h1>
          <form className="w-full flex flex-col gap-10">
            <div className="w-full flex flex-col md:flex-row items-center md:items-start gap-5">
              <input
                type="url"
                placeholder="https://..."
                className="w-full md:flex-1 outline-none py-2 px-4 rounded-lg border border-secondary/30 bg-transparent"
              />
              <button
                type="submit"
                className={`w-fit py-2 px-4 rounded-lg text-primary ${isLoading ? "cursor-not-allowed bg-accent/60" : "cursor-pointer bg-accent"}`}
              >
                Shorten URL
              </button>
            </div>
            <div className="flex flex-col gap-2 text-secondary/60">
              <div className="w-full flex flex-row gap-2 items-center">
                <h3>
                  Advanced Settings (Optional)
                </h3>
                <MdKeyboardArrowDown
                  size={20}
                  className={`cursor-pointer h-full aspect-square hover:text-secondary ${!isAdvancedOpened ? "rotate-0" : "rotate-180"} transition-all duration-500 ease-in-out`}
                  onClick={() => setIsAdvancedOpened(!isAdvancedOpened)}
                />
              </div>
              <hr className="" />
            </div>

            {/* Expiry */}
            <div className={`w-full flex flex-col gap-2 transition-all duration-500 ease-in-out ${!isAdvancedOpened ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"}`}>
              <label
                htmlFor="expiration-date"
                className="text-secondary/60"
              >
                Expiration Date
              </label>
              <input
                id="expiration-date"
                type="date"
                className="flex-1 outline-none py-2 px-4 rounded-lg border border-secondary/30 bg-transparent"
                min={new Date(Date.now() + 172800000).toISOString().split("T")[0]}
              />
            </div>

            {/* Custom slug */}
            <div className={`w-full flex flex-col gap-2 transition-all duration-500 ease-in-out ${!isAdvancedOpened ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"}`}>
              <label
                htmlFor="expiration-date"
                className="text-secondary/60"
              >
                Custom trailing url
              </label>
              <input
                id="expiration-date"
                type="text"
                placeholder={`/your-custom-url`}
                className="flex-1 outline-none py-2 px-4 rounded-lg border border-secondary/30 bg-transparent"
                min={new Date(Date.now() + 172800000).toISOString().split("T")[0]}
              />
            </div>
          </form>
        </div>

        {/* Output */}
        <div
          className="w-full h-fit p-10 gap-20 border-2 border-dashed border-secondary/60 rounded-lg"
        >
          <div className="w-full flex flex-col justify-center gap-3">
            <h2 className="text-xl">
              URL Generated!
            </h2>
            <div className="w-full flex flex-row gap-3 border rounded-lg border-secondary/60 p-4">
              <div className="flex-1 text-accent">
                sdf
              </div>
              <CopyToClipboard
                text={"copy"}
                onCopy={() => { console.log("dasfgsd", "LOGS") }}
              >
                <FaCopy
                  size={25}
                  className="text-secondary/60 hover:text-secondary cursor-pointer"
                />
              </CopyToClipboard>
            </div>
          </div>
          {/* <p className="text-center text-secondary/30">
            Your shortened URL will appear here.
          </p> */}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
