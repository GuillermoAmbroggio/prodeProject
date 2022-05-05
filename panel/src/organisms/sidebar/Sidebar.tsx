import React, { useState } from "react";
import { Layout as AntdLayout, Menu } from "antd";
import { FixtureModule, UserModule } from "../../routes/mainRoutes/components";
import { ModuleRoute } from "../../routes/mainRoutes/components/modules.type";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  let navigate = useNavigate();

  const { Sider } = AntdLayout;
  const { SubMenu } = Menu;

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  const navigation = (url: string) => {
    navigate(url);
  };

  const allRoutes: ModuleRoute[] = [UserModule, FixtureModule];

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div
        style={{
          height: 60,
          margin: 16,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <i className="fas fa-futbol" /> TU PRONOSTICO
      </div>
      <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
        {allRoutes && allRoutes.length
          ? allRoutes.map((module, i) => {
              console.log("sidebarrrr", i);
              if (module.subComponents && module.subComponents.length) {
                return (
                  <SubMenu
                    key={`sub-${i}`}
                    icon={<i className={module.iconName} />}
                    title={module.siderTitle}
                  >
                    <Menu.Item
                      key={`men-${i}`}
                      onClick={() => {
                        navigation(`/${module.path}`);
                      }}
                    >
                      {module.name}
                    </Menu.Item>
                    {module.subComponents && module.subComponents.length
                      ? module.subComponents.map((subComp, j) => (
                          <Menu.Item
                            key={`menu-${i}-${j}`}
                            onClick={() => {
                              navigation(`/${module.path}/${subComp.path}`);
                            }}
                          >
                            {subComp.name}
                          </Menu.Item>
                        ))
                      : null}
                  </SubMenu>
                );
              } else {
                return (
                  <Menu.Item
                    key={`sub-${i}`}
                    icon={<i className={module.iconName} />}
                    onClick={() => {
                      navigation(`/${module.path}`);
                    }}
                  >
                    {module.siderTitle}
                  </Menu.Item>
                );
              }
            })
          : null}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
