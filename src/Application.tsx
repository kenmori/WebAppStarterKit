import React from "react";
import client from "modules/ApiClient";
import * as ReactRedux from "react-redux";
import * as Theme from "./theme";
import * as StyledComponents from "styled-components";
import * as StyledResetAdvanced from "styled-reset-advanced";
import * as History from "history";
import * as Store from "store";
import * as ErrorBoundary from "modules/ErrorBoundary";
import * as ReactRouter from "react-router-dom";
// import * as Modules from 'modules/PrivateRoute'
import * as AppContext from "modules/ApplicationContext";
import * as ConnectedRouter from "connected-react-router";
import * as Top from "page/Top";
import * as Login from "page/Login";
import * as Signup from "page/SignUp";
import * as SignUpDone from "page/SignUpDone";
import * as Terms from "page/Terms";
import * as ForgotPassword from "page/ForgotPassword";
import * as ForgotPasswordDone from "page/ForgotPasswordDone";
import * as NotFound from "page/NotFound";
import * as MailAddressChange from "page/MailAddressChange";
import * as MailAddressChangeDone from "page/MailAddressChangeDone";
import * as ReactCookie from "react-cookie";
import * as Navigation from "component/molecule/Navigation";
import * as Header from "component/molecule/Header";
import Footer from "component/molecule/Footer";
import * as PrivacyPolicy from "page/PrivacyPolicy";
import * as AboutCompany from "page/AboutCompany";
import * as Faq from "page/Faq";
import * as SiteMap from "page/SiteMap";
import { normalize, schema } from "normalizr";

const GlobalStyle = StyledComponents.createGlobalStyle`
  ${StyledResetAdvanced.default}
`;

