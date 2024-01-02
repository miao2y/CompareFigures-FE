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
import { CompareReport } from "../components/CompareResult/CompareReport";

export function CompareFiguresSingle() {
  const [currentStep, setCurrentStep] = useState(0);
  const figure1 = useFigure();
  const figure2 = useFigure();
  const compareResultHook = useCompareResult();

  const [phaseNameCol, setPhaseNameCol] = useState<string>("phase_name");
  const [regList, setRegList] = useState<CheckboxValueType[]>();

  const [threshold, setThreshold] = useState<number>(0.05);
  const [allowErrCount, setAllowErrCount] = useState<number>(5);
  const [decimalPoints, setDecimalPoints] = useState<{
    [key: string]: number | null;
  }>({
    T: 4,
  });
  const [report, setReport] = useState();

  useEffect(() => {
    setRegList([]);
  }, [figure1.figure, figure2.figure]);

  const commonNumericColumns = useMemo(() => {
    return figure1.transferResult?.columns.filter((v) => {
      return (
        figure2.transferResult?.columns &&
        figure2.transferResult?.columns?.indexOf(v) > -1
      );
    });
  }, [figure1.transferResult, figure2.transferResult]);

  async function submit() {
    const formData = new FormData();
    formData.set("figure1", figure1.figure as RcFile);
    formData.set("figure2", figure2.figure as RcFile);
    formData.set("threshold", String(threshold));
    formData.set("allow_err_count", String(allowErrCount));
    formData.set("decimal_points", JSON.stringify(decimalPoints));
    formData.set("reg_list", JSON.stringify(regList));
    formData.set("phase_name_col", phaseNameCol);
    try {
      const response: AxiosResponse<any> = await axios.post(
        Config.basePath + "single",
        formData
      );
      setReport(response.data);
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
            title: "上传相图",
            description: "请上传DAT格式的相图",
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
                <Upload.Dragger {...figure1.figureUploadProps}>
                  <p className="ant-upload-drag-icon">
                    {!figure1.figure && <InboxOutlined />}
                    {figure1.figure && (
                      <CheckCircleOutlined style={{ color: green.primary }} />
                    )}
                  </p>
                  <p className="ant-upload-text">
                    点击或拖拽{figure1.figure && "重新"}上传
                  </p>
                  {!figure1.figure && (
                    <p className="ant-upload-hint">请选择 DAT 格式的文件</p>
                  )}
                  {figure1.figure && (
                    <p className="ant-upload-hint">
                      已选择文件: {figure1.figure.name}
                    </p>
                  )}
                </Upload.Dragger>
              </ProForm.Item>
              <ProForm.Item label={"FigureB"}>
                <Upload.Dragger {...figure2.figureUploadProps}>
                  <p className="ant-upload-drag-icon">
                    {!figure2.figure && <InboxOutlined />}
                    {figure2.figure && (
                      <CheckCircleOutlined style={{ color: green.primary }} />
                    )}
                  </p>
                  <p className="ant-upload-text">
                    点击或拖拽{figure2.figure && "重新"}上传
                  </p>
                  {!figure2.figure && (
                    <p className="ant-upload-hint">请选择 DAT 格式的文件</p>
                  )}
                  {figure2.figure && (
                    <p className="ant-upload-hint">
                      已选择文件: {figure2.figure.name}
                    </p>
                  )}
                </Upload.Dragger>
              </ProForm.Item>
            </>
          )}
          {currentStep === 1 && (
            <>
              <ProForm.Item label={"参与进行距离比较的列"}>
                <Checkbox.Group value={regList} onChange={setRegList}>
                  <Row style={{ width: "100%" }}>
                    {commonNumericColumns
                      ?.filter((i) => i != phaseNameCol)
                      .map((i) => (
                        <Col key={i} span={30}>
                          <Checkbox style={{ width: 120 }} value={i}>
                            {i}
                          </Checkbox>
                        </Col>
                      ))}
                  </Row>
                </Checkbox.Group>
              </ProForm.Item>
              {(regList?.length ?? 0) > 0 && (
                <ProForm.Item label={"计算中保留小数点"}>
                  <Row gutter={8}>
                    {regList?.map((i) => {
                      return (
                        <Col key={String(i)} span={8}>
                          <InputNumber<number>
                            style={{
                              width: "100%",
                              marginBottom: 8,
                            }}
                            addonBefore={String(i)}
                            value={decimalPoints?.[String(i)]}
                            precision={0}
                            onChange={(v) => {
                              const data = {
                                ...decimalPoints,
                              };
                              data[String(i)] = v;
                              setDecimalPoints(data);
                            }}
                          />
                        </Col>
                      );
                    })}
                  </Row>
                </ProForm.Item>
              )}

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
          {currentStep == 2 && report && <CompareReport data={report} />}

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
