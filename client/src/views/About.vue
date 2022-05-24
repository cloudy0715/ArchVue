<template>
  <div class="about">
    <div class="container">
      <h3 class="text-gray">
        Architecture<b-icon icon="chevron-compact-right"></b-icon>
        <strong class="text-primary">AWS</strong>
      </h3>
      <hr />

      <!-- page-content -->
      <div class="d-flex justify-content-between py-3 mb-1">
        <h4 class="fw-bold">Imported Accounts</h4>
        <b-button variant="outline-secondary" v-b-modal.add-account
          ><b-icon icon="plus-square-dotted" class="mr-1"></b-icon> New
          Account</b-button
        >
        <!-- modal start -->
        <b-modal
          class="modal"
          id="add-account"
          size="xl"
          title="New AWS Account"
          ok-title="Submit"
          @show="resetModal"
          @hidden="resetModal"
          @ok="handleSubmit"
        >
          <h4>
            Follow these steps to import your Account in<br />
            ClouDay1 Architecture
          </h4>

          <!-- @submit="onSubmit"
            @reset="onReset" -->
          <b-form
            v-if="show"
            ref="formValid"
            class="d-flex justify-content-between"
            @submit="onSubmit"
          >
            <div class="content">
              <span class="fw-bold">1. Create a new IAM Role</span>
              <span class="description"
                >ClouDay1 Architecture can connect to AWS and import your
                account. You need a new or existing IAM user with at least the
                following permissions.</span
              >
              <b-card header="IAM Permissions" class="card">
                <b-card-text class="card-text">
                  <textarea
                    class="textarea"
                    name=""
                    id=""
                    v-model="policy"
                  ></textarea>
                  <!-- <pre class="m-0">{{ policy }}</pre> -->
                </b-card-text>
              </b-card>
            </div>
            <div class="content">
              <section>
                <span class="fw-bold"
                  >2. Authenticate ClouDay1 Architecture</span
                >
                <span class="description"
                  >Enter the access key credentials for your IAM user.</span
                >
                <b-card class="card" bg-variant="light">
                  <b-card-text class="card-text">
                    <b-form-group
                      label-cols="6"
                      label-cols-lg="4"
                      label-size="sm"
                      label="AWS Access Key"
                      label-for="access-key"
                      label-align="center"
                      :state="state"
                    >
                      <b-form-input
                        id="access-key"
                        v-model="form.aws_access_key_id"
                        placeholder="Enter Your Access Key"
                        size="sm"
                        :state="state"
                        required
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                      label-cols="6"
                      label-cols-lg="4"
                      label-size="sm"
                      label="AWS Secret key"
                      label-for="secret-key"
                      label-align="center"
                      :state="state"
                    >
                      <b-form-input
                        id="secret-key"
                        v-model="form.aws_secret_access_key"
                        placeholder="Enter Your Secret Key"
                        size="sm"
                        :state="state"
                        required
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                      label-cols="6"
                      label-cols-lg="4"
                      label-size="sm"
                      label="Session Token (Optional)"
                      label-for="input-sm"
                      label-align="center"
                    >
                      <b-form-input
                        id="input-sm"
                        v-model="form.aws_session_token"
                        placeholder="Enter Your Session Token"
                        size="sm"
                      ></b-form-input>
                    </b-form-group>
                    <!--  -->
                    <b-form-group
                      label-cols="6"
                      label-cols-lg="4"
                      label-size="sm"
                      label="Region"
                      label-for="input-sm"
                      label-align="center"
                      :state="state"
                    >
                      <multiselect
                        v-model="value"
                        :options="options"
                        :multiple="true"
                        group-values="regions"
                        group-label="all"
                        :group-select="true"
                        placeholder="Type to search"
                        track-by="region"
                        label="label"
                        :state="state"
                        required
                      >
                        <!-- eslint-disable -->
                        <template
                          slot="selection"
                          slot-scope="{ values, search, isOpen }"
                          ><span
                            class="multiselect__single"
                            v-if="values.length &amp;&amp; !isOpen"
                            >{{ values.length }} options selected</span
                          ></template
                        >
                        <!-- eslint-enable -->
                      </multiselect>
                    </b-form-group>
                    <!-- <label class="typo__label">Simple select / dropdown</label> -->

                    <!-- <div
                    class="language-json"
                    v-for="(val, index) in value"
                    :key="val"
                  >
                    {{ val.region }}{{ index }}
                  </div> -->
                    <div>
                      <pre>{{ form }}</pre>
                    </div>

                    <!--  -->
                  </b-card-text>
                </b-card>
              </section>
              <section>
                <span class="fw-bold" style="display: inline"
                  >3. Import Summary</span
                >
                <span class="description" style="display: inline"
                  >Architecture to import</span
                >
                <b-card class="card" bg-variant="light">
                  <b-card-text class="card-text">
                    <b-form-group
                      label-cols="6"
                      label-cols-lg="4"
                      label-size="sm"
                      label="Architecture Name"
                      label-for="arch-name"
                      label-align="center"
                      :state="state"
                    >
                      <b-form-input
                        id="arch-name"
                        v-model="form.account_name"
                        placeholder="Enter Your Architecture Name"
                        size="sm"
                        :state="state"
                        required
                      ></b-form-input>
                    </b-form-group>
                  </b-card-text>
                </b-card>
              </section>
            </div>
          </b-form>
        </b-modal>
        <!-- modal end -->
      </div>

      <b-container fluid>
        <!-- User Interface controls -->
        <b-row class="justify-content-between">
          <b-col lg="4" class="my-1">
            <b-form-group class="mb-0">
              <b-input-group size="sm">
                <b-input-group-prepend is-text class="align-items-stretch">
                  <b-icon icon="search"></b-icon>
                </b-input-group-prepend>
                <b-form-input
                  id="filter-input"
                  v-model="filter"
                  type="search"
                  placeholder="Type to Search"
                >
                </b-form-input>

                <b-input-group-append>
                  <b-button :disabled="!filter" @click="filter = ''"
                    >Clear</b-button
                  >
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>

          <b-col sm="5" md="4" class="my-1">
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
          </b-col>
        </b-row>

        <!-- Main table element -->
        <b-table
          :items="accountData"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          stacked="md"
          :busy="isBusy"
          show-empty
          @filtered="onFiltered"
        >
          <template #empty>
            <div class="text-center my-3">
              <b-spinner variant="primary" label="Spinning"></b-spinner>
            </div>
          </template>
          <template #cell(actions)="row">
            <div class="d-flex align-items-center justify-content-evenly">
              <b-icon
                icon="arrow-repeat"
                class="repeat-icon"
                @click="updateArch(row.item, row.item.requestID)"
              ></b-icon>
              <b-icon
                icon="box-arrow-up-right"
                class="openArch-icon"
                @click="openArch(row.item)"
              ></b-icon>
              <b-icon
                icon="trash"
                class="delete-icon"
                @click="deleteArch(row.index, row.item.requestID)"
              ></b-icon>
            </div>
          </template>

          <!-- <template #row-details="row">
            <b-card>
              <ul>
                <li v-for="(value, key) in row.item" :key="key">
                  {{ key }}: {{ value }}
                </li>
              </ul>
            </b-card>
          </template> -->
        </b-table>
      </b-container>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import axios from "axios";

