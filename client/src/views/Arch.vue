<template>
  <div id="box">
    <main :class="{ active: isLeftSidebarOpen }">
      <div class="d-flex">
        <b-dropdown
          id="dropdown-form"
          ref="dropdown"
          variant="info"
          class="m-2"
        >
          <template #button-content>
            <b-icon icon="filter-circle-fill" class="mr-1"></b-icon
            ><span> Filter</span>
          </template>
          <b-dropdown-form class="filter-panel">
            <div class="d-flex justify-content-between">
              <small>Add an item to start your diagram.</small>
              <b-icon
                icon="trash"
                class="delete-icon"
                id="resetFilter"
              ></b-icon>
            </div>
            <b-dropdown-divider></b-dropdown-divider>
            <div class="d-flex">
              <b-form-select
                v-model="filterType"
                :options="filterOptions"
              ></b-form-select>
              <b-form-select
                v-model="filterResult"
                :options="filterVal"
              ></b-form-select>
              <b-button variant="success" @click="onClick" id="filterApply"
                >Apply</b-button
              >
            </div>
          </b-dropdown-form>
        </b-dropdown>
        <!-- <div class="mt-2">
          <b-button v-b-modal.modal-1
            ><b-icon icon="search"></b-icon> Cost</b-button
          >
          <b-modal id="modal-1" title="Cost">
            <DoughnutChart />
          </b-modal>
        </div> -->
        <div>
          <b-dropdown id="dropdown-structure" text="Structure" class="m-2">
            <div>
              <b-form-group v-slot="{ ariaDescribedby }">
                <b-form-checkbox-group
                  v-model="structureSelected"
                  :options="structureOpt"
                  :aria-describedby="ariaDescribedby"
                  plain
                  stacked
                ></b-form-checkbox-group>
              </b-form-group>
            </div>
            <b-dropdown-divider></b-dropdown-divider>
            <b-button
              variant="primary"
              size="sm"
              id="onStructure"
              @click="onStructure"
              >Check</b-button
            >
          </b-dropdown>
        </div>
        <!-- <b-button id="testStru">test</b-button> -->
        <!-- <b-button id="testMutiFilter">Test</b-button> -->
        <b-button id="testMuti">Test</b-button>
      </div>
      <div class="mt-2 filter-result">
        <p v-show="showFilterResult">
          {{ filterTypeText }} : {{ filterValText }}
        </p>
      </div>
      <!-- <button @click="test">test</button> -->
      <!-- <button id="test">test</button> -->

      <div class="loading" v-if="loading">Loading...</div>
      <div id="cy" v-else></div>
      <!-- <div v-for="(value, key) in nodes" :key="key">
      <span>{{ value.data }}--{{ key }}</span>
    </div> -->
    </main>
    <b-sidebar
      id="rightSidebar"
      class="rightSidebar-menu"
      shadow
      v-model="isRightSidebarOpen"
      right
      width="30%"
    >
      <div class="px-3 py-2">
        <!-- <ul id="sidebar-menu">
          <li v-for="(value, index) in newTargetObj" :key="value.id" >
              {{ index }}: {{ value }} 
          </li>
        </ul> -->
        <json-tree :data="newTargetObj"></json-tree>
      </div>
    </b-sidebar>
    <div class="close-sidebar" v-show="!isLeftSidebarOpen">
      <b-button v-b-toggle.leftSidebar
        ><b-icon icon="layout-sidebar-inset"></b-icon
      ></b-button>
    </div>
    <b-sidebar
      id="leftSidebar"
      class="leftSidebar-menu"
      width="250px"
      shadow
      v-model="isLeftSidebarOpen"
      bg-variant="dark"
      text-variant="light"
    >
      <div class="px-3 py-2">
        <div>
          <h3 class="py-2 sidebar-title">{{ archName }}</h3>
          <p class="fw-bold">Accounts</p>
          <ul class="px-2">
            <li v-for="result in ResourceAccountID" :key="result">
              {{ result }}
            </li>
          </ul>
        </div>
        <hr />
        <div>
          <p class="fw-bold">Imported Regions</p>
          <ul class="px-2">
            <li v-for="result in ResourceRegionResult" :key="result">
              {{ result }}
            </li>
          </ul>
        </div>
        <hr />
        <div class="py-2">
          <p class="fw-bold">Included resource types</p>
          <ul class="px-2">
            <li v-for="result in ResourceTypeResult" :key="result">
              {{ result }}
            </li>
          </ul>
        </div>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import cytoscape from "cytoscape";
import axios from "axios";
import JsonTree from "vue-json-tree";
import Multiselect from "vue-multiselect";
import "cytoscape-navigator/cytoscape.js-navigator.css";
import DoughnutChart from "@/components/chart.vue";

var navigator = require("cytoscape-navigator");

navigator(cytoscape); // register extension
/*eslint-disable*/

