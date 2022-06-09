import { Construct } from "constructs";
import { App, RemoteBackend, TerraformStack } from "cdktf";
import * as n from "@cdktf/provider-null";
import * as r from "@cdktf/provider-random";

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new n.NullProvider(this, "null");
    new r.RandomProvider(this, "random");

    const pet = new r.Pet(this, "my-pet");
    const resource = new n.Resource(this, "hello-world");
    resource.addOverride("provisioner", [
      {
        "local-exec": {
          command: `echo 'Hello ${pet}'`,
        },
      },
    ]);

    const pet2 = new r.Pet(this, "my-pet2");
    const resource2 = new n.Resource(this, "hello-world2");
    resource2.addOverride("provisioner", [
      {
        "local-exec": {
          command: `echo 'Hello ${pet2}'`,
        },
      },
    ]);
  }
}

const app = new App();
const stack = new MyStack(app, "cdktf-github-actions-terraform-cloud");
new RemoteBackend(stack, {
  organization: "cdktf-team",
  workspaces: {
    name: "cdktf-github-actions-terraform-cloud",
  },
});
app.synth();
