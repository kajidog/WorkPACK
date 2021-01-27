import { useRouter } from "next/router";
import React from "react";
import electron from "electron";

const IndexPage = () => {
  const router = useRouter();
  React.useEffect(() => {
    if (router.query.code) {
      electron.ipcRenderer.sendSync("set_token", [router.query.code]);
    }
  }, []);
  return <div>{router.query.code}</div>;
};

export default IndexPage;
