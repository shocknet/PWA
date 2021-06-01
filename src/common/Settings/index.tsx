export { default as Icon } from "./Icon";
export * from "./Icon";

export { default as SettingOrData } from "./SettingOrData";
export * from "./SettingOrData";

export { default as SmallData } from "./SmallData";
export * from "./SmallData";

export const SectionTitle: React.FC<{ children: string }> = ({ children }) => (
  <h4 className="text-align-left">{children}</h4>
);
