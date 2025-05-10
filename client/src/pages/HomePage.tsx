import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { UrlForm } from "../types/UrlForm";
import { UrlReturnType } from "../types/Url";

function HomePage()
{
  const [isAdvancedOpened, setIsAdvancedOpened] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedUrl, setGeneratedUrl] = useState<string>();
  const [clipboardMessage, setClipboardMessage] = useState<string>("copy");
  const { register, handleSubmit, setError, clearErrors, reset, formState } = useForm<UrlForm>();

  const onSubmit = async (data: UrlForm) =>
  {
    setIsLoading(true);

    const baseUrl = import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:8000";

    // Check if slug is taken
    if (!!data.custom_slug)
    {
      const response = await fetch(`${baseUrl}/slug-exists/${data.custom_slug}`);
      const json = await response.json();

      if (json.slug_exists)
      {
        setError("custom_slug", {
          message: "*This trailing URL is already taken, please try another one."
        });

        setIsLoading(false);
        return;
      }
    }

    // Save and get new url
    const dataToInsert = {
      url: data.url,
      custom_slug: !!data.custom_slug ? data.custom_slug : null,
      expiration_date: !!data.expiration_date ? data.expiration_date : null
    };

    const response = await fetch(`${baseUrl}/compress-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataToInsert)
    });

    const json: UrlReturnType = await response.json();

    setGeneratedUrl(json.shortened_url);

    clearErrors();
    setIsLoading(false);
    reset();
  };

  const handleCopy = () =>
  {
    setClipboardMessage("copied!");

    setTimeout(() =>
    {
      setClipboardMessage("copy");
    }, 1500);
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-primary font-mono pt-20">
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 justify-center items-center gap-10 laptop-l:gap-20 max-w-7xl p-10">

        {/* Form */}
        <div className="flex flex-col items-center w-full h-fit gap-20" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-4xl font-bold font-sans text-center text-secondary">
            Shorten your <span className="text-accent">loooooooooong URLs</span> with one click away!
          </h1>
          <form className="w-full flex flex-col gap-10">
            <div className="w-full flex flex-col gap-2">
              <p className="text-sm text-red-500 italic">
                {formState.errors.url?.message}
              </p>
              <div className="w-full flex flex-col md:flex-row items-center md:items-start gap-5">
                <input
                  type="text"
                  placeholder="https://..."
                  className="w-full md:flex-1 outline-none py-2 px-4 rounded-lg border border-secondary/30 bg-transparent"
                  {...register("url", {
                    required: true,
                    pattern: {
                      value: /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})(\/[\w .-]*)*(\?.*)?$/,
                      message: "*Please enter a valid URL"
                    }
                  })}
                />
                <button
                  type="submit"
                  className={`w-fit py-2 px-4 rounded-lg text-primary ${isLoading ? "cursor-not-allowed bg-accent/60" : "cursor-pointer bg-accent"}`}
                >
                  Shorten URL
                </button>
              </div>
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
                type="datetime-local"
                className="flex-1 outline-none py-2 px-4 rounded-lg border border-secondary/30 bg-transparent"
                min={new Date().toISOString().slice(0, -8)}
                {...register("expiration_date")}
              />
            </div>

            {/* Custom slug */}
            <div className={`w-full flex flex-col gap-2 transition-all duration-500 ease-in-out ${!isAdvancedOpened ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"}`}>
              <label
                htmlFor="custom-slug"
                className="text-secondary/60"
              >
                Custom trailing url
              </label>
              <input
                id="custom-slug"
                type="text"
                placeholder={`your-custom-url`}
                className="flex-1 outline-none py-2 px-4 rounded-lg border border-secondary/30 bg-transparent"
                min={new Date(Date.now() + 172800000).toISOString().split("T")[0]}
                {...register("custom_slug", {
                  pattern: {
                    value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                    message: "*Invalid trailing url! Only lowercase letters, numbers, and hyphens allowed (e.g., your-custom-slug)."
                  }
                })}
              />
              <p className="text-sm text-red-500 italic">
                {formState.errors.custom_slug?.message}
              </p>
            </div>
          </form>
        </div>

        {/* Output */}
        <div
          className="w-full h-fit p-10 gap-20 border-2 border-dashed border-secondary/60 rounded-lg"
        >
          {
            !!generatedUrl ? (
              <div className="w-full flex flex-col justify-center gap-3">
                <h2 className="text-xl">
                  URL Generated!
                </h2>
                <div className="w-full flex flex-row gap-3 border rounded-lg border-secondary/60 p-4">
                  <div className="flex-1 text-accent">
                    {generatedUrl}
                  </div>
                  <div className="relative w-fit justify-center items-center group">
                    <CopyToClipboard
                      text={generatedUrl}
                      onCopy={handleCopy}
                    >
                      <FaCopy
                        size={25}
                        className="text-secondary/30 hover:text-secondary/60 cursor-pointer"
                      />
                    </CopyToClipboard>
                    <div className="absolute px-4 py-1 text-accent rounded-lg border border-secondary/60 -top-10 bg-primary -left-6 group-hover:block hidden">
                      {clipboardMessage}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-secondary/30">
                Your shortened URL will appear here.
              </p>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default HomePage;
