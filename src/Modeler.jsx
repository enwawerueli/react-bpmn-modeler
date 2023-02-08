import React, { Component, createRef } from "react";
import Modeler from "bpmn-js/lib/Modeler";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from "bpmn-js-properties-panel";
import CamundaBpmnModdle from "camunda-bpmn-moddle/resources/camunda.json";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js-properties-panel/dist/assets/element-templates.css";
import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

const diagramXML = `
  <?xml version="1.0" encoding="UTF-8"?>
  <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">
    <bpmn2:process id="Process_1" isExecutable="false">
      <bpmn2:startEvent id="StartEvent_1"/>
    </bpmn2:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
      <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
        <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
          <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>
        </bpmndi:BPMNShape>
      </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
  </bpmn2:definitions>
`;

export default class extends Component {
  constructor(props) {
    super(props);
    this.modelerRef = createRef(null);
    this.modelerContainerRef = createRef(null);
    this.propertiesPanelContainerRef = createRef(null);
    this.handleBpmnFileUpload = this.handleBpmnFileUpload.bind(this);
  }

  componentDidMount() {
    const modeler = new Modeler({
      container: this.modelerContainerRef.current,
      keyboard: { bindTo: document },
      moddleExtensions: { camunda: CamundaBpmnModdle },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        CamundaPlatformPropertiesProviderModule,
      ],
      propertiesPanel: { parent: this.propertiesPanelContainerRef.current },
    });
    const canvas = modeler.get("canvas");
    canvas.zoom("fit-viewport");
    modeler.importXML(diagramXML).catch((error) => {
      console.log(error);
    });
    this.modelerRef.current = modeler;
  }

  componentWillUnmount() {
    this.modelerRef.current?.destroy();
  }

  handleBpmnFileUpload(e) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.modelerRef.current.importXML(e.target.result);
    };
    reader.onerror = (error) => {
      console.error(error);
    };
    reader.readAsText(e.target.files[0]);
  }

  saveDiagram() {
    this.modelerRef.current
      .saveXML({ format: true })
      .then((result) => {})
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div ref={this.modelerContainerRef} style={{ width: "75%" }} />
        <div style={{ width: "25%" }}>
          <div ref={this.propertiesPanelContainerRef} />
          <div style={{paddingTop: "1rem"}}>
            <label htmlFor="bpmn-file-upload">Upload BPMN file</label>
            <br />
            <input
              id="bpmn-file-upload"
              type="file"
              accept=".bpmn"
              onChange={this.handleBpmnFileUpload}
            />
          </div>
        </div>
      </div>
    );
  }
}
