interface ModuleScreen {
  name: string;
  path: string;
  component: JSX.Element;
}

export interface ModuleRoute extends ModuleScreen {
  subComponents?: ModuleScreen[];
  siderTitle: string;
  iconName: string;
}
