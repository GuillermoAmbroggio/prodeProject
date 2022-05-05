import React from "react";
import { Dropdown, Layout as AntdLayout, Menu } from "antd";
import { useClientStore } from "../../hooks";
import { useNavigate } from "react-router-dom";
interface IHeaderProps {}

const Header: React.FC<IHeaderProps> = ({}) => {
  const { dispatch } = useClientStore();
  let navigate = useNavigate();

  const { Header } = AntdLayout;
  const options = (
    <Menu>
      <Menu.Item
        key="finish-session"
        danger
        icon={<i className="fas fa-user" />}
        onClick={() => {
          dispatch({ type: "LOGOUT" });
          navigate("/");
        }}
      >
        Cerrar sesion
      </Menu.Item>
    </Menu>
  );
  return (
    <Header
      className="site-layout-background"
      style={{ display: "flex", justifyContent: "end" }}
    >
      <Dropdown overlay={options}>
        <p
          onClick={(e) => e.preventDefault()}
          style={{ color: "white", cursor: "pointer" }}
        >
          Guillermo Ambroggio <i className="fas fa-chevron-down" />
        </p>
      </Dropdown>
      ,
    </Header>
  );
};

export default Header;
