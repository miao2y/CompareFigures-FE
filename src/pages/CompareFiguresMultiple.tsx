import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Descriptions,
  InputNumber,
  List,
  message,
  Modal,
  Result,
  Row,
  Steps,
  Table,
  Typography,
  Upload,
  UploadFile,
} from "antd";
import { DraggerProps, RcFile, UploadChangeParam } from "antd/lib/upload";
import {
  InboxOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import React, { useEffect, useMemo, useState } from "react";
import { green, red } from "@ant-design/colors";
import { ProForm } from "@ant-design/pro-components";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Config } from "../config";
import { useAsyncEffect } from "ahooks";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { useFigure } from "../hooks/useFigure";
import { ResultIcon } from "../components/CompareResult/ResultIcon";
import {
  CompareResult,
  DistanceCompareResultDetail,
  useCompareResult,
} from "../hooks/useCompareResult";
import { useFigureDirectory } from "../hooks/useFigureDirectory";
import { CompareReport } from "../components/CompareResult/CompareReport";

export function CompareFiguresMultiple() {
  const [currentStep, setCurrentStep] = useState(0);
  const figure1 = useFigureDirectory();
  const figure2 = useFigureDirectory();
  const compareResultHook = useCompareResult();

  const [phaseNameCol, setPhaseNameCol] = useState<string>("phase_name");
  const [indexList, setIndexList] = useState<CheckboxValueType[]>();

  const [threshold, setThreshold] = useState<number>(0.05);
  const [allowErrCount, setAllowErrCount] = useState<number>(5);
  const [decimalPoint, setDecimalPoint] = useState<number | undefined>(4);
  const [reports, setReports] = useState<
    Array<{
      filename: string;
      report: Array<CompareResult<any>>;
    }>
  >();

  // useEffect(() => {
  //   setNumericColumns([]);
  // }, [figure1.figure, figure2.figure]);
  //
  // const commonNumericColumns = useMemo(() => {
  //   return figure1.transferResult?.columns.filter((v) => {
  //     return (
  //       figure2.transferResult?.columns &&
  //       figure2.transferResult?.columns?.indexOf(v) > -1
  //     );
  //   });
  // }, [figure1.transferResult, figure2.transferResult]);

  async function submit() {
    const formData = new FormData();
    formData.append("threshold", String(threshold));
    formData.append("allow_err_count", String(allowErrCount));
    formData.append("decimal_point", String(decimalPoint));
    formData.append("force_column_indexes", JSON.stringify(indexList));
    formData.append("phase_name_col", phaseNameCol);
    // formData.append("figure1s[]", figure1.figures.value as any);
    // formData.append("figure2s[]", figure2.figures.value as any);
    figure1.figures.value.forEach((file) => {
      formData.append("figure1s[]", file.originFileObj as RcFile);
    });
    figure2.figures.value.forEach((file) => {
      formData.append("figure2s[]", file.originFileObj as RcFile);
    });
    try {
      const response: AxiosResponse<any> = await axios.post(
        Config.basePath + "multiple",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );
      setReports(response.data);
    } catch (e) {
      console.log(e);
      message.error(e.message);
    }
  }

  return (
    <div>
      <Steps
        style={{ margin: "auto", marginBottom: 16, maxWidth: 1200 }}
        current={currentStep}
        items={[
          {
            title: "上传文件夹",
            description: "请上传两个 DAT 格式的相图文件夹",
          },
          {
            title: "填写配置",
            description: "选择参与距离比较的数据列、距离阈值等",
          },
          {
            title: "查看结果",
            description: "您可以在此处查看比较的详细报告",
          },
        ]}
      />
      <div style={{ width: 800, margin: "auto" }}>
        <ProForm submitter={false} layout="vertical">
          {currentStep == 0 && (
            <>
              <ProForm.Item label={"FigureA"}>
                <Upload.Dragger {...figure1.directoryUploadProps}>
                  <p className="ant-upload-drag-icon">
                    {figure1.figures.value.length === 0 && <InboxOutlined />}
                    {figure1.figures.value.length > 0 && (
                      <CheckCircleOutlined style={{ color: green.primary }} />
                    )}
                  </p>
                  <p className="ant-upload-text">
                    点击或拖拽{figure1.figures.value.length > 0 && "重新"}上传
                  </p>
                  {figure1.figures.value.length === 0 && (
                    <p className="ant-upload-hint">请选择 DAT 格式的文件夹</p>
                  )}
                  {figure1.figures.value.length > 0 && (
                    <p className="ant-upload-hint">
                      已选择文件:
                      {figure1.figures.value.map((i) => i.name).join("、")}
                    </p>
                  )}
                </Upload.Dragger>
              </ProForm.Item>
              <ProForm.Item label={"FigureB"}>
                <Upload.Dragger {...figure2.directoryUploadProps}>
                  <p className="ant-upload-drag-icon">
                    {figure2.figures.value.length === 0 && <InboxOutlined />}
                    {figure2.figures.value.length > 0 && (
                      <CheckCircleOutlined style={{ color: green.primary }} />
                    )}
                  </p>
                  <p className="ant-upload-text">
                    点击或拖拽{figure2.figures.value.length > 0 && "重新"}上传
                  </p>
                  {figure2.figures.value.length === 0 && (
                    <p className="ant-upload-hint">请选择 DAT 格式的文件夹</p>
                  )}
                  {figure2.figures.value.length > 0 && (
                    <p className="ant-upload-hint">
                      已选择文件:
                      {figure2.figures.value.map((i) => i.name).join("、")}
                    </p>
                  )}
                </Upload.Dragger>
              </ProForm.Item>
            </>
          )}
          {currentStep === 1 && (
            <>
              <ProForm.Item label={"参与进行距离比较的列"}>
                <Checkbox.Group
                  value={indexList}
                  onChange={(v) => {
                    console.log(v);
                    setIndexList(v);
                  }}
                >
                  {new Array(10).fill(0).map((i, index) => (
                    <Checkbox key={index} value={index}>
                      {index}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </ProForm.Item>
              <ProForm.Item label={"计算中保留小数点"}>
                <InputNumber<number>
                  style={{
                    width: "100%",
                    marginBottom: 8,
                  }}
                  value={decimalPoint}
                  precision={0}
                  onChange={(v) => {
                    if (v) {
                      setDecimalPoint(v);
                    } else {
                      setDecimalPoint(undefined);
                    }
                  }}
                />
              </ProForm.Item>
              <ProForm.Item label={"距离阈值(归一化后欧氏距离)"}>
                <InputNumber<number>
                  value={threshold}
                  onChange={(v) => v && setThreshold(v)}
                />
              </ProForm.Item>
              <ProForm.Item label={"允许超出阈值个数"}>
                <InputNumber<number>
                  value={allowErrCount}
                  onChange={(v) => v && setAllowErrCount(v)}
                  precision={0}
                />
              </ProForm.Item>
            </>
          )}
          {currentStep === 2 && reports && (
            <>
              <Result
                status={
                  reports.every((i) => i.report.every((i) => i.result))
                    ? "success"
                    : "error"
                }
                title={
                  reports.every((i) => i.report.every((i) => i.result))
                    ? "完全一致"
                    : "并非完全一致"
                }
                subTitle={`通过文件/文件总数：${
                  reports
                    .map((i) => i.report.every((i) => i.result))
                    .filter((i) => i).length
                }/${reports.length}`}
              />
              <Collapse size="large">
                {reports
                  ?.sort((a, b) => (a.filename > b.filename ? 1 : -1))
                  .map((i) => (
                    <Collapse.Panel
                      header={i.filename}
                      extra={
                        <ResultIcon
                          result={i.report.every((i) => i.result)}
                          style={{ fontSize: 20 }}
                        />
                      }
                      key={i.filename}
                    >
                      <Typography.Title level={5}>
                        {i.filename}
                      </Typography.Title>
                      <CompareReport data={i.report} />
                    </Collapse.Panel>
                  ))}
              </Collapse>
            </>
          )}

          <ProForm.Item>
            <Button.Group style={{ marginTop: 16 }}>
              {currentStep >= 1 && (
                <Button
                  onClick={() => {
                    setCurrentStep(currentStep - 1);
                  }}
                >
                  上一步
                </Button>
              )}
              {currentStep < 1 && (
                <Button
                  type={"primary"}
                  onClick={() => {
                    setCurrentStep(currentStep + 1);
                  }}
                >
                  下一步
                </Button>
              )}
              {currentStep == 1 && (
                <Button
                  type={"primary"}
                  onClick={() => {
                    setCurrentStep(currentStep + 1);
                    compareResultHook.setCompareResult(undefined);
                    submit();
                  }}
                >
                  提交
                </Button>
              )}
            </Button.Group>
          </ProForm.Item>
        </ProForm>
      </div>
      {/*<Modal*/}
      {/*  width={800}*/}
      {/*  title={"判定结果"}*/}
      {/*  open={!!result}*/}
      {/*  footer={*/}
      {/*    <Button type={"primary"} onClick={() => setResult(undefined)}>*/}
      {/*      确定*/}
      {/*    </Button>*/}
      {/*  }*/}
      {/*  onCancel={() => setResult(undefined)}*/}
      {/*>*/}
      {/*  <Result*/}
      {/*    status={result?.success ? "success" : "error"}*/}
      {/*    title={"Figure1 和 Figure2 " + (result?.success ? "" : "不") + "一致"}*/}
      {/*    subTitle={result?.message}*/}
      {/*  />*/}
      {/*</Modal>*/}
    </div>
  );
}
