import { useEffect, useState } from "react";
import { checkMediaPermissions } from "../lib/checkMediaPermissions";

interface MediaPermissionPromptProps {
  onPermissionChange?: (status: "granted" | "denied" | "missing-device" | "error" | "closed" | "prompt") => void;
}

export default function MediaPermissionPrompt({ onPermissionChange }: MediaPermissionPromptProps) {
  // const [status, setStatus] = useState<"prompt" | "granted" | "denied" | "missing-device" | "error" | "closed">("prompt");
  const [status, setStatus] = useState("granted")

  const updateStatus = (newStatus) => {
    setStatus(newStatus);
    onPermissionChange?.(newStatus); // ✅ Notify parent
  };

  const requestMediaAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

      stream.getTracks().forEach((track) => track.stop());
      updateStatus("granted");
    } catch (err: any) {
      console.error("getUserMedia error:", err);

      if (err.name === "NotFoundError") {
        updateStatus("missing-device");
      } else if (err.name === "NotAllowedError") {
        updateStatus("denied");
      } else {
        updateStatus("error");
      }
    }
  };

  useEffect(() => {
    checkMediaPermissions().then(({ mic, cam }) => {
      if (mic === "granted" && cam === "granted") {
        updateStatus("granted");
      } else if (mic === "denied" || cam === "denied") {
        updateStatus("denied");
      } else {
        updateStatus("prompt");
      }
    });
  }, []);

  if (status === "granted" || status === "closed") return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md text-center shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Enable Camera & Microphone</h2>

        {status === "missing-device" && (
          <p className="text-red-500 mb-4">No microphone or camera was found. Please connect one and refresh.</p>
        )}
        {status === "denied" && (
          <p className="text-red-500 mb-4">
            Access was denied. Please enable camera and mic permissions in your browser settings and reload.
          </p>
        )}
        {status === "error" && <p className="text-red-500 mb-4">Something went wrong. Try again later.</p>}

        {status === "prompt" && (
          <>
            <p className="mb-4">To use Nabu, we need access to your camera and microphone.</p>
            
          </>
        )}
        <button
              onClick={requestMediaAccess}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Grant Access
            </button>
            <button
              onClick={() => updateStatus("closed")}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 ml-4 rounded"
            >
              Close
            </button>
      </div>
    </div>
  );
}
