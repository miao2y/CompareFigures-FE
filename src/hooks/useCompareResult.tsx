import { useMemo, useState } from "react";

export interface CompareResultDetail {
  result: boolean;
  message: string;
}

export interface DistanceCompareResultDetail extends CompareResultDetail {
  phase_name: string;
  a_wrong_indexes: number[];
  a_wrong_rows?: Array<{
    [key in string]: number;
  }>;
  b_wrong_indexes: number[];
  b_wrong_rows?: Array<{
    [key in string]: number;
  }>;
}

export interface PhaseNameCompareResultDetail extends CompareResultDetail {
  a_missing_phase_names: string[];
  b_missing_phase_names: string[];
  a_phase_names_set: string[];
  b_phase_names_set: string[];
}

export interface CompareResult<T extends CompareResultDetail> {
  item_name: string;
  result: boolean;
  detail: T;
}

export interface FigureTransferResult {
  columns: string[];
  list: Array<{
    [key in string]: number;
  }>;
}

export function useCompareResult() {
  const [compareResult, setCompareResult] =
    useState<Array<CompareResult<any>>>();

  const isSame = useMemo(() => {
    if (compareResult) {
      return compareResult.every((i) => i.result);
    }
    return false;
  }, [compareResult]);

  const totalTests = useMemo(() => {
    return compareResult?.length;
  }, [compareResult]);

  const passedTests = useMemo(() => {
    return compareResult?.filter((i) => i.result).length;
  }, [compareResult]);

  const phaseCompareResult = useMemo(() => {
    if (compareResult) {
      return compareResult
        .filter((i) => i.item_name === "相比较")
        .map((i) => {
          return i as CompareResult<PhaseNameCompareResultDetail>;
        });
    }
    return [];
  }, [compareResult]);
  const fileCompareResult = useMemo(() => {
    if (compareResult) {
      return compareResult
        .filter((i) => i.item_name === "文件检验")
        .map((i) => {
          return i as CompareResult<PhaseNameCompareResultDetail>;
        });
    }
    return [];
  }, [compareResult]);

  const distanceCompareResult: CompareResult<DistanceCompareResultDetail>[] =
    useMemo(() => {
      if (compareResult) {
        return compareResult
          .filter((i) => i.item_name === "距离比较")
          .map((i) => {
            return i as CompareResult<DistanceCompareResultDetail>;
          });
      }
      return [];
    }, [compareResult]);

  return {
    compareResult,
    setCompareResult,
    isSame,
    phaseCompareResult,
    distanceCompareResult,
    fileCompareResult,
    totalTests,
    passedTests,
  };
}
