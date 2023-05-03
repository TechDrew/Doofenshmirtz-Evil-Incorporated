import { useActiveViewport } from "@itwin/appui-react";
import React, { useEffect } from "react";
import RealityDataApi from "./RealityDataApi";
import "./MyFirstWidget.css";
import { Button, ToggleSwitch } from "@itwin/itwinui-react";
import { ColorDef, ContextRealityModelProps } from "@itwin/core-common";
import { ColorPickerButton } from "@itwin/imodel-components-react";
import { Id64Array } from "@itwin/core-bentley";
import { BuildingGroup, BuildingGroupListItem } from "./BuildingGroupComponent";

export const MyFirstWidget: React.FC = () => {
  const viewport = useActiveViewport();

  const [initialized, setInitialized] = React.useState<boolean>(false);
  const [realityModels, setRealityModelList] = React.useState<ContextRealityModelProps[]>([]);
  const [countOfClicks, setCount] = React.useState<number>(0);
  const [listOfThings, setListOfThings] = React.useState<string[]>([]);
  const [classifier, setClassifier] = React.useState<string>("");
  const [hiliteColor, setHiliteColor] = React.useState<ColorDef>(ColorDef.black);
  const [selectedbuildings, setSelectedBuildings] = React.useState<BuildingGroup[]>([])

  useEffect(() => {
    const asyncInitialize = async () => {
      if (viewport) {
        const realityModels = await RealityDataApi.getRealityModels(viewport.iModel);
        setRealityModelList(realityModels);
        const classifiers = await RealityDataApi.getAvailableClassifierListForViewport(viewport);
        if(classifiers) {
          setClassifier(classifiers[0].value);
        }
        setHiliteColor(viewport.hilite.color);
      }
    };

    if (!initialized) {
      void asyncInitialize().then (() => { setInitialized(true);})
    }
  });

  const togglePhillyReality = async (e:React.ChangeEvent<HTMLInputElement>) => {
    if (viewport) {
      for (const model of realityModels) {
        if (model.name === "Philadelphia_2015") {
          RealityDataApi.toggleRealityModel(model, viewport, e.target.checked);
          RealityDataApi.setRealityDataClassifier(viewport, classifier);
        }
      }
    }
  }
  const onColorChange = async (newColor: ColorDef) => {
    if (viewport) {
      viewport.hilite = {...viewport.hilite, color: newColor};
    }
  }


const somethingSilly = async () => {
  const newCount = countOfClicks + 1;
  setCount(newCount);
  alert(`PERRY THE PLATYPUS?!?!? ${countOfClicks}`);
  setListOfThings([...listOfThings, "Parry's Mind: Why is this such a shocker still???"])
}

const TheFuture = async () => {
  viewport?.zoomToElements(viewport?.iModel.selectionSet.elements);
}
const thingList = listOfThings.map((thing: string) => <li>{thing}</li>);

  function addNewGroup(): void {
    const newBuildingGroup = {name: "new", buildings:[]};
    setSelectedBuildings([...selectedbuildings, newBuildingGroup])
  }
  const handleItemChange = (oldItem: BuildingGroup, newItem: BuildingGroup) => {
    const newList = selectedbuildings.map((item) => item.name === oldItem.name ? newItem : item);
    setSelectedBuildings(newList);
  }

  const buildingGroups: JSX.Element[] = []
  selectedbuildings.forEach( (value: BuildingGroup) => {
    buildingGroups.push(<BuildingGroupListItem item={value} handleItemChange={handleItemChange} />);
  });

  return (
    <div>
      This is my first widget
      <ToggleSwitch onChange={togglePhillyReality} label='Philly Reality Data' />
      <ColorPickerButton initialColor={hiliteColor} onColorPick={onColorChange} />
      <Button onClick={addNewGroup}>Add New Group</Button>
      <Button onClick={somethingSilly}>Doofenshmirtz seeing Perry put on his hat</Button>
      <Button onClick={TheFuture}>Kenbunshoku Haki</Button>
      {buildingGroups}
      <ul>
        {thingList}
      </ul>
    </div>
  );
};


