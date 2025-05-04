import { useState } from "react"
import Notification from "./Notification";
import useURLStore from "../store/urlStore";

const UrlForm = () => {
  const [longUrl, setLongUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEncoding, setIsEncoding] = useState<boolean>(false);

  const { encodeUrl } = useURLStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (longUrl) {
      setIsEncoding(true);
      try {
        const encodeUrlResponse = await encodeUrl({ longUrl: longUrl });
        console.log("encoude url response ", encodeUrlResponse);
      } catch (err) {
        setErrorMessage((err as Error)?.message || "Something went wrong, please try again");
      } finally {
        setIsEncoding(false);
      }
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold text-center">Create Short URL</h2>
        {errorMessage && (
          <div className="mt-4">
            <Notification
              type="error"
              message={errorMessage}
              onClose={() => setErrorMessage(null)}
            />
          </div>
        )}
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Enter long URL"
          className="w-full mt-4 p-2 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="mt-4 w-full p-2 bg-blue-500 text-white rounded-lg"
        >
          Shorten URL
        </button>
      </form>
    </div>
  )
}

export default UrlForm;