export default {
  name: "cytoscape",
  components: {
    JsonTree,
    DoughnutChart,
    // Multiselect
  },
  data() {
    return {
      nodes: [],
      edges: [],
      requestID: "",
      archName: "",
      showFilterResult: false,
      loading: false,
      structureSelected: [],
      structureOpt: [
        { text: "Account", value: "account_id" },
        { text: "Region", value: "region" },
        { text: "Application", value: "tag.Application" },
        { text: "Department", value: "tag.Department" },
        { text: "Environment", value: "tag.Environment" },
        { text: "Owner", value: "tag.Owner" },
        { text: "Project", value: "tag.Project" },
      ],
      newTargetObj: {},
      filterOpt: ["id", "url", "parent", "type"],
      isRightSidebarOpen: false,
      isLeftSidebarOpen: true,
      ResourceTypeResult: [],
      ResourceRegionResult: [],
      ResourceAccountID: [],
      ResourceTag: [],
      filterOptions: [
        { value: null, text: "Attribute name", disabled: true },
        { value: "account_id", text: "Account" },
        { value: "region", text: "Region" },
        {
          label: "Tag",
          options: [
            { value: "tag.Application", text: "Application" },
            { value: "tag.Department", text: "Department" },
            { value: "tag.Environment", text: "Environment" },
            { value: "tag.Owner", text: "Owner" },
            { value: "tag.Project", text: "Project" },
          ],
        },
      ],
      filterType: null,
      filterVal: null,
      filterTypeText: null,
      filterValText: null,
      filterResult: "",
      tag: {
        Application: [
          "Processing",
          "web",
          "Database",
          "database",
          "processing",
        ],
        Department: ["Intership"],
        Environment: ["Prod", "Pre-Prod"],
        Owner: ["Front-end", "Back-end", "DBA"],
        Project: ["Clouday1", "Architecture"],
      },
      cyElements: null,
    };
  },
  watch: {
    filterType: function () {
      this.filterResult = null;
      // console.log("test");
      switch (this.filterType) {
        case "region":
          this.filterVal = this.ResourceRegionResult;
          break;
        case "account_id":
          this.filterVal = this.ResourceAccountID;
          break;
        case "tag.Application":
          this.filterVal = this.tag.Application;
          break;
        case "tag.Department":
          this.filterVal = this.tag.Department;
          break;
        case "tag.Environment":
          this.filterVal = this.tag.Environment;
          break;
        case "tag.Owner":
          this.filterVal = this.tag.Owner;
          break;
        case "tag.Project":
          this.filterVal = this.tag.Project;
          break;
      }
    },
  },
  methods: {
    onClick() {
      // Close the menu and (by passing true) return focus to the toggle button
      this.filterTypeText = this.filterType;
      this.filterValText = this.filterResult;
      this.$refs.dropdown.hide(true);
    },
    onStructure() {},
    ListIncludeResourceType() {
      var set = [];
      for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].data.type) {
          set.push(this.nodes[i].data.type);
        }
      }
      this.ResourceTypeResult = [...new Set(set)];
    },
    ListIncludeResourceRegion() {
      var set = [];
      for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].data.region) {
          set.push(this.nodes[i].data.region);
        }
      }
      this.ResourceRegionResult = [...new Set(set)];
    },
    ListIncludeAccountID() {
      var set = [];
      for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].data.account_id) {
          set.push(this.nodes[i].data.account_id);
        }
      }
      this.ResourceAccountID = [...new Set(set)];
    },
    ListIncludeTag() {
      var set = [];
      for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].data.tag) {
          set.push(this.nodes[i].data.tag);
        }
      }
      this.ResourceTag = [...new Set(set)];
      // console.log(this.ResourceTag);
    },
    Addimg() {
      const img = [
        {
          title: "DynamoDB",
          url: "https://audio-json.s3.us-west-2.amazonaws.com/img/Arch_Amazon-DynamoDB_32.png",
        },
        {
          title: "Transcribe",
          url: "https://audio-json.s3.us-west-2.amazonaws.com/img/Arch_Amazon-Transcribe_32.png",
        },
        {
          title: "Translate",
          url: "https://audio-json.s3.us-west-2.amazonaws.com/img/Arch_Amazon-Translate_32.png",
        },
        {
          title: "Lambda",
          url: "https://audio-json.s3.us-west-2.amazonaws.com/img/Arch_AWS-Lambda_32.png",
        },
        {
          title: "Step-Functions",
          url: "https://audio-json.s3.us-west-2.amazonaws.com/img/Arch_AWS-Step-Functions_32.png",
        },
        {
          title: "S3",
          url: "https://audio-json.s3.us-west-2.amazonaws.com/img/Arch_AWS-Simple-Storage-Service_S3-Standard_48_Light.png",
        },
        {
          title: "SNS",
          url: "https://audio-json.s3.us-west-2.amazonaws.com/img/Amazon-Simple-Notification-Service-SNS.png",
        },
        {
          title: "API Gateway",
          url: "https://audio-json.s3.us-west-2.amazonaws.com/img/Arch_Amazon-API-Gateway_32.png",
        },
        {
          title: "Cognito",
          url: "https://audio-json.s3.us-west-2.amazonaws.com/img/Arch_Amazon-Cognito_32.png",
        },
        {
          title: "Account",
          url: "https://audio-json.s3.us-west-2.amazonaws.com/img/AWS-Cloud-Account_light-bg.png",
        },
      ];
      for (var i = 0; i < this.nodes.length; i++) {
        for (var j = 0; j < img.length; j++) {
          if (img[j].title.indexOf(this.nodes[i].data.type) != -1) {
            this.nodes[i].data.url = img[j].url;
            // console.log(dataset.nodes[i].data)
          }
        }
      }
    },
    createCytoscape(_this) {
      cytoscape.warnings(false);
      // cytoscape({
      var layout = {
        name: "dagre",
        avoidOverlap: true,
        // dagre algo options, uses default value on undefined
        nodeSep: 50, // the separation between adjacent nodes in the same rank
        edgeSep: undefined, // the separation between adjacent edges in the same rank
        rankSep: undefined, // the separation between each rank in the layout
        rankDir: "LR", // 'TB' for top to bottom flow, 'LR' for left to right,
        align: "UR", // alignment for rank nodes. Can be 'UL', 'UR', 'DL', or 'DR', where U = up, D = down, L = left, and R = right
        acyclicer: undefined, // If set to 'greedy', uses a greedy heuristic for finding a feedback arc set for a graph.
        // A feedback arc set is a set of edges that can be removed to make a graph acyclic.
        ranker: undefined, // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
        minLen: function (edge) {
          return 3;
        }, // number of ranks to keep between the source and target of the edge
        edgeWeight: function (edge) {
          return 3;
        }, // higher weight edges are generally made shorter and straighter than lower weight edges
        // general layout options
        fit: true, // whether to fit to viewport
        padding: 10, // fit padding
        spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
        nodeDimensionsIncludeLabels: true, // whether labels should be included in determining the space used by a node
        animate: true, // whether to transition the node positions
        animateFilter: function (node, i) {
          return true;
        }, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        transform: function (node, pos) {
          return pos;
        }, // a function that applies a transform to the final node position

        stop: function () {}, // on layoutstop
      };
      var cy = cytoscape({
        container: document.getElementById("cy"),
        // boxSelectionEnabled: false,
        // userZoomingEnabled: false, //滚轮缩放
        // wheelSensitivity: 0.1,
        // autounselectify: false,
        // autoungrabify: true,
        // minZoom: 0.3,

        boxSelectionEnabled: false,
        autounselectify: true,

        elements: {
          nodes: this.nodes,
          edges: this.edges,
        },

        layout: layout,

        style: [
          {
            selector: "node",
            style: {
              content: function (node) {
                const type =
                  node.data("type")[0].toUpperCase() +
                  node.data("type").slice(1);
                return node.data("label") == "parent"
                  ? `${type} (${node.data("id")})`
                  : node.data("name")
                  ? `${node.data("name")}`
                  : `${node.data("id")}`;
              },
              "text-valign": "top",
              "text-halign": "center",
              "text-margin-y": -6,
              // 'text-margin-x': -25,
              "font-size": 18,
              "text-wrap": "wrap",
              "text-rotation": "autorotate",
              "background-image": "data(url)",
              shape: "rectangle",
              "background-fit": "cover",
              height: "50px",
              width: "50px",
            },
          },
          {
            selector: ":parent",
            style: {
              // width: 4,
              shape: "roundrectangle",
              "border-width": "5px",
              "border-radius": "20%",
              "text-valign": "top",
              "text-halign": "left",
              "background-color": "#fff",
              // "border-color": "#be0e8d",
              "border-color": function (node) {
                const type = node.data("type");
                return type == "account_id"
                  ? "#000"
                  : type == "region"
                  ? "#11789a"
                  : type == "structure"
                  ? "green"
                  : type.includes("tag.")
                  ? "#f1860b"
                  : "#be0e8d";
              },
              "text-margin-x": 20,
              "text-margin-y": -15,
              "font-size": "22px",
              "font-weight": 700,
              padding: "35px",
              content: function (node) {
                const type = node.data("type");
                const id = node.data("id");
                return type == "account_id"
                  ? `Account (${id})`
                  : type == "region"
                  ? `Region (${id})`
                  : type == "structure"
                  ? `${id}`
                  : node.data("id") == "Clouday1"
                  ? `${id} ( $20.7 USD/month )`
                  : node.data("id") == "Architecture"
                  ? `${id} ( $17.87 USD/month )`
                  : type.includes("tag")
                  ? `${type} ${id} `
                  : node.data("name");
              },
              "background-position-x": "0",
              "background-position-y": "0",
              "background-fit": "none",
            },
          },
          {
            selector: ".hidden",
            css: {
              display: "none",
            },
          },
          {
            selector: ":selected",
            style: {
              "background-color": "#adadad",
              "line-color": "#adadad",
              "target-arrow-color": "#adadad",
              "source-arrow-color": "#adadad",
              "border-color": "#adadad",
              "border-width": "3px",
            },
          },
          {
            selector: "edge",
            style: {
              width: 2,
              "target-arrow-shape": "triangle",
              // 'source-arrow-shape': 'triangle',
              "line-color": "#adadad",
              "target-arrow-color": "#adadad",
              "curve-style": "straight",
            },
          },
          {
            selector: "node.highlight",
            style: {
              "border-color": "rgb(96, 178, 240)",
              "border-width": "4px",
              opacity: "1",
              // height: "52px",
              // width: "52px",
            },
          },
          {
            selector: "node.clickstyle",
            style: {
              "border-color": "rgb(96, 178, 240)",
              "border-width": "4px",
              // height: "52px",
              // width: "52px",
            },
          },
          {
            selector: "node.notfilter",
            style: {
              // opacity: "0.5",
              color: "red",
            },
          },
          {
            selector: "node.fitfilter",
            style: {
              width: "60px",
              height: "60px",
            },
          },
          {
            selector: "node.semitransp",
            style: { opacity: "0.5" },
          },
          {
            selector: "edge.highlight",
            style: {
              width: 5,
              "mid-target-arrow-color": "#FFF",
              "line-color": "rgb(96, 178, 240)",
              "target-arrow-color": "rgb(96, 178, 240)",
            },
          },
          {
            selector: "edge.clickstyle",
            style: {
              width: 5,
              "mid-target-arrow-color": "#FFF",
              "line-color": "rgb(96, 178, 240)",
              "target-arrow-color": "rgb(96, 178, 240)",
            },
          },
          {
            selector: "edge.semitransp",
            style: {
              opacity: "0.5",
            },
          },
        ],
        ready: function () {
          cy = this;
          cy.filter("node[label = 'parent']").data("isShow", false);
          // cy.nodes().move({
          //   parent: "Back-end"
          // })
          cy.filter("node[label = 'parent'][!isShow]").addClass("hidden");

          // cy.nodes("[id = 'Processing']").removeClass("hidden")
        },
      });

      const clone = cy.elements();

      $("#testStru").click(function () {
        let collection = cy.collection();
        cy.add([
          {
            data: {
              type: "tag.Application",
              id: "Processing",
              label: "parent",
            },
          },
          {
            data: {
              type: "tag.Application",
              id: "web",
              label: "parent",
            },
          },
        ]);
        // test-start
        if (_this.filterTypeText == null) {
          cy.nodes().map(function (ele) {
            ["Processing", "web"].forEach((value) => {
              if (ele.data(`tag.Application`) == value) {
                collection = ele.union(ele.successors());
                // collection.filter("node[^parent]").move({
                //     parent: value
                //   });
                if (ele.parent().isOrphan() || ele.nodes("[^parent]")) {
                  collection.filter("node[^parent]").move({
                    parent: value,
                  });
                  // console.log(
                  //   "if",
                  //   ele.data("name"),
                  //   ele.data("parent"),
                  //   ele.filter("node[^parent]")
                  // );
                }
                // else if (ele.filter("node[?parent]")) {
                //   collection = ele.parent().union(ele.successors());
                //   ele.nodes(`[id = ${value}]`).move({
                //     parent: ele.parent().parent().id(),
                //   });
                //   collection.move({
                //     parent: value,
                //   });
                //   console.log(
                //     ele.data("name"),
                //     ele.data("parent"),
                //     ele.parent().parent().id()
                //   );
                // }
                collection
                  .difference(
                    collection.filter(`node[tag.Application ='${value}']`)
                  )
                  .addClass("notfilter");
              }
            });
          });
        } else {
          let newCollection = cy.collection();
          const array1 = ["Processing", "web"];
          array1.forEach((value) => {
            // console.log(value)
            newCollection = newCollection.union(
              cy.filter(`node[tag.Application = "${value}"]`)
            );
          });
          newCollection.map(function (ele) {
            if (!ele.isOrphan() && ele.parent().data("label") != "parent") {
              ele.parent().move({
                parent: ele.data("tag.Application"),
              });
            } else {
              ele.move({
                parent: ele.data("tag.Application"),
              });
            }
            console.log(ele.data("name"), ele.data("tag.Application"));
          });
        }
        // cy.add(graphElements).layout(layout).run();

        // test-end

        // cy.nodes().map(function (ele) {
        //   ["Processing", "web"].forEach((value) => {
        //     // clone
        //     //   .nodes(`[id = '${value}']`)
        //     //   .data("isShow", true)
        //     //   .removeClass("hidden");
        //     // console.log(ele.nodes(`#${value}`))
        //     // if (ele.nodes(`#${value}`) == undefined) {
        //     //     cy.add({
        //     //       data: {
        //     //         type: "tag.Application",
        //     //         id: value,
        //     //         label: "parent",
        //     //       },
        //     //     });
        //     //   }
        //     if (ele.data(`tag.Application`) == value) {
        //       collection = ele.union(ele.successors());
        //       collection.filter("node[^parent]").move({
        //         parent: value,
        //       });
        //       // console.log("correct",ele.data(`id = '${value}'`) ,ele.nodes(`id = '${value}'`).hidden(), ele.data("parent"))
        //     } else {
        //       // ele.nodes().addClass("hidden")
        //       // console.log(ele.data("name"), ele.data("tag.Application"));
        //     }
        //   });

        //   // ["Front-end", "Back-end"].forEach((value) => {
        //   //   ele
        //   //     .nodes(`[id = '${value}']`)
        //   //     .data("isShow", true)
        //   //     .removeClass("hidden");
        //   //   if (ele.data(`tag.Owner`) == value) {
        //   //     collection = ele.union(ele.successors());
        //   //     collection.filter("node[^parent]").move({
        //   //       parent: value,
        //   //     });
        //   //   }
        //   // });
        // });
        // cy.elements().remove()
        // console.log(cy.nodes("[label='parent'][?isShow]"))
        cy.layout(layout).run();
      });

      let nowCollection = cy.collection();
      $("#onStructure").click(function () {
        // const nowCollection = cy.elements()
        //  _this.structureSelected.length == 0 &&
        if (_this.showFilterResult == false) {
          cy.json({
            elements: {
              nodes: _this.nodes,
              edges: _this.edges,
            },
          });
          let structureNode = [];
          let fitCollection = cy.collection();
          // onFilterApply();
          // cy.filter("node[type = 'structure']").remove();
          _this.structureSelected.map(function (value) {
            fitCollection = fitCollection.union(cy.filter(`node[?${value}]`));
          });
          fitCollection.map(function (ele) {
            _this.structureSelected.map(function (value) {
              if (structureNode.indexOf(ele.data(`${value}`)) == -1) {
                structureNode.push(ele.data(`${value}`));
              }
            });
            console.log(ele.data("name"), ele.data(_this.structureSelected[0]));
          });
          structureNode.map(function (value) {
            cy.add({
              data: {
                type: "structure",
                id: value,
                label: "parent",
              },
            });
          });
          // cy.filter("node[type = 'structure']").addClass("hidden")
          let collection = cy.collection();
          if (_this.filterTypeText == null) {
            cy.nodes().map(function (ele) {
              structureNode.forEach((value) => {
                if (ele.data(`${_this.structureSelected[0]}`) == value) {
                  console.log(ele.data("name"));
                  collection = ele.union(ele.parent());
                  if (ele.parent().isOrphan() || ele.nodes("[^parent]")) {
                    collection.filter("node[^parent]").move({
                      parent: value,
                    });
                  }
                  // collection
                  //   .difference(
                  //     collection.filter(`node[${_this.structureSelected[0]} ='${value}']`)
                  //   ).addClass("notfilter");
                }
              });
            });
          } else {
            let newCollection = cy.collection();
            structureNode.forEach((value) => {
              // console.log(value)
              newCollection = newCollection.union(
                cy.filter(`node["${_this.structureSelected[0]}"] = "${value}"]`)
              );
            });
            newCollection.map(function (ele) {
              if (!ele.isOrphan() && ele.parent().data("label") != "parent") {
                ele.parent().move({
                  parent: ele.data(`${_this.structureSelected[0]}`),
                });
              } else {
                // ele.ancestors().move({
                //   parent: ele.data(`${_this.structureSelected[0]}`),
                // });
                ele.move({
                  parent: ele.data(`${_this.structureSelected[0]}`),
                });
              }
              console.log(
                ele.data("name"),
                ele.data(`${_this.structureSelected[0]}`),
                ele.data("parent")
              );
            });
          }
          // cy.layout(layout).run();
        }
        // else if (_this.structureSelected.length == 0 && _this.filterTypeText != null) {
        //   nowCollection = cy.elements()
        // }
        else if (_this.structureSelected.length == 0) {
          onFilterApply();
          Filter();
        } else {
          Filter();
          // if(_this.showFilterResult){
          //    cy.elements().remove();
          //   cy.add(nowCollection);

          // }
          console.log("select", _this.structureSelected);
          let structureNode = [];
          let fitCollection = cy.collection();
          // onFilterApply();
          // cy.filter("node[type = 'structure']").remove();
          _this.structureSelected.map(function (value) {
            fitCollection = fitCollection.union(cy.filter(`node[?${value}]`));
          });
          fitCollection.map(function (ele) {
            _this.structureSelected.map(function (value) {
              if (structureNode.indexOf(ele.data(`${value}`)) == -1) {
                structureNode.push(ele.data(`${value}`));
              }
            });
            console.log(ele.data("name"), ele.data(_this.structureSelected[0]));
          });
          structureNode.map(function (value) {
            cy.add({
              data: {
                type: "structure",
                id: value,
                label: "parent",
              },
            });
          });
          // cy.filter("node[type = 'structure']").addClass("hidden")
          let collection = cy.collection();
          if (_this.filterTypeText == null) {
            cy.nodes().map(function (ele) {
              structureNode.forEach((value) => {
                if (ele.data(`${_this.structureSelected[0]}`) == value) {
                  console.log(ele.data("name"));
                  collection = ele.union(ele.parent());
                  if (ele.parent().isOrphan() || ele.nodes("[^parent]")) {
                    collection.filter("node[^parent]").move({
                      parent: value,
                    });
                  }
                  // collection
                  //   .difference(
                  //     collection.filter(`node[${_this.structureSelected[0]} ='${value}']`)
                  //   ).addClass("notfilter");
                }
              });
            });
          } else {
            let newCollection = cy.collection();
            structureNode.forEach((value) => {
              // console.log(value)
              newCollection = newCollection.union(
                cy.filter(`node["${_this.structureSelected[0]}"] = "${value}"]`)
              );
            });
            newCollection.map(function (ele) {
              if (!ele.isOrphan() && ele.parent().data("label") != "parent") {
                ele.parent().move({
                  parent: ele.data(`${_this.structureSelected[0]}`),
                });
              } else {
                // ele.ancestors().move({
                //   parent: ele.data(`${_this.structureSelected[0]}`),
                // });
                ele.move({
                  parent: ele.data(`${_this.structureSelected[0]}`),
                });
              }
              console.log(
                ele.data("name"),
                ele.data(`${_this.structureSelected[0]}`),
                ele.data("parent")
              );
            });
          }
          // if( cy.filter("node[type = 'structure']").isChildless() ){
          //   cy.filter("node[type = 'structure']").addClass("hidden")
          // } else {
          //   cy.filter("node[type = 'structure']").removeClass("hidden")
          // }
        }
        cy.layout(layout).run();
      });

      $("#resetFilter").click(function () {
        _this.filterType = null;
        _this.filterResult = null;
        _this.showFilterResult = false;
        _this.structureSelected = [];
        cy.json({
          elements: {
            nodes: _this.nodes,
            edges: _this.edges,
          },
        });
        // console.log(_this.nodes)
        // cy.elements().remove();
        // cy.add(clone).layout(layout).run();
        // cy.ready();
        cy.layout(layout).run();
        cy.nodes().removeClass("notfilter", "highlight");
      });

      $("#filterApply").click(function () {
        nowCollection = cy.elements();
        onFilterApply();
        Filter();
        cy.layout(layout).run();
      });

      function onFilterApply() {
        _this.structureSelected = [];
        cy.nodes().removeClass("notfilter");
        _this.showFilterResult = true;
      }

      function Filter() {
        cy.elements().remove();
        cy.add(clone);
        const query = `node[ ${_this.filterType} = '${_this.filterResult}']`;
        const checkFilterType = cy.filter(`node[?${_this.filterType}]`);
        const queryRegion = cy.filter(function (element, i) {
          return element.isOrphan() && cy.nodes(query);
        });

        let filteredNodes = cy.nodes(query);

        if (_this.filterResult == null) {
          _this.filterValText = "<empty-value>";
          const graphElements = checkFilterType
            .merge(checkFilterType.outgoers())
            .merge(checkFilterType.incomers())
            .merge(checkFilterType.parent());

          cy.elements().remove();
          cy.add(graphElements);

          _this.filterVal.map(function (value) {
            cy.add({
              data: {
                type: _this.filterType,
                id: value,
                label: "parent",
              },
            });
          });

          let collection1 = cy.collection();
          cy.nodes().map(function (ele) {
            _this.filterVal.forEach((value) => {
              if (ele.data(`${_this.filterType}`) == value) {
                collection1 = ele.union(ele.parent());
                collection1.filter("node[^parent]").move({
                  parent: value,
                });
              }
            });
          });
          const fitQueryElements = graphElements.filter(
            `node[label != 'parent'][?${_this.filterType}]`
          );
          fitQueryElements.map(function (ele) {
            console.log(ele.data("name"), ele.data(`${_this.filterType}`));
          });
          graphElements.difference(fitQueryElements).addClass("notfilter");
        } else {
          // I only want to successors of all Nodes, so I add only those and combine nodes and edges with union
          const graphElements = filteredNodes
            .merge(filteredNodes.incomers())
            .merge(filteredNodes.outgoers())
            .merge(filteredNodes.filter(`node[?parent]`).parent());

          // Apply changes on graph
          cy.elements().remove();
          cy.add(graphElements).layout(layout).run();
          graphElements
            .difference(graphElements.filter(query))
            .addClass("notfilter");
        }
      }

      $("#testMuti").click(function () {
        const query = `node[tag.Application = 'Processing'][tag.Project = 'Clouday1']`;
        const queryAry = ["?tag.Environment", "?tag.Application",];
        const queryString = AddqueryString();

        const queryNodes = cy.filter(queryString);

        function AddqueryString() {
          var string = "";
          queryAry.map((value) => {
            string += `[${value}]`;
          });
          return `node${string}`;
        }

        const queryNodes_col = cy.collection().union(queryNodes);
        const graphElements = queryNodes_col
          .merge(queryNodes_col.outgoers())
          .merge(queryNodes_col.incomers())
          .merge(queryNodes_col.parent());

        cy.elements().remove();
        cy.add(graphElements);

        let structureNode = {};
        queryNodes.map(function (ele) {
          queryAry.map((value, i) => {
            let queryType;
            if (value.includes("?")) {
              queryType = value.split("?")[1];
              if (Object.keys(structureNode).indexOf(queryType) == -1) {
                Object.assign(structureNode, { [`${queryType}`]: [] });
              }
              if (structureNode[queryType].indexOf(ele.data(queryType)) == -1) {
                structureNode[queryType].push(ele.data(queryType));
                // cy.add({
                //   data: {
                //     type: queryType,
                //     id: ele.data(queryType),
                //     label: "parent",
                //   },
                // });
              }
            } else {
              queryType = value.split("=");
              var queryVal = queryType[1].split("'")[1];
              if (Object.keys(structureNode).indexOf(queryType[0]) == -1) {
                Object.assign(structureNode, { [`${queryType[0]}`]: [] });
              }
              if (structureNode[queryType[0]].indexOf(queryVal) == -1) {
                structureNode[queryType[0]].push(queryVal);
                // cy.add({
                //   data: {
                //     type: queryType[0],
                //     id: queryVal,
                //     label: "parent",
                //   },
                // });
              }
            }
          });
        });

        let newAryCollection = [];
        function testAry() {
          Object.entries(structureNode).forEach(([key, value]) => {
            let newAry = [];
            value.forEach((val) => {
              var string = `${key}='${val}'`;
              // console.log(`[${key}='${val}']`);
              newAry.push(string);
            });
            newAryCollection.push(newAry);
          });
          // console.log("newAryCollection",newAryCollection)
          return newAryCollection;
        }

        function spiltFilterString(val) {
          var p_type = val.split("=");
          var p_val = p_type[1].split("'")[1];
          return [p_type[0], p_val];
        }

        function checkIsFilterNode2(val, val2) {
          return cy.filter(`node[id=${spiltFilterString(val)[1]}]`).empty &&
            cy.filter(`node[id=${spiltFilterString(val2)[1]}]`).empty
            ? cy.add([
                {
                  data: {
                    type: spiltFilterString(val)[0],
                    id: `${spiltFilterString(val)[0]}:${
                      spiltFilterString(val)[1]
                    }`,
                    label: "parent",
                  },
                },
                {
                  data: {
                    type: spiltFilterString(val2)[0],
                    id: `${spiltFilterString(val2)[0]}:${
                      spiltFilterString(val2)[1]
                    }`,
                    label: "parent",
                  },
                },
              ])
            : cy.filter(`node[id=${spiltFilterString(val)[1]}]`).empty
            ? cy.add({
                data: {
                  type: spiltFilterString(val)[0],
                  id: `${spiltFilterString(val)[0]}:${
                    spiltFilterString(val)[1]
                  }`,
                  label: "parent",
                },
              })
            : cy.filter(`node[id=${spiltFilterString(val2)[1]}]`).empty
            ? cy.add({
                data: {
                  type: spiltFilterString(val2)[0],
                  id: `${spiltFilterString(val2)[0]}:${
                    spiltFilterString(val2)[1]
                  }`,
                  label: "parent",
                },
              })
            : console.log("has nodes");
        }

        function checkIsFilterNode(val, val2) {
          if (cy.filter(`node[id=${spiltFilterString(val)[1]}]`).empty) {
            cy.add({
              data: {
                type: spiltFilterString(val)[0],
                id: `${spiltFilterString(val)[1]}`,
                label: "parent",
                text: `${spiltFilterString(val)[0]}:${
                  spiltFilterString(val)[1]
                }`,
              },
            });
          }
          if (
            spiltFilterString(val2)[0] != "tag.Application" &&
            cy.filter(`node[id=${spiltFilterString(val2)[1]}]`).empty
          ) {
            cy.add({
              data: {
                type: spiltFilterString(val2)[0],
                id: `${spiltFilterString(val2)[1]}`,
                label: "parent",
                text: `${spiltFilterString(val2)[0]}:${
                  spiltFilterString(val2)[1]
                }`,
              },
            });
          }
          if (spiltFilterString(val)[0] == "tag.Application") {
            cy.add({
              data: {
                type: spiltFilterString(val2)[0],
                id: `${spiltFilterString(val2)[1]}`,
                label: "parent",
                text: `${spiltFilterString(val2)[0]}:${
                  spiltFilterString(val2)[1]
                }`,
              },
            });
          }
        }

        newAryCollection = testAry();
        console.log("newAryCollection", newAryCollection);
        newAryCollection.map(function (value, index, array) {
          if (newAryCollection.length > index + 1) {
            value.forEach((val, i) => {
              let queryNodesWithParent = cy.collection();
              cy.add({
                data: {
                  type: spiltFilterString(val)[0],
                  id: `${spiltFilterString(val)[1]}${i}`,
                  label: "parent",
                  text: `${spiltFilterString(val)[0]}:${
                    spiltFilterString(val)[1]
                  }`,
                },
              });
              array[index + 1].forEach((val2, i2) => {
                if (!queryNodes.filter(`node${val}${val2}`).empty()) {
                  // checkIsFilterNode(val, val2);
                  console.log("arr_2:", val, val2);

                  cy.add({
                    data: {
                      type: spiltFilterString(val2)[0],
                      id: `${spiltFilterString(val2)[1]}${i}`,
                      label: "parent",
                      text: `${spiltFilterString(val2)[0]}:${
                        spiltFilterString(val2)[1]
                      }`,
                    },
                  });
                  queryNodes.filter(`node[${val}][${val2}]`).map((ele) => {
                    queryNodesWithParent = queryNodesWithParent
                      .union(ele)
                      .union(ele.parent());
                    console.log(ele.data("name"));
                    queryNodesWithParent
                      .filter("node[^parent][label!='parent']")
                      .move({
                        parent: `${spiltFilterString(val2)[1]}${i}`,
                      });
                    queryNodesWithParent = queryNodesWithParent.union(
                      ele.ancestors()
                    );
                  });
                } else {
                  console.log(`${i}-${i2}: node${val}${val2}`);
                  console.log("no fit");
                  console.log("==============");
                }
              });
              //  console.log("========");

              //                   queryNodesWithParent.filter(`node[^parent][label='parent']`).map((ele) => {
              //                     console.log(ele.data("name") || ele.data("text"));
              //                   });

              //                     console.log("========");

              queryNodesWithParent
                .filter(`node[^parent][label='parent']`)
                .move({
                  parent: `${spiltFilterString(val)[1]}${i}`,
                });
              // cy.filter(`node[id='${spiltFilterString(val)[1]}${2-1}']`).map((ele) => {
              //       console.log("=====",ele.data("text"));

              // })
            });
          }
          cy.filter("node[label='parent']").map((ele) => {
            if (ele.isChildless()) {
              console.log("hidden", ele.data("text"));
              ele.addClass("hidden");
            }
          });
        });

        console.log("structureNode", structureNode);

        // cy.add([{
        //   data: {
        //     type: "tag.Application",
        //     id: "Processing1",
        //     label: "parent",
        //   }
        // },{
        //   data: {
        //     type: "tag.Application",
        //     id: "Database1",
        //     label: "parent",
        //   }
        // },{
        //   data: {
        //     type: "tag.Application",
        //     id: "database1",
        //     label: "parent",
        //   }
        // },{
        //   data: {
        //     type: "tag.Application",
        //     id: "web1",
        //     label: "parent",
        //   }
        // },{
        //   data: {
        //     type: "tag.Application",
        //     id: "processing1",
        //     label: "parent",
        //   }
        // }
        // ]);

        // console.log("structureNode",structureNode)
        let collection1 = cy.collection();
        const filterParent = cy.filter("node[label='parent']");
        queryNodes.filter("node[^label]").map(function (nodes) {
          filterParent.filter("node[type='tag.Environment']").map((eles) => {
            filterParent.filter("node[type!='tag.Environment']").map((ele) => {
              if (
                nodes.data(eles.data("type")) == eles.data("id") &&
                nodes.data(ele.data("type")) == ele.data("id")
              ) {
                collection1 = nodes.union(nodes.parent());
                collection1.filter("node[^parent][^label]").move({
                  parent: ele.data("id"),
                });
              }
              if (nodes.data(ele.data("type")) == ele.data("id")) {
                collection1 = nodes.union(nodes.parent());
                collection1.filter("node[^parent][^label]").move({
                  parent: ele.data("id"),
                });
              }
            });
          });
        });

        graphElements.difference(queryNodes).addClass("notfilter");

        cy.layout(layout).run();
      });

      //       [{type:"tag.Application"},{}].map(function (value) {
      //             console.log(value)
      //       });

      //       const entries = Object.entries({"tag.Application":["aa","bb"],"tag.Project":["CC"]});

      // console.log("entries",entries);

      $("#testMutiFilter").click(function () {
        testMutiFilter();
      });
      function testMutiFilter() {
        console.log("click");
        const query = `node[ tag.Application = 'Processing'][tag.Project = 'Clouday1']`;
        const checkFilterType = cy.filter(`node[?tag.Application][?Project]`);
        let filteredNodes = cy.nodes(query);
        // filteredNodes.map(function(ele) {
        //   console.log(ele.data("name"))
        // })
        const graphElements = checkFilterType
          .merge(checkFilterType.outgoers())
          .merge(checkFilterType.incomers())
          .merge(checkFilterType.parent());

        cy.elements().remove();
        cy.add(graphElements);

        let collection1 = cy.collection();
        cy.nodes().map(function (ele) {
          _this.filterVal.forEach((value) => {
            if (ele.data(`${_this.filterType}`) == value) {
              collection1 = ele.union(ele.parent());
              collection1.filter("node[^parent]").move({
                parent: value,
              });
            }
          });
        });
        const fitQueryElements = graphElements.filter(
          `node[label != 'parent'][?${_this.filterType}]`
        );
        fitQueryElements.map(function (ele) {
          console.log(ele.data("name"), ele.data(`${_this.filterType}`));
        });
        graphElements.difference(fitQueryElements).addClass("notfilter");
      }
      // let nodeList = cy.nodes().orphans();
      // const query2 = 'node[region = "us-west-2"]';
      // const query3 = 'node[region = "us-west-1"]';
      // const tagquery = 'node[tag.Project = "Clouday1"]';

      // cy.add([
      //   {
      //     data: {
      //       type: "region",
      //       id: "us-west-2",
      //       region: "us-west-2",
      //     },
      //   },
      // ]);
      // let filteredNodes2 = cy.nodes(query2);
      // let filteredNodes3 = cy.nodes(query3);
      // let filteredNodes4 = cy.nodes(tagquery);

      // if (nodeList) {
      //   filteredNodes3.orphans().move({
      //     parent: "us-west-1",
      //   });
      //   filteredNodes2.orphans().move({
      //     parent: "us-west-2",
      //   });
      // }

      // const graphElements = cy.nodes().union(cy.nodes().successors());
      // const graphElements = filteredNodes3.union(filteredNodes3.successors());
      // var notConnected = cy.elements().not(graphElements);
      // notConnected = cy.remove(notConnected);
      // setTimeout(function () {
      // cy.add(notConnected)
      // cy.layout().run();
      // }, 1000);

      cy.on("mouseover", "node", function (e) {
        var sel = e.target;
        // cy.elements()
        //   .difference(sel.outgoers())
        //   .not(sel)
        //   .addClass("semitransp");
        sel.addClass("highlight").outgoers().addClass("highlight");
      });

      cy.on("mouseout", "node", function (e) {
        var sel = e.target;
        // cy.elements().removeClass("semitransp");
        sel.removeClass("highlight").outgoers().removeClass("highlight");
      });
      cy.on("tap", function (event) {
        if (event.target === cy) {
          cy.elements().removeClass("clickstyle");
          _this.isRightSidebarOpen = false;
        }
      });
      cy.on("tap", "node", function (e) {
        _this.isRightSidebarOpen = true;
        if (_this.isRightSidebarOpen) {
        }
        cy.elements().removeClass("clickstyle");

        e.target.addClass("clickstyle").outgoers().addClass("clickstyle");
        // console.log(this.nodes+"nodes")

        const filterOpt = ["id", "url", "parent", "type", "account_id"];
        this.targetNode = e.target.data();
        _this.newTargetObj = {};
        for (var i in this.targetNode) {
          if (filterOpt.indexOf(i) == -1) {
            const index = `${i.charAt(0).toUpperCase()}${i.slice(1)}`;

            _this.newTargetObj = Object.assign(_this.newTargetObj, {
              [index]: this.targetNode[i],
            });
            // _this.newTargetObj = JSON.stringify(_this.newTargetObj)
            // console.log(newTargetObj)
            // console.log(index+":"+this.targetNode[i])
          }
        }
        // console.log(JSON.stringify(_this.newTargetObj))
      });

      var defaults = {
        container: false, // html dom element
        viewLiveFramerate: 0, // set false to update graph pan only on drag end; set 0 to do it instantly; set a number (frames per second) to update not more than N times per second
        thumbnailEventFramerate: 30, // max thumbnail's updates per second triggered by graph updates
        thumbnailLiveFramerate: false, // max thumbnail's updates per second. Set false to disable
        dblClickDelay: 200, // milliseconds
        removeCustomContainer: false, // destroy the container specified by user on plugin destroy
        rerenderDelay: 100, // ms to throttle rerender updates to the panzoom for performance
      };

      var nav = cy.navigator(defaults);
    },
  },
  async mounted() {
    let params = JSON.parse(sessionStorage.getItem("item"));
    this.requestID = params.requestID;
    this.archName = params.archName;

    let _this = this;
    const dataURL =
      // "https://o6q2hh5nkpdfq4qmzh2s7vexqi0aovau.lambda-url.us-west-2.on.aws/";
      "https://3qgd653iwxosnngnisli7ybxrq0xqqgt.lambda-url.us-west-2.on.aws/";
    try {
      // this.loading = true
      await axios
        .get(dataURL, { params: { requestid: this.requestID } })
        .then((res) => {
          // console.log(JSON.parse(res.data.message))
          var JSONdata = JSON.parse(res.data.message);
          this.nodes = JSONdata[0];
          this.edges = JSONdata[1];
          // this.nodes = res.data[0];
          // this.edges = res.data[1];
        })
        .catch((err) => {
          console.log(err);
        });
      this.ListIncludeResourceType();
      this.ListIncludeResourceRegion();
      this.ListIncludeAccountID();
      this.ListIncludeTag();
      this.Addimg();
      // console.log(this.nodes)
      await this.createCytoscape(_this);
    } catch (e) {
      this.errors.push(e);
    }
  },
};
</script>