export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      form: {
        // AccessKey: "",
        // SecretKey: "",
        // SessionToken: "",
        // Region: [],
        // UserID: "",
        // AccountName: "",
        user_id: "12345",
      },
      isBusy: true,
      accountData: [],
      fields: [
        {
          key: "account_name",
          label: "Architecture Name",
          sortable: true,
          stickyColumn: true,
          class: "text-center",
        },
        {
          key: "account_id",
          label: "Account ID",
          sortable: true,
          class: "text-center",
        },
        {
          key: "timestamp",
          label: "Last updated",
          sortable: true,
          class: "text-center",
        },
        { key: "actions", label: "" },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 6,
      filter: null,
      //
      show: true,
      state: null,
      policy: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: [
              "apigateway:GET",
              "autoscaling:DescribeAutoScalingGroups",
              "autoscaling:DescribeLaunchConfigurations",
              "cloudfront:ListDistributions",
              "cloudfront:ListTagsForResource",
              "cloudtrail:DescribeTrails",
              "cloudtrail:ListTags",
              "cloudtrail:ListTrails",
              "dynamodb:DescribeTable",
              "dynamodb:ListTables",
              "dynamodb:ListTagsOfResource",
              "ec2:DescribeCustomerGateways",
              "ec2:DescribeInstances",
              "ec2:DescribeInternetGateways",
              "ec2:DescribeNatGateways",
              "ec2:DescribeNetworkAcls",
              "ec2:DescribeNetworkInterfaces",
              "ec2:DescribeRouteTables",
              "ec2:DescribeSecurityGroups",
              "ec2:DescribeSubnets",
              "ec2:DescribeTransitGateways",
              "ec2:DescribeTransitGatewayAttachments",
              "ec2:DescribeTransitGatewayRouteTables",
              "ec2:DescribeVolumes",
              "ec2:DescribeVpcs",
              "ec2:DescribeVpcEndpoints",
              "ec2:DescribeVpcEndpointConnections",
              "ec2:DescribeVpnConnections",
              "ec2:DescribeVpnGateways",
              "ec2:DescribeVpcPeeringConnections",
              "ec2:SearchTransitGatewayRoutes",
              "ecs:DescribeClusters",
              "ecs:DescribeServices",
              "ecs:DescribeTasks",
              "ecs:ListClusters",
              "ecs:ListServices",
              "ecs:ListTasks",
              "eks:DescribeCluster",
              "eks:ListClusters",
              "elasticfilesystem:DescribeFileSystems",
              "elasticache:DescribeCacheClusters",
              "elasticache:DescribeCacheSubnetGroups",
              "elasticloadbalancing:DescribeLoadBalancers",
              "elasticloadbalancing:DescribeTags",
              "elasticloadbalancing:DescribeTargetGroups",
              "elasticloadbalancing:DescribeTargetHealth",
              "emr:DescribeClusters",
              "emr:ListClusters",
              "es:DescribeElasticsearchDomains",
              "es:ListDomainNames",
              "es:ListTags",
              "firehose:DescribeDeliveryStream",
              "firehose:ListDeliveryStreams",
              "firehose:ListTagsForDeliveryStream",
              "glacier:DescribeVault",
              "glacier:ListVaults",
              "iam:ListAccountAliases",
              "kinesis:DescribeStream",
              "kinesis:ListShards",
              "kinesis:ListStreams",
              "kinesis:ListTagsForStream",
              "lambda:ListFunctions",
              "lambda:ListTags",
              "network-firewall:ListFirewalls",
              "network-firewall:DescribeFirewall",
              "redshift:DescribeClusters",
              "rds:DescribeDBClusters",
              "rds:DescribeDBInstances",
              "rds:ListTagsForResource",
              "route53:ListHostedZones",
              "route53:ListResourceRecordSets",
              "route53:ListTagsForResource",
              "s3:GetBucketLocation",
              "s3:GetBucketNotification",
              "s3:GetBucketPolicyStatus",
              "s3:GetBucketTagging",
              "s3:GetEncryptionConfiguration",
              "s3:ListAllMyBuckets",
              "sns:GetTopicAttributes",
              "sns:ListTopics",
              "sns:ListTagsForResource",
              "sqs:GetQueueAttributes",
              "sqs:ListQueues",
              "sqs:ListQueueTags",
              "states:DescribeActivity",
              "states:ListActivities",
              "states:DescribeStateMachine",
              "states:ListStateMachines",
              "states:ListTagsForResource",
              "sts:GetCallerIdentity",
            ],
            Resource: ["*"],
          },
        ],
      },
      //
      value: [],
      options: [
        {
          all: "Select All",
          regions: [
            { region: "us-east-2", label: "us-east-2 (Ohio)" },
            { region: "us-west-2", label: "us-west-2 (Oregon)" },
          ],
        },
      ],
    };
  },
  watch: {
    value: function () {
      const region = [];
      this.value.forEach(function (item) {
        region.push(item.region);
      });
      this.form.region = region;
    },
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    updateArch(item, requestID) {
          console.log(item);
      axios
        .post("http://44.237.111.172/update", { requestID: requestID})
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openArch(item) {
      //開啟新視窗並傳參，引數不能顯示在位址列裡面，不關閉視窗一直重新整理，引數一直有效
      //主要實現開啟新視窗的功能
      const route = this.$router.resolve({
        name: "arch",
      });
      const params = {
        requestID: item.requestID,
        archName: item.account_name,
      };
      //主要實現儲存引數的功能
      sessionStorage.setItem("item", JSON.stringify(params));
      window.open(route.href, "_blank");
    },
    deleteArch(index, requestID) {
      try {
        // this.loading = true
        axios
          .delete(
            "https://hj47l47uptaqggfccy7jfoqqqy0apktb.lambda-url.us-west-2.on.aws/",
            { params: { requestid: requestID } }
          )
          .then((res) => {
            if (res.data.message == "Successfully deleted") {
              this.accountData.splice(index, 1);
              console.log(requestID, res.data);
            } else {
              alert("Try again.");
            }
          })
          .catch((err) => {
            alert("Try again.");

            console.log(err);
          });
      } catch (e) {
        this.errors.push(e);
      }
    },
    checkFormValidity() {
      const valid = this.$refs.formValid.checkValidity();
      this.state = valid;
      return valid;
    },
    handleSubmit(bvModalEvent) {
      // Prevent modal from closing
      bvModalEvent.preventDefault();
      // this.form.Region = []
      this.form.user_id = "12345";
      console.log(this.form.region.length);
      // Trigger submit handler
      this.onSubmit();
    },
    resetModal() {
      this.form = {
        region: [],
        aws_session_token: "",
        user_id: "12345",
      };
      this.state = null;
    },
    onSubmit() {
      if (!this.checkFormValidity()) {
        return;
      } else if (this.form.region.length == 0) {
        alert("Please select region.");
        return;
      }
      axios
        .post("http://44.237.111.172/newPost", this.form, {})
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      alert(JSON.stringify(this.form));
      // Hide the modal manually
      this.$nextTick(() => {
        this.value = [];
        this.$bvModal.hide("add-account");
      });
    },
  },
  mounted() {
    const ddbURL =
      "https://esrcf3ow2g7pkghwqstdk3z4hy0egoay.lambda-url.us-west-2.on.aws/";
    const user = { user_id: this.form.user_id };
    try {
      // this.loading = true
      axios
        .get(ddbURL, { params: { user_id: "12345" } })
        .then((res) => {
          this.accountData = JSON.parse(res.data.message);
          // Set the initial number of items
          this.totalRows = this.accountData.length;
          this.isBusy = false;
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      this.errors.push(e);
    }
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss" scoped>

.org-description {
  margin-top: 50px;
}

hr {
  border: 1px solid #e5e5e557;
  border-radius: 5px;
}

.text-primary {
  color: #202020 !important;
}

.description {
  font-size: 14px;
  color: #5e5e5e;
  margin-left: 8px;
}

.content {
  padding: 0 8px;
  width: 50%;
  span {
    display: block;
  }
}

.card {
  width: 95%;
  margin: 8px;
  .card-text .textarea {
    min-height: 200px;
    font-family: "Lucida Console", Monaco, monospace;
    font-size: 0.8rem;
    color: #333;
    line-height: 1.2;
    overflow-y: scroll;
    resize: none;
  }
}

.container .table td .b-icon {
  margin: 0 8px;
  font-size: 20px;
  &.openArch-icon {
    font-size: 18px;
  }
}

section .card-body {
  padding: 1rem 1.25rem 0;
}
</style>
