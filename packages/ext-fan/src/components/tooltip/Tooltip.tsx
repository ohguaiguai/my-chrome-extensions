import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { ReactComponent as IconHelp } from "@assets/img/icon-help.svg";

import clsx from "clsx";
import styles from "./styles.module.css";

type ITooltip = {
  text: string;
  anchor: Element | null;
};

let tooltip: ITooltip = {
  text: "",
  anchor: null,
};

let setTooltipConfigRef: null | ((tip: ITooltip) => void) = null;

export const setTooltip = (tip: ITooltip | null) => {
  if (tip && tip.anchor) {
    tooltip = tip;
  } else {
    tooltip = {
      text: "",
      anchor: null,
    };
  }
  setTooltipConfigRef?.(tooltip);
};

export const TooltipContainer = () => {
  const [tooltipConfig, setTooltipConfig] = useState<ITooltip>(tooltip);

  const domRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setTooltipConfigRef = setTooltipConfig;
  }, []);

  useLayoutEffect(() => {
    const { current: domTip } = domRef;
    if (!domTip) {
      return;
    }

    domTip.style.cssText = "top: -10000px; left: -10000px";
  }, [tooltipConfig]);

  useEffect(() => {
    const { anchor } = tooltipConfig;
    if (!anchor) {
      return;
    }

    const { current: domTip } = domRef;
    if (!domTip) {
      return;
    }

    const { top, left, width } = anchor.getBoundingClientRect();

    const { top: parentTop, left: parentLeft } =
      domTip.offsetParent!.getBoundingClientRect();

    console.log(top, left, parentTop, parentLeft);

    const absLeft = left - parentLeft;
    const absTop = top - parentTop;

    const { offsetWidth: tooltipWidth, offsetHeight: tooltipHeight } = domTip;

    const tipLeft = Math.max(absLeft + width / 2 - tooltipWidth / 2, 10);
    const tipTop = Math.max(absTop - tooltipHeight, 10);

    domTip.style.cssText = `top:${tipTop}px;left:${tipLeft}px;width:${tooltipWidth}px;height:${tooltipHeight}px`;
  }, [tooltipConfig]);

  return tooltipConfig.text ? (
    <span
      ref={domRef}
      className={clsx(styles.tooltip, "color-accent-content bg-accent")}
    >
      {tooltipConfig.text}
    </span>
  ) : null;
};

export const Tooltip = ({
  tip,
  className,
}: {
  tip: string;
  className?: string;
}) => {
  const dom = useRef<SVGSVGElement>(null);
  const onMouseEnter = useCallback(() => {
    const svg = dom.current;
    if (!svg) {
      setTooltip(null);
      return;
    }
    setTooltip({ text: tip, anchor: dom.current });
  }, []);

  const onMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <IconHelp
      ref={dom}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
    />
  );
};
