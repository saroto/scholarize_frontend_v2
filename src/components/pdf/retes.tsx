import React, { forwardRef, memo, PropsWithChildren, RefObject } from "react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchContentRef,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
// import { createScopedLogger } from "@/utils/logger";

// const logger = createScopedLogger("components:builder:zoom:Zoom");
export interface ZoomProps {
  onZoomScaleChange: (zoomScale: number) => void;
}

const Zoom = forwardRef<ReactZoomPanPinchRef, PropsWithChildren<ZoomProps>>(
  (props, ref) => {
    const { children, onZoomScaleChange } = props;
    const onTransformed = (
      ref: ReactZoomPanPinchRef,
      state: {
        scale: number;
        positionX: number;
        positionY: number;
      }
    ): void => {
      // logger.debug("onTransformed", state);

      onZoomScaleChange(state.scale);
    };

    return (
      // <div className="relative w-full h-full">
      <TransformWrapper
        ref={ref}
        initialScale={1}
        centerOnInit
        centerZoomedOut
        minScale={0.3}
        maxScale={3}
        onTransformed={onTransformed}
        disabled
        wheel={{
          wheelDisabled: true,
          // disabled: true,
        }}
        pinch={
          {
            // disabled: true,
          }
        }
        panning={
          {
            // disabled: true,
          }
        }
        zoomAnimation={{
          animationTime: 200,
        }}
        // disabled
      >
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
            overflow: "inherit",
            pointerEvents: "auto",
            userSelect: "auto",
          }}
          contentStyle={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}
        </TransformComponent>
      </TransformWrapper>
      // </div>
    );
  }
);

export default memo(Zoom);
