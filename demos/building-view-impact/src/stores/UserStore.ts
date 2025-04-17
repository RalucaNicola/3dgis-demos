/* Copyright 2025 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Accessor from "@arcgis/core/core/Accessor";
import {
  property,
  subclass,
} from "@arcgis/core/core/accessorSupport/decorators";
import IdentityManager from "@arcgis/core/identity/IdentityManager";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import Portal from "@arcgis/core/portal/Portal";
import PortalUser from "@arcgis/core/portal/PortalUser";

const info = new OAuthInfo({
  appId: "KojZjH6glligLidj",
  popup: false,
  // popupCallbackUrl: `${document.location.origin}${document.location.pathname}oauth-callback-api.html`,
});

IdentityManager.registerOAuthInfos([info]);

(window as any).setOAuthResponseHash = (responseHash: string) => {
  IdentityManager.setOAuthResponseHash(responseHash);
};

@subclass()
class UserStore extends Accessor {
  @property()
  get authenticated() {
    return !!this.user;
  }

  @property()
  user: PortalUser | nullish;

  constructor() {
    super();

    IdentityManager.on("credential-create", (e) => {
      const portal = new Portal();
      portal.authMode = "immediate";

      portal.load().then(() => {
        this.user = portal.user;
      });
    });
  }

  signIn() {
    IdentityManager.getCredential(info.portalUrl + "/sharing", {
      oAuthPopupConfirmation: false,
    });
  }

  signOut() {
    IdentityManager.destroyCredentials();
    this.user = null;
  }
}

export default UserStore;
