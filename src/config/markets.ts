export interface Market {
  key: string;
  label: string;
  basePath: string;
  home: string;
}

export const markets: Record<string, Market> = {
  sg: {
    key: "sg",
    label: "Singapore",
    basePath: "/",
    home: "/"
  },
  in: {
    key: "in",
    label: "India",
    basePath: "/in",
    home: "/in"
  }
};

export const getMarketFromPath = (pathname: string): Market => {
  if (pathname.startsWith("/in/") || pathname === "/in") {
    return markets.in;
  }
  return markets.sg;
};
