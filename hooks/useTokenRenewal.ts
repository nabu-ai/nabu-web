import { useEffect, useState } from "react";
import axios from "axios";

export default function useTokenRenewal(channelName, uid) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const renewToken = async () => {
        setToken("007eJxTYOAoCeUtOZ/sJ/Ofdz6j69PtVgzdOd0ztwhxrTLnMet/uUOBwSjJLNXY1CI5yTjR0MQg1cDS1CjVJMU8ydzUPNEkOdFSVcsgoyGQkaHoTRIrIwMEgvgsDHmJSaUMDABG+hvv")
    //   try {
    //     const response = await axios.post("http://localhost:5001/api/token", { channelName, uid });
    //     setToken(response.data.token);
    //   } catch (error) {
    //     console.error("Error renewing token:", error);
    //   }
    };

    // Renew token every 55 minutes before expiration
    const interval = setInterval(renewToken, 55 * 60 * 1000);
    renewToken(); // Initial token request

    return () => clearInterval(interval);
  }, [channelName, uid]);

  return token;
}