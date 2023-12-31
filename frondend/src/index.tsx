import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route } from "react-router";
import { BrowserRouter, Navigate } from "react-router-dom";
import ForgotPasswordPage from "./pages/authentication/forgot-password";
import ProfileLockPage from "./pages/authentication/profile-lock";
import ResetPasswordPage from "./pages/authentication/reset-password";
import SignInPage from "./pages/authentication/sign-in";
import SignUpPage from "./pages/authentication/sign-up";
import EcommerceBillingPage from "./pages/e-commerce/billing";
import EcommerceInvoicePage from "./pages/e-commerce/invoice";
import EcommerceProductsPage from "./pages/e-commerce/products";
import KanbanPage from "./pages/kanban";
import NotFoundPage from "./pages/pages/404";
import ServerErrorPage from "./pages/pages/500";
import MaintenancePage from "./pages/pages/maintenance";
import PricingPage from "./pages/pages/pricing";
import UserFeedPage from "./pages/users/feed";
import UserListPage from "./pages/users/list";
import UserProfilePage from "./pages/users/profile";
import UserSettingsPage from "./pages/users/settings";
import MailingInboxPage from "./pages/mailing/inbox";
import MailingReadPage from "./pages/mailing/read";
import MailingReplyPage from "./pages/mailing/reply";
import MailingComposePage from "./pages/mailing/compose";
import ApiKeysPage from "./pages/api-keys";
import ConnectionsPage from "./pages/connections";
import GoogleDriveConnectorPage from "./pages/connectors/google-drive";
import WebsiteConnectorPage from "./pages/connectors/website";
import { UserStateProvider } from "./context/UserStateContext";
import ZendeskConnectorPage from "./pages/connectors/zendesk";
import ConfluenceConnectorPage from "./pages/connectors/confluence";
import NotionConnectorPage from "./pages/connectors/notion";
import VectorstorePage from "./pages/vectorstore";
import StripeConnectorPage from "./pages/connectors/stripe";
import QueryPage from "./pages/query";
import UserTokenCostPage from "./pages/solana/token-cost";
import AirDropPage from "./pages/solana/airdrop";
import UserWalletSettingsPage from  "./pages/solana/wallet_settings";
import WalletContextProvider from "./components/WalletContextProvider"
import { useWalletState } from "./components/WalletContextProvider"
import { useNavigate } from 'react-router-dom';


const container = document.getElementById("root");

if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}



if (!container) {
  throw new Error("React root element doesn't exist!");
}

function requireAuth(toState, fromState, done) {
  const { isWalletConnected } = useWalletState();

  if (!isWalletConnected) {
    done({ redirectTo: "/authentication/sign-in" });
  } else {
    done();
  }
}
function ProtectedRoute({ children }) {
  const { isWalletConnected } = useWalletState();
  const navigate = useNavigate();
  console.log("isWalletConnected",isWalletConnected)
  if (!isWalletConnected) {
    navigate("/authentication/sign-in");
    // return null;
    // <Navigate to="/authentication/sign-in" />;
  }
  return children;
}
 
const root = createRoot(container);
root.render(
  <StrictMode>
    <WalletContextProvider>
      <Flowbite theme={{ theme }}>
          <BrowserRouter>
           <UserStateProvider>

            <Routes>
              <Route path="/" element={<ApiKeysPage />} index />
              {/* <Route path="/" element={<ApiKeysPage />} onEnter={requireAuth} /> */}
              {/* <Route path="/" element={
                <ProtectedRoute>
                  <ApiKeysPage />
                </ProtectedRoute>
              } /> */}
              <Route path="/mailing/compose" element={<MailingComposePage />} />
              <Route path="/mailing/inbox" element={<MailingInboxPage />} />
              <Route path="/mailing/read" element={<MailingReadPage />} />
              <Route path="/mailing/reply" element={<MailingReplyPage />} />
              <Route path="/kanban" element={<KanbanPage />} />
              <Route path="/pages/pricing" element={<PricingPage />} />
              <Route path="/pages/maintenance" element={<MaintenancePage />} />
              <Route path="/pages/404" element={<NotFoundPage />} />
              <Route path="/pages/500" element={<ServerErrorPage />} />
              <Route path="/authentication/sign-in" element={<SignInPage />} />
              <Route path="/authentication/sign-up" element={<SignUpPage />} />
              <Route
                path="/authentication/forgot-password"
                element={<ForgotPasswordPage />}
              />
              <Route
                path="/authentication/reset-password"
                element={<ResetPasswordPage />}
              />
              <Route
                path="/authentication/profile-lock"
                element={<ProfileLockPage />}
              />
              <Route
                path="/e-commerce/billing"
                element={<EcommerceBillingPage />}
              />
              <Route
                path="/e-commerce/invoice"
                element={<EcommerceInvoicePage />}
              />
              <Route
                path="/e-commerce/products"
                element={<EcommerceProductsPage />}
              />
              <Route path="/users/feed" element={<UserFeedPage />} />
              <Route path="/users/list" element={<UserListPage />} />
              <Route path="/users/profile" element={<UserProfilePage />} />
              <Route path="/users/settings" element={<UserSettingsPage />} />
              <Route path="/api-keys" element={<ApiKeysPage />} />
              <Route path="/connections" element={<ConnectionsPage />} />
              <Route path="/connectors/google-drive" element={<GoogleDriveConnectorPage />} />
              <Route path="/connectors/zendesk" element={<ZendeskConnectorPage />} />
              <Route path="/connectors/confluence" element={<ConfluenceConnectorPage />} />
              <Route path="/connectors/notion" element={<NotionConnectorPage />} />
              <Route path="/connectors/website" element={<WebsiteConnectorPage />} />
              <Route path="/connectors/stripe" element={<StripeConnectorPage />} />
              <Route path="/vectorstore" element={<VectorstorePage />} />
              <Route path="/query" element={<QueryPage />} />
              <Route path="/airdrop" element={<AirDropPage />} />
              <Route path="/token-cost" element={<UserTokenCostPage />} />
              <Route path="/wallet-settings" element={<UserWalletSettingsPage />} />

            </Routes>
            </UserStateProvider>
          </BrowserRouter>
      </Flowbite>
    </WalletContextProvider>

  </StrictMode>
);
