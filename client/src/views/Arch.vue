<template>
  <div id="box">
    <main :class="{active: isLeftSidebarOpen}">
      <b-button v-b-toggle.leftSidebar variant="outline-secondary" v-show=!isLeftSidebarOpen
      ><b-icon icon="layout-sidebar-inset"></b-icon
    ></b-button>
    <div>
      <b-dropdown id="dropdown-form" ref="dropdown" class="m-2">
        <template #button-content>
          <b-icon icon="filter-circle-fill" class="mr-1"></b-icon
          ><span> Filter</span>
        </template>
        <b-dropdown-form class="filter-panel">
          <small>Add an item to start your diagram.</small>
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
            <b-button variant="info" @click="onClick" id="filterApply"
              >Apply</b-button
            >
          </div>
        </b-dropdown-form>
      </b-dropdown>
    </div>
    <div class="mt-3">
      Selected: <strong>{{ filterType }}{{ filterResult }}</strong>
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
    <b-sidebar
      id="leftSidebar"
      class="leftSidebar-menu"
      width="280px"
      shadow
      v-model="isLeftSidebarOpen"
      bg-variant="dark"
      text-variant="light"
    >
      <div class="px-3 py-2">
        <div>
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
var navigator = require('cytoscape-navigator');

navigator( cytoscape ); // register extension
/*eslint-disable*/

