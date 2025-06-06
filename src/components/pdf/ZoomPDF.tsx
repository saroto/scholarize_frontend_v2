import React, {
  forwardRef,
  memo,
  PropsWithChildren,
  RefObject,
  useRef,
} from "react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchContentRef,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

export interface ZoomProps {
  onZoomScaleChange: (zoomScale: number) => void;
  getCurrentPage?: () => number | null;
}

const Zoom = forwardRef<ReactZoomPanPinchRef, PropsWithChildren<ZoomProps>>(
  (props, ref) => {
    const { children, onZoomScaleChange, getCurrentPage } = props;

    const onTransformed = (
      transformRef: ReactZoomPanPinchRef,
      state: {
        scale: number;
        positionX: number;
        positionY: number;
      }
    ): void => {
      onZoomScaleChange(state.scale);
    };

    return (
      <TransformWrapper
        ref={ref}
        initialScale={1}
        centerOnInit={false} // Disable auto-centering
        centerZoomedOut={false} // Disable auto-centering on zoom out
        minScale={0.3}
        maxScale={10}
        limitToBounds={false} // Allow free movement
        onTransformed={onTransformed}
        disabled
        wheel={{
          wheelDisabled: true,
        }}
        pinch={{}}
        panning={{}}
        zoomAnimation={{
          animationTime: 200,
        }}
        alignmentAnimation={{
          disabled: true, // Disable alignment animations
        }}
      >
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 0,
            overflow: "inherit",
            pointerEvents: "auto",
            userSelect: "auto",
          }}
          contentStyle={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}
        </TransformComponent>
      </TransformWrapper>
    );
  }
);

export default memo(Zoom);