const history = History.createBrowserHistory();
const store = Store.createStore(history);
const Application: React.FC = () => {
  const [applicationState, setState] = React.useState<{
    user: {
      isAuthenticated: boolean;
      cookie: string;
      id: string;
      email: string;
    };
  }>({
    user: { isAuthenticated: false, cookie: "", id: "", email: "" },
  });
  // thank you https://json.okiba.me/

  // {
  //   "id": "123",
  //   "author": {
  //     "id": "1",
  //     "name": "Paul"
  //   },
  //   "title": "My awesome blog post",
  //   "comments": [
  //     {
  //       "id": "324",
  //       "commenter": {
  //         "id": "2",
  //         "name": "Nicole"
  //       }
  //     }
  //   ]
  // }

  //to

  // {
  // 	"id": "123",
  // 	"author": {
  // 		"id": "1",
  // 		"name": "Paul"
  // 	},
  // 	"title": "My awesome blog post",
  // 	"comments": [
  // 		{
  // 			"id": "324",
  // 			"commenter": {
  // 				"id": "2",
  // 				"name": "Nicole"
  // 			}
  // 		}
  // 	]
  // }
  const [stateData, setData] = React.useState([]);
  const [,] = React.useState([]);
  React.useEffect(() => {
    const data2 = {
      status: 200,
      teams: [
        {
          type: "",
          sport_id: 1,
          name: "a",
        },
        {
          id: 2,
          sport_id: 1,
          name: "b",
        },
        {
          id: 3,
          sport_id: 1,
          name: "c",
        },
        {
          id: 4,
          sport_id: 1,
          name: "d",
        },
        {
          id: 5,
          sport_id: 2,
          name: "e",
        },
        {
          id: 6,
          sport_id: 2,
          name: "f",
        },
        {
          id: 7,
          sport_id: 2,
          name: "g",
        },
        {
          id: 8,
          sport_id: 2,
          name: "h",
        },
        {
          id: 9,
          sport_id: 2,
          name: "i",
        },
      ],
    };
    const teamsArray = data2.teams;
    const team = new schema.Entity("teams");
    const teams = new schema.Array(team);
    const normalizedata2 = normalize(teamsArray, teams);
    console.log(normalizedata2);
  }, []);

  React.useEffect(() => {
    const selectors = [
      {
        type: "text",
        id: 2,
        name: "a",
      },
      {
        type: "select",
        id: 1,
        name: "select",
      },
      {
        type: "text",
        id: 2,
        name: "b",
      },
      {
        type: "text",
        id: 3,
        name: "c",
      },
      {
        type: "textarea",
        id: 1,
        name: "area",
      },
    ];
    const selectSchema = new schema.Entity("select");
    const textSchema = new schema.Entity("text");
    const textareaSchema = new schema.Entity("textarea"); // ここがtypeの値になる
    const myArraySchema = new schema.Array(
      {
        select: selectSchema,
        text: textSchema,
        textarea: textareaSchema, // keyを間違えると生成されない
      },
      (input, parent, key) => {
        console.log("input", input, "parent", parent, "key", key);
        return input.type; // typeごとにschemaを作る場合
      }
    );
    const data3 = normalize(selectors, myArraySchema);
    console.log("data3", data3);
  }, []);
  React.useEffect(() => {
    async function f() {
      const res = await fetch(
        "https://jsondata.okiba.me/v1/json/oGB0G200510001819"
      );
      const data = await res.json();
      const user = new schema.Entity("user");
      const comments = new schema.Entity("comments", { commenter: user });
      const article = new schema.Entity("article", {
        author: user,
        comments: [comments],
      });
      const normalizeData = normalize(data, article);
      console.log(normalizeData);
      setData(data);
    }
    f();
  }, []);
  console.log(stateData);
  React.useEffect(() => {
    const cookie = document.cookie.split("_csrf=")[1];
    let unmounted = false;
    const f = async () => {
      const res = await client.get("/me");
      if (!unmounted) {
        setState({
          user: { isAuthenticated: false, cookie, id: "", email: "" },
        });
      }
      if (res.status === 200) {
        setState({
          user: {
            isAuthenticated: true,
            cookie,
            id: res.data.user.id,
            email: res.data.user.email,
          },
        });
      } else {
        setState({
          user: { isAuthenticated: false, cookie, id: "", email: "" },
        });
      }
    };
    f();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, []);

  const handleClickLogOut = React.useCallback(() => {
    let unmounted = false;
    const f = async () => {
      const res = await client.get("/auth/logout");
      if (!unmounted) {
      }
      if (res.status === 200) {
        window.location.reload();
        window.location.href = "/login";
        setState({
          user: { isAuthenticated: false, email: "", id: "", cookie: "" },
        });
      } else {
        console.log("失敗しました");
      }
    };
    f();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, []);
  return (
    <ErrorBoundary.default>
      <ReactRedux.Provider store={store}>
        <ConnectedRouter.ConnectedRouter history={history}>
          <ReactCookie.CookiesProvider>
            <StyledComponents.ThemeProvider theme={Theme.theme}>
              <>
                <GlobalStyle />
                <AppContext.default.Provider
                  value={{
                    applicationState: {
                      user: {
                        isAuthenticated: applicationState.user.isAuthenticated,
                        cookie: applicationState.user.cookie,
                        id: applicationState.user.id,
                        email: applicationState.user.email,
                      },
                    },
                  }}
                >
                  <Header.Component
                    isAuthenticated={applicationState.user.isAuthenticated}
                    handleClickLogOut={handleClickLogOut}
                  />
                  <Navigation.Component
                    handleOnClickLogOut={handleClickLogOut}
                    isAuthenticated={applicationState.user.isAuthenticated}
                  />
                  <ReactRouter.Switch>
                    <ReactRouter.Route
                      exact
                      render={(props) => <Top.Component {...props} />}
                      path={`/`}
                    />
                    <ReactRouter.Route
                      component={Login.Component}
                      exact
                      path="/login"
                    />
                    <ReactRouter.Route
                      component={Signup.Component}
                      exact
                      path="/signup"
                    />
                    <ReactRouter.Route
                      component={SignUpDone.Component}
                      exact
                      path="/signup/done/:token?"
                    />
                    <ReactRouter.Route
                      component={Terms.Component}
                      exact
                      path="/terms"
                    />
                    <ReactRouter.Route
                      component={ForgotPassword.Component}
                      exact
                      path="/forgotpassword"
                    />
                    <ReactRouter.Route
                      component={Faq.Component}
                      exact
                      path="/faq"
                    />
                    <ReactRouter.Route
                      component={PrivacyPolicy.Component}
                      exact
                      path="/privacypolicy"
                    />
                    <ReactRouter.Route
                      component={SiteMap.Component}
                      exact
                      path="/sitemap"
                    />
                    <ReactRouter.Route
                      component={AboutCompany.Component}
                      exact
                      path="/aboutcompany"
                    />
                    <ReactRouter.Route
                      component={ForgotPasswordDone.Component}
                      exact
                      path="/forgotpassword/done/:token?"
                    />
                    <ReactRouter.Route
                      component={MailAddressChange.Component}
                      exact
                      path={`/changemailaddress`}
                    />
                    <ReactRouter.Route
                      component={MailAddressChangeDone.Component}
                      exact
                      path="/changemailaddress/done/:token?"
                    />
                    {/* <Modules.ProtectedRoute
                      isAuthenticated={applicationState.user.isAuthenticated}
                      isAllowed={true}
                      restrictedPath="/login"
                      authenticationPath="/login"
                      component={Mypage.Component}
                      exact
                      path={`/mypage`}
                    /> */}
                    <ReactRouter.Route component={NotFound.Component} />
                  </ReactRouter.Switch>
                  <Footer />
                </AppContext.default.Provider>
              </>
            </StyledComponents.ThemeProvider>
          </ReactCookie.CookiesProvider>
        </ConnectedRouter.ConnectedRouter>
      </ReactRedux.Provider>
    </ErrorBoundary.default>
  );
};

export default Application;
