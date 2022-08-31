import { Layout, Menu, message } from "antd";
import React, {useEffect, useState } from "react";
import {
  logout,
  getTopGames,
  getRecommendations,
  searchGameById,
  getFavoriteItem,
} from "./utils";
import CustomSearch from "./components/CustomSearch";
import { LikeOutlined, FireOutlined } from "@ant-design/icons";
// import SubMenu from "antd/lib/menu/SubMenu";
// import TopGames from "./components/TopGames";
import PageHeader from "./components/PageHeader";
import Home from "./components/Home";
 
const { Sider, Content } = Layout;
 
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [topGames, setTopGames] = useState([]);
  const [resources, setResources] = useState({
    VIDEO: [],
    STREAM: [],
    CLIP: [],
  });
  // const [favoriteItems, setFavoriteItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState({
    VIDEO: [],
    STREAM: [],
    CLIP: [],
  });
 
  const signinOnSuccess = () => {
    getFavoriteItem().then((data) => {
      setLoggedIn(true);
      setFavoriteItems(data);
    });
  };
 
  const signoutOnClick = () => {
    logout()
      .then(() => {
        setLoggedIn(false);
        message.success("Successfully Signed out");
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
 
  const onGameSelect = ({ key }) => {
    if (key === "Recommendation") {
      getRecommendations().then((data) => {
        setResources(data);
      });
 
      return;
    }
 
    searchGameById(key).then((data) => {
      setResources(data);
    });
  };
 
  const customSearchOnSuccess = (data) => {
    setResources(data);
  };
 
  const favoriteOnChange = () => {
    getFavoriteItem()
      .then((data) => {
        setFavoriteItems(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
 
  useEffect(() => {
    getTopGames()
      .then((data) => {
        setTopGames(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  }, [getTopGames]);
 
  const mapTopGamesToProps = (topGames) => [
    {
      label: "Recommend for you!",
      key: "recommendation",
      icon: <LikeOutlined />,
    },
    {
      label: "Popular Games",
      key: "popular_games",
      icon: <FireOutlined />,
      children: topGames.map((game) => ({
        label: game.name,
        key: game.id,
        icon:
          <img
            alt="placeholder"
            src={game.box_art_url.replace('{height}', '40').replace('{width}', '40')}
            style={{ borderRadius: '50%', marginRight: '20px' }}
          />
      }))
    }
  ]


  return (
    <Layout>
      <PageHeader
        loggedIn={loggedIn}
        signoutOnClick={signoutOnClick}
        signinOnSuccess={signinOnSuccess}
        favoriteItems={favoriteItems}
      />
      <Layout>
        <Sider width={300} className="site-layout-background">
          <CustomSearch onSuccess={customSearchOnSuccess} />
          <Menu
            mode="inline"
            onSelect={onGameSelect}
            style={{ marginTop: "10px" }}
            items={mapTopGamesToProps(topGames)}
          />
        </Sider>
        <Layout style={{ padding: "24px" }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              height: 800,
              overflow: "auto",
            }}
          >
            <Home
              resources={resources}
              loggedIn={loggedIn}
              favoriteOnChange={favoriteOnChange}
              favoriteItems={favoriteItems}
            />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
 
export default App;

// class App extends React.Component {
//   state = {
//     loggedIn: false,
//     topGames: [],
//     resources: {
//       VIDEO: [],
//       STREAM: [],
//       CLIP: [],
//     },
//     favoriteItems: {
//       VIDEO: [],
//       STREAM: [],
//       CLIP: [],
//     },
//   }
 
//   favoriteOnChange = () => {
//     getFavoriteItem().then((data) => {
//       this.setState({
//         favoriteItems: data,
//         loggedIn: true
//       })
//     }).catch((err) => {
//       message.error(err.message);
//     })
//   }
 
//   onGameSelect = ({ key }) => {
//     if (key === 'Recommendation') {
//       getRecommendations().then((data) => {
//         this.setState({
//           resources: data,
//         })
//       })
 
//       return;
//     }
 
//     searchGameById(key).then((data) => {
//       this.setState({
//         resources: data,
//       })
//     })
//   }
 
//   customSearchOnSuccess = (data) => {
//     this.setState({
//       resources: data,
//     })
//   }
 
//   signinOnSuccess = () => {
//     getFavoriteItem().then((data) => {
//       this.setState({
//         favoriteItems: data,
//         loggedIn: true
//       })
//     }).catch((err) => {
//       message.error(err.message);
//     })
//   }
 
//   signoutOnClick = () => {
//     logout()
//       .then(() => {
//         this.setState({
//           loggedIn: false
//         })
//         message.success(`Successfull signed out`);
//       }).catch((err) => {
//         message.error(err.message);
//       })
//   }
 
//   componentDidMount = () => {
//     getTopGames()
//       .then((data) => {
//         this.setState({
//           topGames: data
//         })
//       })
//       .catch((err) => {
//         message.error(err.message);
//       })
//   }
 
//   render = () => (
//     <Layout>
//       <Header>
//         <Row justify="space-between">
//             <Col>
//               {
//                 this.state.loggedIn &&
//                 <Favorites data={this.state.favoriteItems} />
//               }
//             </Col>
//             <Col>
//               {
//                 this.state.loggedIn ? 
//                 <Button shape="round" onClick={this.signoutOnClick}>
//                   Logout</Button> :
//                 (
//                   <>
//                     <Login onSuccess={this.signinOnSuccess} />
//                     <Register />
//                   </>
//                 )
//               }
//             </Col>
//           </Row>
//       </Header>
//       <Layout>
//         <Sider width={300} className="site-layout-background">
//           <CustomSearch onSuccess={this.customSearchOnSuccess} />
//           <Menu
//             mode="inline"
//             onSelect={this.onGameSelect}
//             style={{ marginTop: '10px' }}
//           >
//             <Menu.Item icon={<LikeOutlined />} key="Recommendation">
//               Recommend for you!</Menu.Item>
//             <SubMenu icon={<FireOutlined />} key="Popular Games" title="Popular Games" className="site-top-game-list">
//               {
//                 this.state.topGames.map((game) => {
//                   return (
//                     <Menu.Item key={game.id} style={{ height: '50px' }}>
//                       <img 
//                         alt="Placeholder"
//                         src={game.box_art_url.replace('{height}', '40').replace('{width}', '40')}
//                         style={{ borderRadius: '50%', marginRight: '20px' }}
//                       />
//                       <span>
//                         {game.name}
//                       </span>
//                     </Menu.Item>
//                   )
//                 })
//               }
//             </SubMenu>
//           </Menu>
//         </Sider>
//         <Layout style={{ padding: '24px' }}>
//           <Content
//             className="site-layout-background"
//             style={{
//               padding: 24,
//               margin: 0,
//               height: 800,
//               overflow: 'auto'
//             }}
//           >
//             <Home 
//               resources={this.state.resources} 
//               loggedIn={this.state.loggedIn} 
//               favoriteItems={this.state.favoriteItems} 
//               favoriteOnChange={this.favoriteOnChange}
//             />
//           </Content>
//         </Layout>
//       </Layout>
//     </Layout>
//   )
// }
 
// export default App;

