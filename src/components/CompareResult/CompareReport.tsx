import { CompareResult, useCompareResult } from "../../hooks/useCompareResult";
import {
  Col,
  Collapse,
  Descriptions,
  List,
  Result,
  Row,
  Table,
  Typography,
} from "antd";
import { ResultIcon } from "./ResultIcon";
import { green, red } from "@ant-design/colors";
import React, { useEffect } from "react";
import Flex from "../shared/Flex";

export function CompareReport(props: { data: Array<CompareResult<any>> }) {
  const compareResultHook = useCompareResult();
  useEffect(() => {
    compareResultHook.setCompareResult(props.data);
  }, [props.data]);

  return (
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
              header={
                <Flex direction={"column"}>
                  <Typography.Text>{i.item_name}</Typography.Text>
                  <Typography.Text type={"secondary"}>
                    {i.detail.message}
                  </Typography.Text>
                </Flex>
              }
              extra={<ResultIcon result={i.result} style={{ fontSize: 20 }} />}
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
                    <Typography.Title level={5}>FigureA 中相</Typography.Title>
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
                    <Typography.Title level={5}>FigureB 中相</Typography.Title>
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
        {compareResultHook.fileCompareResult.map((i, index) => {
          return (
            <Collapse.Panel
              key={i.item_name}
              header={
                <Flex direction={"column"}>
                  <Typography.Text>{i.item_name}</Typography.Text>
                  <Typography.Text type={"secondary"}>
                    {i.detail.message}
                  </Typography.Text>
                </Flex>
              }
              extra={<ResultIcon result={i.result} style={{ fontSize: 20 }} />}
            >
              <div>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label={"文件检验"}>
                    {i.result ? "测试成功" : "测试失败"}
                  </Descriptions.Item>
                  <Descriptions.Item label={"测试信息"}>
                    {i.detail.message}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </Collapse.Panel>
          );
        })}
        {compareResultHook.distanceCompareResult?.map((i, index) => {
          return (
            <Collapse.Panel
              key={i.item_name + i.detail.phase_name}
              header={
                <Flex direction={"column"}>
                  <Typography.Text>
                    相：{i.detail.phase_name} 的距离比较
                  </Typography.Text>
                  <Typography.Text type={"secondary"}>
                    {i.detail.message}
                  </Typography.Text>
                </Flex>
              }
              extra={<ResultIcon result={i.result} style={{ fontSize: 20 }} />}
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
  );
}
