import { useState } from "react";
import { message, UploadFile } from "antd";
import { DraggerProps, RcFile, UploadChangeParam } from "antd/lib/upload";
import axios, { AxiosResponse } from "axios";
import { Config } from "../config";
import { useAsyncEffect } from "ahooks";
interface FigureTransferResult {
  columns: string[];
  list: Array<{
    [key in string]: number;
  }>;
}

async function transfer(figure: UploadFile) {
  const formData = new FormData();
  formData.set("figure1", figure as RcFile);
  try {
    const response: AxiosResponse<FigureTransferResult> = await axios.post(
      Config.basePath + "transfer",
      formData
    );
    return response.data;
  } catch (e) {
    console.log(e);
    message.error(e.message);
  }
}

export function useFigure() {
  const [figure, setFigure] = useState<UploadFile>();
  const [transferResult, setTransferResult] = useState<FigureTransferResult>();

  const figureUploadProps: DraggerProps = {
    name: "figure1",
    multiple: false,
    showUploadList: false,
    beforeUpload: () => false,
    onChange: (info: UploadChangeParam) => {
      setFigure(info.file);
    },
    accept: ".dat",
  };

  useAsyncEffect(async () => {
    if (figure) {
      setTransferResult(await transfer(figure));
    }
  }, [figure]);
  return {
    figure,
    setFigure,
    figureUploadProps,
    transferResult,
    setTransferResult,
  };
}
