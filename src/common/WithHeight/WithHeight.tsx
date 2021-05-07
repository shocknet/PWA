import React from "react";

export interface WithHeighthProps extends React.HTMLAttributes<{}> {
  onHeight(height: number): void;
}

const WithHeight: React.FC<WithHeighthProps> = ({
  children,
  onHeight,
  ...props
}) => {
  const divRefCb = React.useCallback(
    el => {
      // https://www.pluralsight.com/tech-blog/getting-size-and-position-of-an-element-in-react/
      if (!el) return;
      try {
        onHeight(el.getBoundingClientRect().height);
      } catch (e) {
        console.log(`Error inside onHeight mechanism in WithHeight:`);
        console.log(e);
      }
    },
    [onHeight]
  );

  return (
    <div {...props} ref={divRefCb}>
      {children}
    </div>
  );
};

export default WithHeight;