<style lang="scss">
.navbar {
  display: none;
}

#cy {
  max-width: 100%;
  /* height: 75%; */
  height: 450px;
  border: 2px solid #a1a1a1;
  border-radius: 5px;
  color: #cccccc;
  margin: 10px 15px;
  background-image: radial-gradient(#bebebe7b 1px, transparent 0);
  background-size: 18px 18px;
  /* position: relative; */
  /* position: absolute; */
  /* left: 0; */
  /* top: 0; */
  z-index: 1;
}

h1 {
  opacity: 0.5;
  font-size: 1em;
}

main {
  transition: all 0.3s ease;
  margin-left: 50px;
  padding: 8px 8px 0;
  &.active {
    margin-left: 250px;
  }
}

.close-sidebar {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50px;
  height: 100%;
  background: #343a40;
  transition: all 0.3s ease;
  button,
  button:hover {
    background: transparent;
    border: 0;
    .b-icon {
      color: rgb(235, 235, 235);
    }
  }
}

.b-icon.delete-icon {
  font-size: 20px;
}

.leftSidebar-menu {
  // background: #000 !important;
  li {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 4px 0;
  }
  hr {
    background: rgba(255, 255, 255, 0.196);
  }
}

.cytoscape-navigator {
  z-index: 1;
}

.filter-panel {
  width: 450px;
  select {
    margin-right: 8px;
  }
}

.filter-result {
  margin-left: 15px;
  font-weight: bold;
  color: #818181;
}

.sidebar-title {
  color: rgba(255, 255, 255, 0.228);
}
</style>
