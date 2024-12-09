type IPRequestResponse = {
  country: string;
  countryCode: string;
  timezone: string;
};

export const fetchIpAddressInformation = async (
  ip: string
): Promise<IPRequestResponse> => {
  const response = await fetch(`http://ip-api.com/json/${ip}`);
  const data = await response.json();
  if (data.status === "fail") {
    throw new Error(data.message);
  }
  return data as IPRequestResponse;
};
