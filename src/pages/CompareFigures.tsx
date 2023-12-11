import {
  Button,
  InputNumber,
  message,
  Modal,
  Result,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { DraggerProps, RcFile, UploadChangeParam } from "antd/lib/upload";
import { InboxOutlined, CheckCircleOutlined } from "@ant-design/icons";

import React, { useState } from "react";
import { useToken } from "antd/lib/theme/internal";
import useTheme from "antd/lib/config-provider/hooks/useTheme";
import {
  red,
  volcano,
  gold,
  yellow,
  lime,
  green,
  cyan,
  blue,
  geekblue,
  purple,
  magenta,
  grey,
} from "@ant-design/colors";
import { ProForm } from "@ant-design/pro-components";
import axios, { AxiosError, AxiosResponse } from "axios";

export function CompareFigures() {
  const [figure1, setFigure1] = useState<UploadFile>();
  const props1: DraggerProps = {
    name: "figure1",
    multiple: false,
    showUploadList: false,
    beforeUpload: () => false,
    onChange: (info: UploadChangeParam) => {
      setFigure1(info.file);
    },
  };

  const [figure2, setFigure2] = useState<UploadFile>();
  const props2: DraggerProps = {
    name: "figure2",
    multiple: false,
    showUploadList: false,
    beforeUpload: () => false,
    onChange: (info: UploadChangeParam) => {
      setFigure2(info.file);
    },
  };

  const [threshold, setThreshold] = useState<number>(0.05);
  const [allowErrCount, setAllowErrCount] = useState<number>(5);
  const [decimalPoints, setDecimalPoints] = useState<{
    [key: string]: number | null;
  }>({});

  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
  }>();

  async function submit() {
    const formData = new FormData();
    formData.set("figure1", figure1 as RcFile);
    formData.set("figure2", figure2 as RcFile);
    formData.set("threshold", String(threshold));
    formData.set("allow_err_count", String(allowErrCount));
    formData.set("decimal_points", JSON.stringify(decimalPoints));
    try {
      const response: AxiosResponse<any> = await axios.post(
        "http://127.0.0.1:7777",
        formData
      );
      setResult(response.data);
    } catch (e) {
      setResult(
        (e as AxiosError<{ message: string; success?: boolean }>)?.response
          ?.data
      );
    }
  }

  return (
    <div>
      <div style={{ width: 800, margin: "auto" }}>
        <ProForm submitter={false}>
          <ProForm.Item label={"计算中保留小数点"}>
            <InputNumber<number>
              addonBefore="T"
              value={decimalPoints?.["T"]}
              precision={0}
              onChange={(v) =>
                setDecimalPoints({
                  ...decimalPoints,
                  T: v,
                })
              }
            />
            <InputNumber<number>
              addonBefore="x(Al)"
              value={decimalPoints?.["x(Al)"]}
              precision={0}
              onChange={(v) =>
                setDecimalPoints({
                  ...decimalPoints,
                  "x(Al)": v,
                })
              }
            />
            <InputNumber<number>
              addonBefore="x(Zn)"
              value={decimalPoints?.["x(Zn)"]}
              precision={0}
              onChange={(v) =>
                setDecimalPoints({
                  ...decimalPoints,
                  "x(Zn)": v,
                })
              }
            />
          </ProForm.Item>
          <ProForm.Item label={"距离阈值(归一化后欧氏距离)"}>
            <InputNumber<number>
              value={threshold}
              onChange={(v) => v && setThreshold(v)}
            />
          </ProForm.Item>
          <ProForm.Item label={"允许超出阈值坐标数"}>
            <InputNumber<number>
              value={allowErrCount}
              onChange={(v) => v && setAllowErrCount(v)}
              precision={0}
            />
          </ProForm.Item>

          <ProForm.Item label={"Figure1"}>
            <Upload.Dragger {...props1}>
              <p className="ant-upload-drag-icon">
                {!figure1 && <InboxOutlined />}
                {figure1 && (
                  <CheckCircleOutlined style={{ color: green.primary }} />
                )}
              </p>
              <p className="ant-upload-text">
                点击或拖拽{figure1 && "重新"}上传
              </p>
              {!figure1 && (
                <p className="ant-upload-hint">请选择 DAT 格式的文件</p>
              )}
              {figure1 && (
                <p className="ant-upload-hint">已选择文件: {figure1.name}</p>
              )}
            </Upload.Dragger>
          </ProForm.Item>
          <ProForm.Item label={"Figure2"}>
            <Upload.Dragger {...props2}>
              <p className="ant-upload-drag-icon">
                {!figure2 && <InboxOutlined />}
                {figure2 && (
                  <CheckCircleOutlined style={{ color: green.primary }} />
                )}
              </p>
              <p className="ant-upload-text">
                点击或拖拽{figure2 && "重新"}上传
              </p>
              {!figure2 && (
                <p className="ant-upload-hint">请选择 DAT 格式的文件</p>
              )}
              {figure2 && (
                <p className="ant-upload-hint">已选择文件: {figure2.name}</p>
              )}
            </Upload.Dragger>
          </ProForm.Item>
          <ProForm.Item>
            <Button type={"primary"} onClick={submit}>
              提交
            </Button>
          </ProForm.Item>
        </ProForm>
      </div>
      <Modal
        width={800}
        title={"判定结果"}
        open={!!result}
        onCancel={() => setResult(undefined)}
      >
        <Result
          status={result?.success ? "success" : "error"}
          title={"Figure1 和 Figure2 " + (result?.success ? "" : "不") + "一致"}
          subTitle={result?.message}
        />
      </Modal>
    </div>
  );
}
