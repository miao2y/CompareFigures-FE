import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { green, red } from "@ant-design/colors";
import React from "react";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";

interface IProps {
  result: boolean;
  style?: React.CSSProperties;
}
export function ResultIcon(props: IProps) {
  return props.result ? (
    <CheckCircleOutlined style={{ color: green.primary, ...props.style }} />
  ) : (
    <CloseCircleOutlined style={{ color: red.primary, ...props.style }} />
  );
}