export default {
  name: "cytoscape",
  components: {
    JsonTree,
    // Multiselect
  },
  data() {
    return {
      nodes: [],
      edges: [],
      // nodes: [
      //   {
      //     data: {
      //       id: "n0",
      //     },
      //   },
      //   {
      //     data: {
      //       id: "n1",
      //     },
      //   },
      //   {
      //     data: {
      //       id: "n2",
      //     },
      //   },
      //   {
      //     data: {
      //       id: "n3",
      //     },
      //   },
      // ],
      // edges: [
      //   {
      //     data: {
      //       source: "n2",
      //       target: "n1",
      //     },
      //   },
      //   {
      //     data: {
      //       source: "n2",
      //       target: "n3",
      //     },
      //   },
      //   {
      //     data: {
      //       source: "n2",
      //       target: "n0",
      //     },
      //   },
      //   {
      //     data: {
      //       source: "n1",
      //       target: "n0",
      //     },
      //   },
      //   {
      //     data: {
      //       source: "n0",
      //       target: "n1",
      //     },
      //   },
      // ],
      loading: false,
      newTargetObj: {},
      filterOpt: ["id", "url", "parent", "type"],
      isRightSidebarOpen: false,
      isLeftSidebarOpen: true,
      ResourceTypeResult: [],
      ResourceRegionResult: [],
      ResourceAccountID: [],
      ResourceTag: [],
      filterOptions: [
        { value: null, text: "Select an option", disabled: true },
        { value: "account_id", text: "Account" },
        { value: "region", text: "Region" },
        {
          label: "Tag",
          options: [
            { value: "tag.Application", text: "Application" },
            { value: "tag.Department", text: "Application" },
            { value: "tag.Environment", text: "Environment" },
            { value: "tag.Owner", text: "Owner" },
            { value: "tag.Project", text: "Project" },
          ],
        },
      ],
      filterType: null,
      filterVal: [],
      filterResult: "",
      tag: {
        Application: ["Processing", "web"],
        Department: ["Intership"],
        Environment: ["Prod", "Pre-Prod"],
        Owner: ["Front-end", "Back-end"],
        Project: ["Clouday1"],
      },
    };
  },
  watch: {

    filterType: function () {
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
      this.$refs.dropdown.hide(true);
    },
    //     test(cy) {
    //       // print all the ids of the nodes in the graph
    // cy.nodes().forEach(function( ele ){
    //  console.log( ele.id() );
    // });
    //     },
    add() {
      // this.newTargetObj = { title: "DynamoDB", url: "https://audio-json.s3.us-west-2.amazonaws.com/img/Arch_Amazon-DynamoDB_32.png" }
      console.log("test", this.newTargetObj);
      console.log("testnode", this.targetNode);
    },
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
        ready: function () {},
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
          //节点数据
          nodes: this.nodes,
          //
          edges: this.edges,
        },

        layout: layout,

        style: [
          {
            selector: "node",
            style: {
              //   "background-color": "#11479e",
              // "background-color": "#000",
              // content: function(node) {
              //   return node.data("type") + "\n" + node.data("name");
              // },
              content: function (node) {
                if (node.data("arn")) return node.data("arn");
                else return node.data("id");
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
              width: 2,
              "text-valign": "top",
              "text-halign": "left",
              "background-color": "#fff",
              // "border-color": "#be0e8d",
              "border-color": function (node) {
                if (node.data("type") == "Account") return "#000";
                else return "#be0e8d";
              },
              "text-margin-x": 300,
              "text-margin-y": -15,
              "font-size": "22px",
              "font-weight": 700,
              padding: "35px",
              content: function (node) {
                if (node.data("type") == "Account")
                  return `${node.data("type")} (${node.data("name")})`;
                else if (node.data("type") == "region") return node.data("id");
                else return node.data("id");
              },
              "background-position-x": "0",
              "background-position-y": "0",
              "background-fit": "none",
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
              "border-width": "2px",
              // height: "52px",
              // width: "52px",
            },
          },
          {
            selector: "node.clickstyle",
            style: {
              "border-color": "rgb(96, 178, 240)",
              "border-width": "3px",
              // height: "52px",
              // width: "52px",
            },
          },
          {
            selector: "node.semitransp",
            style: { opacity: "1" },
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
      });

      var parentNodes = cy.nodes(":parent");
      parentNodes
        .descendants()
        .layout({
          name: "grid",
          cols: 2,
        })
        .run();

      var clone = cy.elements();

      $("#filterApply").click(function () {
        cy.elements().remove();
        cy.add(clone);

        const query = `node[ ${_this.filterType} = '${_this.filterResult}']`;

        let filteredNodes = cy.nodes(query);

        // I only want to successors of all Nodes, so I add only those and combine nodes and edges with union
        const graphElements = filteredNodes.union(filteredNodes.successors());
        // Apply changes on graph
        cy.elements().remove();
        // console.log(graphElements)
        cy.add(graphElements).layout(layout).run();
        // layout(layout).run();
      });

      let nodeList = cy.nodes().orphans();
      const query2 = 'node[region = "us-west-2"]';
      const query3 = 'node[region = "us-west-1"]';
      const tagquery = 'node[tag.Project = "Clouday1"]';

      cy.add([
        {
          data: {
            type: "region",
            id: "us-west-2",
            region: "us-west-2",
          },
        },
      ]);
      let filteredNodes2 = cy.nodes(query2);
      let filteredNodes3 = cy.nodes(query3);
      let filteredNodes4 = cy.nodes(tagquery);

      if (nodeList) {
        filteredNodes3.orphans().move({
          parent: "us-west-1",
        });
        filteredNodes2.orphans().move({
          parent: "us-west-2",
        });
      }

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
        cy.elements()
          .difference(sel.outgoers())
          .not(sel)
          .addClass("semitransp");
        sel.addClass("highlight").outgoers().addClass("highlight");
      });

      cy.on("mouseout", "node", function (e) {
        var sel = e.target;
        cy.elements().removeClass("semitransp");
        sel.removeClass("highlight").outgoers().removeClass("highlight");
      });

      cy.on("tap", "node", function (e) {
        _this.isRightSidebarOpen = true;
        // console.log(this.nodes+"nodes")
        cy.elements().removeClass("clickstyle");
        e.target.addClass("clickstyle").outgoers().addClass("clickstyle");

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
    alert(sessionStorage.getItem("requestID"));
    let _this = this;
    const dataURL =
      "https://o6q2hh5nkpdfq4qmzh2s7vexqi0aovau.lambda-url.us-west-2.on.aws/";
    try {
      // this.loading = true
      await axios
        .get(dataURL)
        .then((res) => {
          // console.log(res.data[0])
          this.nodes = res.data[0];
          this.edges = res.data[1];
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
#cy {
  max-width: 100%;
  /* height: 75%; */
  height: 400px;
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
  &.active {
    margin-left: 280px;
  }
}

.leftSidebar-menu {
  background: #000 !important;
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



</style>
