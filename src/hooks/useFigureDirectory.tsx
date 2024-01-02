import { useState } from "react";
import { UploadFile } from "antd";
import { useArray } from "react-hanger";
import { DraggerProps, UploadChangeParam } from "antd/lib/upload";

export function useFigureDirectory() {
  const figures = useArray<UploadFile>([]);

  const directoryUploadProps: DraggerProps = {
    name: "figure1",
    multiple: false,
    directory: true,
    showUploadList: true,
    beforeUpload: () => false,
    onChange: (info: UploadChangeParam) => {
      figures.clear();
      figures.setValue(info.fileList);
    },
    accept: ".dat",
  };

  return {
    figures,
    directoryUploadProps,
  };
}
