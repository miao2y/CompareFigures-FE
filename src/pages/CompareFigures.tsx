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

export function CompareFigures() {
  const [currentStep, setCurrentStep] = useState(0);
  const figure1 = useFigure();
  const figure2 = useFigure();
  const compareResultHook = useCompareResult();

  const [phaseNameCol, setPhaseNameCol] = useState<string>("phase_name");
  const [numericColumns, setNumericColumns] = useState<CheckboxValueType[]>();

  const [threshold, setThreshold] = useState<number>(0.05);
  const [allowErrCount, setAllowErrCount] = useState<number>(5);
  const [decimalPoints, setDecimalPoints] = useState<{
    [key: string]: number | null;
  }>({
    T: 4,
  });

  useEffect(() => {
    setNumericColumns([]);
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
    formData.set("numeric_columns", JSON.stringify(numericColumns));
    formData.set("phase_name_col", phaseNameCol);
    try {
      const response: AxiosResponse<any> = await axios.post(
        Config.basePath,
        formData
      );
      compareResultHook.setCompareResult(response.data);
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
                <Checkbox.Group
                  value={numericColumns}
                  onChange={setNumericColumns}
                >
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
              {(numericColumns?.length ?? 0) > 0 && (
                <ProForm.Item label={"计算中保留小数点"}>
                  <Row gutter={8}>
                    {numericColumns?.map((i) => {
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
          {currentStep == 2 && (
            <>
              {compareResultHook.compareResult && (
                <Result
                  status={compareResultHook.isSame ? "success" : "error"}
                  title={
                    compareResultHook.isSame
                      ? "figureA 与 figureB 相同"
                      : "figureA 与 figureB 不同"
                  }
                  subTitle={`通过测试/测试总数：${compareResultHook.passedTests}/${compareResultHook.totalTests}`}
                />
              )}
              <Collapse size="large">
                {compareResultHook.phaseCompareResult.map((i, index) => {
                  return (
                    <Collapse.Panel
                      key={i.item_name}
                      header={i.item_name}
                      extra={
                        <ResultIcon
                          result={i.result}
                          style={{ fontSize: 20 }}
                        />
                      }
                    >
                      <div>
                        <Descriptions bordered column={2}>
                          <Descriptions.Item label={"测试结果"}>
                            {i.result ? "测试成功" : "测试失败"}
                          </Descriptions.Item>
                          <Descriptions.Item label={"测试信息"}>
                            {i.detail.message}
                          </Descriptions.Item>
                        </Descriptions>
                        <Row>
                          <Col span={12}>
                            <Typography.Title level={5}>
                              FigureA 中相
                            </Typography.Title>
                            <List
                              dataSource={i.detail.a_phase_names_set}
                              renderItem={(item) => {
                                return (
                                  <List.Item>
                                    <Typography.Text
                                      style={{
                                        color:
                                          i?.detail?.b_missing_phase_names?.indexOf(
                                            item
                                          ) >= 0
                                            ? red[7]
                                            : green[7],
                                      }}
                                      ellipsis={true}
                                    >
                                      {item}
                                    </Typography.Text>
                                  </List.Item>
                                );
                              }}
                            />
                          </Col>
                          <Col span={12}>
                            <Typography.Title level={5}>
                              FigureB 中相
                            </Typography.Title>
                            <List
                              dataSource={i.detail.b_phase_names_set}
                              renderItem={(item) => {
                                return (
                                  <List.Item>
                                    <Typography.Text
                                      style={{
                                        color:
                                          i?.detail?.a_missing_phase_names?.indexOf(
                                            item
                                          ) >= 0
                                            ? red[7]
                                            : green[7],
                                      }}
                                      ellipsis={true}
                                    >
                                      {item}
                                    </Typography.Text>
                                  </List.Item>
                                );
                              }}
                            />
                          </Col>
                        </Row>
                      </div>
                    </Collapse.Panel>
                  );
                })}
                {compareResultHook.distanceCompareResult?.map((i, index) => {
                  return (
                    <Collapse.Panel
                      key={i.item_name + i.detail.phase_name}
                      header={
                        <Typography.Text>
                          相：{i.detail.phase_name} 的距离比较
                        </Typography.Text>
                      }
                      extra={
                        <ResultIcon
                          result={i.result}
                          style={{ fontSize: 20 }}
                        />
                      }
                    >
                      <div>
                        <Descriptions bordered column={1}>
                          <Descriptions.Item label={"测试结果"}>
                            {i.result ? "测试成功" : "测试失败"}
                          </Descriptions.Item>
                          <Descriptions.Item label={"失败原因"}>
                            {i.detail.message}
                          </Descriptions.Item>
                          <Descriptions.Item label={"FigureA 错误行数"}>
                            {i.detail.a_wrong_indexes.join("、")}
                          </Descriptions.Item>
                          <Descriptions.Item label={"FigureB 错误行数"}>
                            {i.detail.b_wrong_indexes.join("、")}
                          </Descriptions.Item>
                        </Descriptions>
                        <div style={{ overflow: "scroll" }}>
                          {(i.detail?.a_wrong_rows?.length ?? 0) > 0 && (
                            <>
                              <Typography.Title level={5}>
                                FigureA 中错误行
                              </Typography.Title>
                              <Table
                                size={"small"}
                                bordered
                                scroll={{ y: 600 }}
                                pagination={false}
                                columns={[
                                  {
                                    title: "编号",
                                    dataIndex: "index",
                                    width: 120,
                                  },
                                  ...(i.detail.a_wrong_rows
                                    ? Object.keys(i.detail.a_wrong_rows[0])
                                        .filter((i) => i !== "index")
                                        .map((i) => ({
                                          title: i,
                                          dataIndex: i,
                                          width: 120,
                                        }))
                                    : []),
                                ]}
                                dataSource={i.detail.a_wrong_rows}
                              />
                            </>
                          )}
                          {(i.detail?.b_wrong_rows?.length ?? 0) > 0 && (
                            <>
                              <Typography.Title level={5}>
                                FigureB 中错误行
                              </Typography.Title>
                              <Table
                                bordered
                                scroll={{ y: 600 }}
                                pagination={false}
                                columns={[
                                  {
                                    title: "编号",
                                    dataIndex: "index",
                                    width: 120,
                                  },
                                  ...(i.detail.b_wrong_rows
                                    ? Object.keys(i.detail.b_wrong_rows[0])
                                        .filter((i) => i !== "index")
                                        .map((i) => ({
                                          title: i,
                                          dataIndex: i,
                                          width: 120,
                                        }))
                                    : []),
                                ]}
                                dataSource={i.detail.b_wrong_rows}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </Collapse.Panel>
                  );
                })}
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
