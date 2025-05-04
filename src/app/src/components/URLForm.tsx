import { useState } from "react"
import Notification from "./Notification";
import useURLStore from "../store/urlStore";
import { urlSchema } from "../schema";

const UrlForm = ({onSuccess }: { onSuccess: () => void}) => {
  const [longUrl, setLongUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEncoding, setIsEncoding] = useState<boolean>(false);

  const { encodeUrl } = useURLStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const validation = urlSchema.safeParse({ longUrl });

    if (!validation.success) {
      setErrorMessage(validation.error.errors[0].message);
      return;
    }
    
    setIsEncoding(true);

    try {
      const encodeUrlResponse = await encodeUrl({ longUrl: longUrl });
      if (encodeUrlResponse?.data?.shortUrl) {
        onSuccess();
      }
    } catch (err) {
      setErrorMessage((err as Error)?.message || "Something went wrong, please try again");
    } finally {
      setIsEncoding(false);
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
          disabled={isEncoding}
          className={`mt-4 w-full p-2 text-white rounded-lg transition-opacity duration-300 ${
            isEncoding ? 'bg-blue-400 cursor-not-allowed opacity-70' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isEncoding ? (
            <span className="flex items-center justify-center">
              Encoding<span className="dot-animate ml-1">...</span>
            </span>
          ) : (
            "Shorten URL"
          )}
        </button>
      </form>
    </div>
  )
}

export default UrlForm;