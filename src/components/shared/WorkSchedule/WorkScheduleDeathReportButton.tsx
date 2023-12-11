import { TbPlantOff } from "react-icons/all";
import { Modal, Typography } from "antd";
import Flex from "../Flex";
import React from "react";
import { useBoolean } from "react-hanger";
import WorkScheduleFinishSproutForm from "./Finish/WorkScheduleFinishSproutForm";
import WorkScheduleFinishWeightForm from "./Finish/WorkScheduleFinishWeightForm";
import WorkScheduleFinishPlantMeasureForm from "./Finish/WorkScheduleFinishPlantMeasureForm";
import WorkScheduleFinishDeathReportForm from "./Finish/WorkScheduleFinishDeathReportForm";

export function WorkScheduleDeathReportButton(props: {
  cultureBatchId?: number;
  onSuccess?: () => any;
}) {
  const isOperate = useBoolean(false);
  return (
    <>
      <Flex
        justify={"center"}
        align={"center"}
        direction={"row"}
        style={{
          backgroundColor: "#722ed1",
          padding: 8,
          cursor: "pointer",
          width: 150,
          margin: 4,
        }}
        onClick={() => {
          isOperate.setTrue();
          // tabLayout.goTo(`/app/workSchedule/calender?cultureBatchId=${findHook.data?.id}`);
        }}
      >
        <TbPlantOff fontSize={30} style={{ color: "#fff" }} />
        <Typography.Text style={{ marginLeft: 4, color: "#fff" }} strong>
          记录死亡
        </Typography.Text>
      </Flex>
      <Modal
        open={isOperate.value}
        onCancel={isOperate.setFalse}
        title="记录死亡信息"
        footer={null}
      >
        {props.cultureBatchId && (
          <WorkScheduleFinishDeathReportForm
            cultureBatchId={props.cultureBatchId}
            onSuccess={() => {
              isOperate.setFalse();
              props.onSuccess && props.onSuccess();
            }}
          />
        )}
      </Modal>
    </>
  );
}
